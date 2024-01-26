import uniqid from "uniqid";
import pool from "../connection.js";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
const con = await pool.getConnection();

export const getProbeCo2 = async (req: Request, res: Response) => {
  try {
    //This user id is passed to us by verifyJWT()
    const jwtUserID = req.params.user_id;
    const historical = req.params.hist;
    let sql;
    if (historical === "true") {
      sql = `SELECT users.user_id, probe_co2.*
        FROM users
        LEFT JOIN location
          ON users.user_id = location.user_id
        LEFT JOIN room
          ON location.location_id = room.location_id
        LEFT JOIN controller
          ON room.room_id = controller.room_id
        LEFT JOIN probe
          ON controller.controller_id = probe.controller_id
        LEFT JOIN probe_co2
          ON probe.probe_id = probe_co2.probe_id
        WHERE probe.probe_id = ? ORDER BY probe_c02_created_at DESC;`;
    } else {
      sql = `SELECT users.user_id, probe_co2.*
        FROM users
        LEFT JOIN location
          ON users.user_id = location.user_id
        LEFT JOIN room
          ON location.location_id = room.location_id
        LEFT JOIN controller
          ON room.room_id = controller.room_id
        LEFT JOIN probe
          ON controller.controller_id = probe.controller_id
        LEFT JOIN probe_co2
          ON probe.probe_id = probe_co2.probe_id
        WHERE probe.probe_id = ? ORDER BY probe_c02_created_at DESC LIMIT 1;`;
    }

    const probe_id = req.params.probe_id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const measurements: any = await con.query(sql, probe_id);

    if (measurements[0].length === 0)
      return res.status(500).send("0 probes available on this controller");

    const sqlUserID = measurements[0][0].user_id;
    if (sqlUserID !== jwtUserID) {
      return res
        .status(401)
        .send(
          "You do not have permission to view the controllers in this room"
        );
    }

    return res.status(200).json(measurements[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const logProbeCo2 = async (req: Request, res: Response) => {
  try {
    const { controller_id, device_pass, probe_co2_measure } = req.body;
    //verify SQL user_id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sqlDeviceCheck: any = await con.execute(
      `SELECT *
        FROM device
        WHERE device_controller_id = ?;`,
      [controller_id]
    );

    //If user does not already exist
    if (!sqlDeviceCheck[0].length) {
      return res.status(400).send("device not added to aproved devices");
    }
    const isValid = await bcrypt.compare(
      device_pass,
      sqlDeviceCheck[0][0].device_pass
    );
    if (!isValid) {
      return res.status(400).send("device access denied");
    }

    //If device making request does match device in db, begin insert
    const createProbeCo2Query = `
            INSERT INTO probe_co2 (
                probe_id,
                probe_co2_id,
                probe_co2_measure
            )
            VALUES ?;
        `;

    const probeCo2Id = uniqid();
    const createProbeCo2values = [
      [
        req.params.probe_id, // Required
        probeCo2Id,
        probe_co2_measure,
      ],
    ];
    await con.query(createProbeCo2Query, [createProbeCo2values]);

    return res
      .status(200)
      .json(
        "controllerId: " +
          controller_id +
          " Type: Co2 " +
          " Measure: " +
          probe_co2_measure
      );
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
