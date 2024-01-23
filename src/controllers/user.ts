import uniqid from "uniqid";
import pool from "../connection.js";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
const con = await pool.getConnection();

export const logUser = async (req: Request, res: Response) => {
  //Determine if user already exists
  try {
    const findUserQuery = "SELECT * FROM users WHERE user_email = ?;";
    const userEmail = req.body.user_email;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: any = await con.query(findUserQuery, userEmail);
    // let userOptions = {user_id: user.}
    // let userArray = new UserArray(user);

    //If user does not already exist
    if (!user[0].length) {
      //Post new user
      const populateUserQuery =
        "INSERT INTO users (user_id, user_email, user_pass, user_company_name) VALUES ?;";
      const userId = uniqid();
      const userPass = req.body.user_pass;
      const userCompany = req.body.user_company_name;
      const populateUserValues = [[userId, userEmail, userPass, userCompany]];
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
      const accessToken: string | undefined = process.env.access_token;
      if (!accessToken) return res.status(500).send("Access token not found");
      const id = user[0][0].user_id;
      const token = jwt.sign({ id }, accessToken, { expiresIn: 300 });
      return res.json({
        auth: true,
        token: token,
        user_id: id,
        status: 200,
      });
    }
  } catch (err) {
    return res.status(500).send(err + "Initialial table population failed");
  } finally {
    con.release();
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
