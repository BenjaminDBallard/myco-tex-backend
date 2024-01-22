import uniqid from "uniqid";
import pool from "../connection.js";
import { Request, Response } from "express";
const con = await pool.getConnection();

export const getLocation = async (req: Request, res: Response) => {
  try {
    const findLocationQuery = "SELECT * FROM location WHERE user_id = ?";
    const user_id = req.params.user_id;
    const [location] = await con.query(findLocationQuery, user_id);

    return res.status(200).json(location);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const logLocation = async (req: Request, res: Response) => {
  console.log(req.body.location_title);
  console.log(uniqid());
  try {
    const createLocationSql =
      "INSERT INTO location (user_id, location_id, location_title) VALUES ?;";
    const locationId = uniqid();
    const locationTitle = req.body.location_title;
    const createLocationValues = [
      [req.params.user_id, locationId, locationTitle?.substring(0, 50) || null],
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

  const setClauses = fields.map((field) => `${field} = ?`);
  const values = fields.map((field) => {
    const value = req.body[field];
    return value != null ? value : null; // If value is null or undefined, replace with null
  });
  console.log(values);

  const sql = `UPDATE location SET ${setClauses.join(
    ", "
  )} WHERE location_id = ?`;
  values.push(req.params.location_id);

  const con = await pool.getConnection();
  try {
    const formattedSql = con.format(sql, values);
    const [rows] = await con.execute(formattedSql);
    const tabularRow: any = rows;

    if (tabularRow.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Location not found or unauthorized" });
    }

    // After updating, fetch the updated job data
    const [updatedLocation] = await con.execute(
      "SELECT * FROM location WHERE location_id = ?",
      [req.params.location_id]
    );
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
