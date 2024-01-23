import uniqid from "uniqid";
import pool from "../connection.js";
import { Request, Response } from "express";
const con = await pool.getConnection();

export const getLocation = async (req: Request, res: Response) => {
  try {
    //This user id is passed to us by verifyJWT()
    const jwtUserID = req.params.user_id;
    //user is only able to get a location under their own user_id via sql query
    const findLocationQuery = `SELECT location.*
    FROM users
    LEFT JOIN location
      ON users.user_id = location.user_id
    WHERE users.user_id = ?;`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const locations: any = await con.query(findLocationQuery, jwtUserID);

    if (locations.length === 0)
      return res.status(500).send("0 locations available for this user");

    const sqlUserID = locations[0][0].user_id;

    //if user id associated with location is different from user id provided in request, throw error
    if (sqlUserID !== jwtUserID) {
      return res
        .status(401)
        .send("You do not have permission to view this location");
    }

    return res.status(200).json(locations[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const logLocation = async (req: Request, res: Response) => {
  try {
    //This user id is passed to us by verifyJWT()
    const jwtUserID = req.params.user_id;

    //user is only able to post a location under their own user_id via sql query
    const createLocationSql =
      "INSERT INTO location (user_id, location_id, location_title) VALUES ?;";
    const locationId = uniqid();
    const locationTitle = req.body.location_title;
    const createLocationValues = [
      [jwtUserID, locationId, locationTitle?.substring(0, 50) || null],
    ];
    await con.query(createLocationSql, [createLocationValues]);

    return res.status(200).json("Location_id:" + locationId);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  const fields = ["location_title"];

  //This user id is passed to us by verifyJWT()
  const jwtUserID = req.params.user_id;

  const setClauses = fields.map((field) => `${field} = ?`);
  const values = fields.map((field) => {
    const value = req.body[field];
    return value != null ? value : null; // If value is null or undefined, replace with null
  });
  console.log(values);

  const sql = `UPDATE location SET ${setClauses.join(
    ", "
  )} WHERE location_id = ? AND location.user_id = ?`;
  //user is only able to update a location under their own user_id via sql query
  values.push(req.params.location_id, jwtUserID);

  const con = await pool.getConnection();
  try {
    const formattedSql = con.format(sql, values);
    const [rows] = await con.query(formattedSql);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tabularRow: any = rows;

    if (tabularRow.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Location not found or unauthorized" });
    }

    // After updating, fetch the updated job data
    const [updatedLocation] = await con.execute(
      "SELECT * FROM location WHERE location_id = ? AND location.user_id = ?;",
      [req.params.location_id, jwtUserID]
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tabularData: any = updatedLocation;
    console.log(updatedLocation);

    return res.status(200).json(tabularData); // Assumes the first record is the updated job data
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
