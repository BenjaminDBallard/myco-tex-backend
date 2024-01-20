import uniqid from "uniqid";
import { NextFunction } from "express";
import pool from "../connection.js";
import jwt from "jsonwebtoken";
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
      jwt.verify(token, "jwtSecret", (err: any, decoded: any) => {
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
          req.userId = decoded.id;
          next();
        }
      });
    }
  } catch {
    return res.status(401).send("Your auth token has expired");
  }
};

export const logUser = async (req: any, res: any) => {
  //Determine if user already exists
  try {
    const userEmail = req.body.user_email;
    console.log("Successfully retrieved:" + userEmail);
    const [rows] = await con.execute(
      "SELECT * FROM users WHERE user_email = ?",
      [userEmail]
    );
    let tempResult: any = rows;

    //If user does not already exist
    if (tempResult.length === 0) {
      //Post new user
      const userId = uniqid();
      const userPass = req.body.user_pass;
      const userCompany = req.body.user_company_name;
      const populateUserQuery =
        "INSERT INTO users (user_id, user_email, user_pass, user_company_name) VALUES ?";
      const populateUserValues = [[userId, userEmail, userPass, userCompany]];
      await con.query(populateUserQuery, [populateUserValues]);

      //Post new location to user
      const locationId = uniqid();
      const locationTitle = userCompany;
      const populateLocationQuery =
        "INSERT INTO location (user_id, location_id, location_title) VALUES ?;";
      const populateLocationValues = [[userId, locationId, locationTitle]];
      await con.query(populateLocationQuery, [populateLocationValues]);

      //Post new rooms to location
      const populateRoomsQuery =
        "INSERT INTO room (location_id, room_id, room_title) VALUES ?";
      const populateRoomsValues = [
        [locationId, uniqid(), "Mixer"],
        [locationId, uniqid(), "Steamer"],
        [locationId, uniqid(), "Lab"],
        [locationId, uniqid(), "Incubation"],
      ];
      await con.query(populateRoomsQuery, [populateRoomsValues]);

      return res.status(200).send("user_id: " + userId);
    } else {
      return res.send("Welcome back");
    }
  } catch (err) {
    console.error(err + "Initialial population of tables failed to send");
  }
};

// export const getUser = async (req: any, res: any) => {
//   const user = req.params;
//   console.log(user);
//   return res.status(200).json({ user_id: user });
// };

export const getUser = async (req: any, res: any) => {
  const sql = "SELECT * FROM users";
  try {
    const formattedSql = con.format(sql);
    const [rows] = await con.execute(formattedSql);

    return res.status(200).json(rows);
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

export const login = async (req: any, res: any) => {
  try {
    console.log("am i even here?");
    const body = req.body;
    let profileFound = false;

    let userProfile: UserProfile = {
      email: "",
      password: "",
      companyName: "",
      id: 0,
    };

    for (const profile of mockUserData) {
      console.log(profile);
      if (profile.email === body.email) {
        userProfile = profile;
        profileFound = true;
        break;
      }
    }
    if (!profileFound) {
      return res.status(404).send("Profile not found");
    }
    const id = userProfile.id;
    const token = jwt.sign({ id }, "jwtSecret", { expiresIn: 30 });
    // req.session.user = userProfile;
    return res.json({
      auth: true,
      token: token,
      result: userProfile,
      status: 200,
    });
  } catch {
    return res.status(500).send("Invalid request details");
  }
};
