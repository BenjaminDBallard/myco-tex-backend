import uniqid from "uniqid";
import { NextFunction } from "express";
import pool from "../connection.js";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
const con = await pool.getConnection();

/*This middleware function can be used before accessing protected routes to confirm that
1) An auth-token is present on the request
2) The auth-token in the request is valid
If both conditions are met, then the next() function is called, allowing access to the protected route

Example of how to use verifyJWT:
router.post("/protected-route", verifyJWTFunction, protectedRouteFunction);
*/
export const verifyJWT = (req: any, res: any, next: NextFunction) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      res.send("Auth token not included in request");
    } else {
      const accessToken: string | undefined = process.env.access_token;
      if (!accessToken) return res.status(500).send("Access token not found");
      jwt.verify(token, accessToken, (err: any, decoded: any) => {
        if (err) {
          console.log(err);
          res.status(401).json({
            auth: false,
            message: "Your auth token is invalid or expired",
            status: 401,
          });
        } else if (
          typeof decoded !== "undefined" &&
          decoded.hasOwnProperty("id")
        ) {
          const id: string = decoded.id;
          req.params.user_id = decoded.id;
          next();
        }
      });
    }
  } catch {
    return res.status(401).send("Your auth token has expired");
  }
};

// interface UserArray {
//   user_id?: string;
//   user_email?: string;
//   user_pass?: string;
//   user_company_name?: string;
//   user_created_at?: string;
// }

export const logUser = async (req: Request, res: Response) => {
  //Determine if user already exists
  try {
    const findUserQuery = "SELECT * FROM users WHERE user_email = ?;";
    const userEmail = req.body.user_email;
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
    const userId = req.params.user_id;
    const formattedSql = con.format(sql, userId);
    const [rows] = await con.execute(formattedSql);

    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const fields = ["user_email", "user_pass", "user_company_name"];

  const setClauses = fields.map((field) => `${field} = ?`);
  const values = fields.map((field) => {
    const value = req.body[field];
    return value != null ? value : null; // If value is null or undefined, replace with null
  });
  console.log(values);

  const sql = `UPDATE users SET ${setClauses.join(", ")} WHERE user_id = ?`;
  values.push(req.params.user_id);

  const con = await pool.getConnection();
  try {
    const formattedSql = con.format(sql, values);
    const [rows] = await con.execute(formattedSql);
    const tabularRow: any = rows;

    if (tabularRow.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "User not found or unauthorized" });
    }

    // After updating, fetch the updated job data
    const [updatedUser] = await con.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [req.params.user_id]
    );
    const tabularData: any = updatedUser;
    console.log(updatedUser);

    return res.status(200).json(tabularData); // Assumes the first record is the updated job data
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

type UserProfile = {
  email: string;
  password: string;
  companyName: string;
  id: number;
};

const mockUserData = [
  {
    email: "jasoncornish14@gmail.com",
    password: "yabbadabba",
    companyName: "Myco-Tex",
    id: 123456789,
  },
  {
    email: "demo@mycotex.com",
    password: "password",
    companyName: "Demo User",
    id: 123456788,
  },
];

export const login = async (req: Request, res: Response) => {
  try {
    return res.status(500).send("wrong fuckin endpoint dumbass");
    // const body = req.body;
    // let profileFound = false;

    // let userProfile: UserProfile = {
    //   email: "",
    //   password: "",
    //   companyName: "",
    //   id: 0,
    // };

    // for (const profile of mockUserData) {
    //   if (profile.email === body.email) {
    //     userProfile = profile;
    //     profileFound = true;
    //     break;
    //   }
    // }
    // if (!profileFound) {
    //   return res.status(404).send("Profile not found");
    // }
    // const accessToken: string | undefined = process.env.access_token;
    // if (!accessToken) return res.status(500).send("Access token not found");
    // const id = userProfile.id;
    // const token = jwt.sign({ id }, accessToken, { expiresIn: 300 });
    // // req.session.user = userProfile;
    // return res.json({
    //   auth: true,
    //   token: token,
    //   user_id: id,
    //   status: 200,
    // });
  } catch {
    return res.status(500).send("Invalid request details");
  }
};
