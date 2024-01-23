import pool from "../connection.js";
import { Request, Response } from "express";
const con = await pool.getConnection();

export const getProbe = async (req: Request, res: Response) => {
  try {
    //This user id is passed to us by verifyJWT()
    const jwtUserID = req.params.user_id;
    const findProbesQuery = `SELECT users.user_id, probe.*
    FROM users
    LEFT JOIN location
      ON users.user_id = location.user_id
    LEFT JOIN room
      ON location.location_id = room.location_id
	  LEFT JOIN controller
      ON room.room_id = controller.room_id
	  LEFT JOIN probe
      ON controller.controller_id = probe.controller_id
    WHERE controller.controller_id = ?`;
    const controller_id = req.params.controller_id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const probes: any = await con.query(findProbesQuery, controller_id);

    if (probes[0].length === 0)
      return res.status(500).send("0 probes available for this controller");

    const sqlUserID = probes[0][0].user_id;

    if (sqlUserID !== jwtUserID) {
      return res
        .status(401)
        .send(
          "You do not have permission to view the probes for this controller"
        );
    }

    return res.status(200).json(probes[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const logProbe = async (req: Request, res: Response) => {
  try {
    //This user id is passed to us by verifyJWT()
    const jwtUserID = req.params.user_id;
    //verify SQL user_id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sqlUserIDCheck: any = await con.execute(
      `SELECT users.user_id, probe.probe_id
       FROM users
       LEFT JOIN location
         ON users.user_id = location.user_id
       LEFT JOIN room
         ON location.location_id = room.location_id
       LEFT JOIN controller
         ON room.room_id = controller.room_id
       LEFT JOIN probe
         ON controller.controller_id = probe.controller_id
       WHERE controller.controller_id = ?`,
      [req.params.controller_id]
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sqlUserID: any = sqlUserIDCheck[0][0].user_id;
    //If user making request does not match user in db, throw error
    if (sqlUserID !== jwtUserID || sqlUserID === undefined) {
      return res.status(401).send("controller not found or unauthorized");
    }
    //If user making request does match user in db, begin insert
    const createProbeQuery = `
            INSERT INTO probe (
                controller_id,
                probe_id,
                probe_make,
                probe_model,
                probe_type
            )
            VALUES ?;
        `;

    const createProbeValues = [
      [
        req.params.controller_id, // Required
        req.body.probe_id?.substring(0, 100),
        req.body.probe_make?.substring(0, 50) || null,
        req.body.probe_model?.substring(0, 50) || null,
        req.body.probe_type?.substring(0, 50) || null,
      ],
    ];
    await con.query(createProbeQuery, [createProbeValues]);

    return res
      .status(200)
      .json(
        "Probe added successfully to controller: " + req.params.controller_id
      );
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const updateProbe = async (req: Request, res: Response) => {
  const con = await pool.getConnection();
  try {
    //This user id is passed to us by verifyJWT()
    const jwtUserID = req.params.user_id;
    console.log(1);
    //verify SQL user_id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sqlUserIDCheck: any = await con.execute(
      `SELECT users.user_id, probe.probe_id
      FROM users
      LEFT JOIN location
        ON users.user_id = location.user_id
      LEFT JOIN room
        ON location.location_id = room.location_id
      LEFT JOIN controller
        ON room.room_id = controller.room_id
      LEFT JOIN probe
        ON controller.controller_id = probe.controller_id
      WHERE probe.probe_id = ?`,
      [req.params.probe_id]
    );
    if (sqlUserIDCheck[0].length === 0)
      return res.status(500).send("Probe not found");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sqlUserID: any = sqlUserIDCheck[0][0].user_id;
    //If user making request does not match user in db, throw error
    if (sqlUserID !== jwtUserID) {
      return res.status(401).send("Unauthorized");
    }
    console.log(2);
    //If user making request does match user in db, begin update
    const fields = ["controller_id", "probe_make", "probe_model", "probe_type"];

    const setClauses = fields.map((field) => `${field} = ?`);
    const values = fields.map((field) => {
      const value = req.body[field];
      return value != null ? value : null; // If value is null or undefined, replace with null
    });
    console.log(values);

    const sql = `UPDATE probe SET ${setClauses.join(", ")} WHERE probe_id = ?`;
    values.push(req.params.probe_id);

    const formattedSql = con.format(sql, values);
    const [rows] = await con.execute(formattedSql);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tabularRow: any = rows;

    if (tabularRow.affectedRows === 0) {
      return res.status(404).json({ message: "no changes made" });
    }

    // After updating, fetch the updated job data
    const [updatedProbe] = await con.execute(
      "SELECT * FROM probe WHERE probe_id = ?",
      [req.params.probe_id]
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tabularData: any = updatedProbe;
    console.log(updatedProbe);

    return res.status(200).json(tabularData); // Assumes the first record is the updated job data
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
