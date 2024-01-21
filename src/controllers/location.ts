import uniqid from "uniqid";
import pool from "../connection.js";
const con = await pool.getConnection();

export const getLocation = async (req: any, res: any) => {
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

export const logLocation = async (req: any, res: any) => {
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
