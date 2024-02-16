/* eslint-disable @typescript-eslint/no-explicit-any */
import uniqid from "uniqid";
import pool from "../connection.js";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
const con = await pool.getConnection();

export const postDevice = async (req: Request, res: Response) => {
  //Determine if user already exists
  console.log(req.params, req.body);
  if (
    !req.params.room_id ||
    !req.body.controller_id ||
    !req.body.device_pass ||
    !req.body.probe_id ||
    !req.body.probe_type
  ) {
    return res.status(400).send("missing required params");
  }
  //This user id is passed to us by verifyJWT()
  const jwtUserID = req.params.user_id;
  const sqlExistCheck: any = await con.execute(
    `SELECT users.user_id, controller.controller_id, probe.probe_id
      FROM users
      LEFT JOIN location
        ON users.user_id = location.user_id
      LEFT JOIN room
        ON location.location_id = room.location_id
      LEFT JOIN controller
        ON room.room_id = controller.room_id
      LEFT JOIN probe
        ON controller.controller_id = probe.controller_id
      WHERE room.room_id = ?`,
    [req.params.room_id]
  );
  if (sqlExistCheck[0].length === 0) {
    return res.status(401).send("room not found");
  }
  const sqlUserID: any = sqlExistCheck[0][0].user_id;
  //If user making request does not match user in db, throw error
  if (sqlUserID !== jwtUserID || sqlUserID === undefined) {
    return res.status(401).send("unauthorized");
  }

  //make sure controller doesnt already exist
  const controllerExistCheck: any = await con.execute(
    `SELECT *
      FROM controller
      WHERE controller_id = ?`,
    [req.body.controller_id]
  );
  if (controllerExistCheck[0].length !== 0) {
    return res
      .status(401)
      .send("controller is already associated with an account");
  }

  //make sure probe doesnt already exist
  const probeExistCheck: any = await con.execute(
    `SELECT *
      FROM probe
      WHERE probe_id = ?`,
    [req.body.probe_id]
  );
  if (probeExistCheck[0].length !== 0) {
    return res.status(401).send("probe is already associated with an account");
  }

  //make sure device doesnt already exist
  const deviceIDCheck: any = await con.execute(
    `SELECT * 
      FROM device
      WHERE device_controller_id = ?`,
    [req.body.controller_id]
  );
  if (deviceIDCheck[0].length !== 0) {
    return res.status(401).send("device is already authenticated");
  }

  //New controller query and values
  const createControllerQuery = `
            INSERT INTO controller (
                room_id,
                controller_id,
                controller_name,
                controller_serial,
                controller_make,
                controller_model
            )
            VALUES ?;
        `;

  const createControllerValues = [
    [
      req.params.room_id, // Required
      req.body.controller_id?.substring(0, 100),
      req.body.controller_name?.substring(0, 50) || null,
      req.body.controller_serial?.substring(0, 50) || null,
      req.body.controller_make?.substring(0, 50) || null,
      req.body.controller_model?.substring(0, 50) || null,
    ],
  ];

  //New probe query and values
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
      req.body.controller_id, // Required
      req.body.probe_id?.substring(0, 100),
      req.body.probe_make?.substring(0, 50) || null,
      req.body.probe_model?.substring(0, 50) || null,
      req.body.probe_type?.substring(0, 50) || null,
    ],
  ];

  //New device query and values
  const populateDeviceQuery = `INSERT INTO device (user_id, device_id, device_controller_id, device_pass) VALUES ?;`;
  //hash and salt device_pass
  const deviceHash = await bcrypt.hash(req.body.device_pass, 13);
  const populateDeviceValues = [
    [sqlUserID, uniqid(), req.body.controller_id, deviceHash],
  ];

  try {
    //POST ALL
    await con.query(createControllerQuery, [createControllerValues]);
    await con.query(createProbeQuery, [createProbeValues]);
    await con.query(populateDeviceQuery, [populateDeviceValues]);

    return res
      .status(200)
      .send("Successfully added device: " + req.body.controller_id);
  } catch (err) {
    return res.status(500).send(err + "Failed to add device");
  } finally {
    con.release();
  }
};

export const updateDevice = async (req: Request, res: Response) => {
  try {
    //This user id is passed to us by verifyJWT()
    const jwtUserID = req.params.user_id;
    //verify SQL user_id

    const sqlUserIDCheck: any = await con.execute(
      `SELECT users.user_id, controller.controller_id
      FROM users
      LEFT JOIN location
        ON users.user_id = location.user_id
      LEFT JOIN room
        ON location.location_id = room.location_id
        LEFT JOIN controller
        ON room.room_id = controller.room_id
      WHERE controller.controller_id = ?`,
      [req.params.controller_id]
    );
    if (sqlUserIDCheck[0].length === 0)
      return res.status(500).send("Controller not found");

    const sqlUserID: any = sqlUserIDCheck[0][0].user_id;
    //If user making request does not match user in db, throw error
    if (sqlUserID !== jwtUserID) {
      return res.status(401).send("Unauthorized");
    }
    //If user making request does match user in db, begin update
    const fields = ["room_id", "controller_name"];

    const setClauses = fields.map((field) => `${field} = ?`);
    const values = fields.map((field) => {
      const value = req.body[field];
      return value != null ? value : null; // If value is null or undefined, replace with null
    });

    const sql = `UPDATE controller SET ${setClauses.join(
      ", "
    )} WHERE controller_id = ?`;
    values.push(req.params.controller_id);

    const formattedSql = con.format(sql, values);
    const [rows] = await con.execute(formattedSql);

    const tabularRow: any = rows;

    if (tabularRow.affectedRows === 0) {
      return res.status(404).send("No changes made");
    }

    // After updating, fetch the updated job data
    const [updatedController] = await con.execute(
      "SELECT * FROM controller WHERE controller_id = ?",
      [req.params.controller_id]
    );

    const tabularData: any = updatedController;

    return res.status(200).json(tabularData); // Assumes the first record is the updated job data
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
