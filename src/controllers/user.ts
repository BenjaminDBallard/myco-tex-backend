/* eslint-disable @typescript-eslint/no-explicit-any */
import uniqid from "uniqid";
import pool from "../connection.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { SECRET_KEY } from "../middleware/verifyJwt.js";

const con = await pool.getConnection();

export const signUp = async (req: Request, res: Response) => {
  //Determine if user already exists
  try {
    const findUserQuery = "SELECT * FROM users WHERE user_email = ?;";
    const { user_email, user_pass } = req.body;
    const hash = await bcrypt.hash(user_pass, 13);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: any = await con.query(findUserQuery, user_email);
    // let userOptions = {user_id: user.}
    // let userArray = new UserArray(user);

    //If user does not already exist
    if (!user[0].length) {
      //Post new user
      const populateUserQuery =
        "INSERT INTO users (user_id, user_email, user_pass, user_company_name) VALUES ?;";
      const userId = uniqid();
      const userCompany = req.body.user_company_name;
      const populateUserValues = [[userId, user_email, hash, userCompany]];
      await con.query(populateUserQuery, [populateUserValues]);

      //Post new location to user
      const populateLocationQuery =
        "INSERT INTO location (user_id, location_id, location_title) VALUES ?;";
      const locationId = uniqid();
      const locationTitle = userCompany;
      const populateLocationValues = [[userId, locationId, locationTitle]];
      await con.query(populateLocationQuery, [populateLocationValues]);

      //Post new rooms to location
      const populateRoomsQuery =
        "INSERT INTO room (location_id, room_id, room_title) VALUES ?;";
      const populateRoomsValues = [
        [locationId, uniqid(), "Mixer"],
        [locationId, uniqid(), "Steamer"],
        [locationId, uniqid(), "Lab"],
        [locationId, uniqid(), "Incubation"],
      ];
      await con.query(populateRoomsQuery, [populateRoomsValues]);

      return res.status(200).send("user_id: " + userId);
    } else {
      return res
        .status(400)
        .send("email is already associated with an account");
    }
  } catch (err) {
    return res.status(500).send(err + "User creation failed");
  } finally {
    con.release();
  }
};

export const logIn = async (req: Request, res: Response) => {
  try {
    //Determine if user already exists
    const { user_email, user_pass } = req.body;
    const findUserQuery = "SELECT * FROM users WHERE user_email = ?;";
    const userArray: any = await con.query(findUserQuery, user_email);

    //If user does not exist (error)
    if (!userArray[0].length) {
      return res.status(400).send("Incorrect username or password");
    }

    //If user does exist, verify password
    const isValid = await bcrypt.compare(user_pass, userArray[0][0].user_pass);

    //If incorrect password (error)
    if (!isValid) {
      return res.status(400).send("Incorrect username or password");
    }

    //If secret SECRET_KEY does not exist (error)
    if (!SECRET_KEY) return res.status(500).send("Access token not found");

    //If secret SECRET_KEY does exist generate JWT
    const id: string = userArray[0][0].user_id;
    const token = jwt.sign({ id }, SECRET_KEY, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id }, SECRET_KEY, { expiresIn: "24h" });

    res.cookie("x-refresh-token", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
    });
    res.header("x-access-token", token).send(id);
  } catch (err) {
    return res.status(500).send(err + "Unable to log in");
  } finally {
    con.release();
  }
};

export const refreshJWT = async (req: Request, res: Response) => {
  const refreshToken = req.cookies["x-refresh-token"];

  if (!refreshToken) {
    return res.status(401).send("Access Denied. No refresh token provided.");
  }

  try {
    const decoded = jwt.verify(refreshToken, SECRET_KEY) as JwtPayload;
    const token = jwt.sign({ id: decoded.id }, SECRET_KEY, { expiresIn: "1h" });
    const NewRefreshToken = jwt.sign({ id: decoded.id }, SECRET_KEY, {
      expiresIn: "24h",
    });

    res
      .cookie("x-refresh-token", NewRefreshToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .header("x-access-token", token)
      .send(decoded.id);
  } catch (error) {
    return res.status(400).send("Invalid refresh token.");
  }
};

export const getUser = async (req: Request, res: Response) => {
  const sql = "SELECT * FROM users WHERE user_id = ?;";
  try {
    //This user id is passed to us by verifyJWT()
    const jwtUserID = req.params.user_id;
    //sql query implicitly only allows users to look at their own user info
    const formattedSql = con.format(sql, jwtUserID);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const users: any = await con.query(formattedSql);

    if (users.length === 0) return res.status(500).send("user does not exist");

    const sqlUserID = users[0][0].user_id;

    //if user id in db is different from user id provided in request, throw error
    if (sqlUserID !== jwtUserID) {
      return res
        .status(401)
        .send("You do not have permission to view this user");
    }

    return res.status(200).json(users[0][0]);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const fields = ["user_email", "user_pass", "user_company_name"];

  //This user id is passed to us by verifyJWT()
  const jwtUserID = req.params.user_id;
  const setClauses = fields.map((field) => `${field} = ?`);
  const values = fields.map((field) => {
    const value = req.body[field];
    return value != null ? value : null; // If value is null or undefined, replace with null
  });

  //sql query implicitly only allows users to edit their own user info
  const sql = `UPDATE users SET ${setClauses.join(", ")} WHERE user_id = ?`;
  values.push(jwtUserID);

  const con = await pool.getConnection();
  try {
    const formattedSql = con.format(sql, values);

    const [rows] = await con.query(formattedSql);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tabularRow: any = rows;

    if (tabularRow.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "User not found or unauthorized" });
    }

    // After updating, fetch the updated job data
    const [updatedUser] = await con.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [jwtUserID]
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tabularData: any = updatedUser;

    return res.status(200).json(tabularData); // Assumes the first record is the updated job data
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
