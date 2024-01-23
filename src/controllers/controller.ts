import pool from "../connection.js";
import { Request, Response } from "express";
const con = await pool.getConnection();

export const getController = async (req: Request, res: Response) => {
  try {
    //This user id is passed to us by verifyJWT()
    const jwtUserID = req.params.user_id;
    const findControlersQuery = `SELECT users.user_id, controller.*
    FROM users
    LEFT JOIN location
      ON users.user_id = location.user_id
    LEFT JOIN room
      ON location.location_id = room.location_id
      LEFT JOIN controller
      ON room.room_id = controller.room_id
    WHERE room.room_id = ?;`;
    const room_id = req.params.room_id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const controllers: any = await con.query(findControlersQuery, room_id);

    if (controllers[0].length === 0)
      return res.status(500).send("0 controllers available for this room");

    const sqlUserID = controllers[0][0].user_id;

    if (sqlUserID !== jwtUserID) {
      return res
        .status(401)
        .send(
          "You do not have permission to view the controllers in this room"
        );
    }

    return res.status(200).json(controllers[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const logController = async (req: Request, res: Response) => {
  try {
    //This user id is passed to us by verifyJWT()
    const jwtUserID = req.params.user_id;
    //verify SQL user_id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sqlUserIDCheck: any = await con.execute(
      `SELECT users.user_id, controller.*
    FROM users
    LEFT JOIN location
      ON users.user_id = location.user_id
    LEFT JOIN room
      ON location.location_id = room.location_id
      LEFT JOIN controller
      ON room.room_id = controller.room_id
    WHERE room.room_id = ?`,
      [req.params.room_id]
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sqlUserID: any = sqlUserIDCheck[0][0].user_id;
    //If user making request does not match user in db, throw error
    if (sqlUserID !== jwtUserID || sqlUserID === undefined) {
      return res.status(401).send("room not found or unauthorized");
    }
    //If user making request does match user in db, begin insert
    const createControllerQuery = `
            INSERT INTO controller (
                room_id,
                controller_id,
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
        req.body.controller_serial?.substring(0, 50) || null,
        req.body.controller_make?.substring(0, 50) || null,
        req.body.controller_model?.substring(0, 50) || null,
      ],
    ];
    await con.query(createControllerQuery, [createControllerValues]);

    return res
      .status(200)
      .json("Controller added successfully to room: " + req.params.room_id);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const updateController = async (req: Request, res: Response) => {
  const con = await pool.getConnection();
  try {
    //This user id is passed to us by verifyJWT()
    const jwtUserID = req.params.user_id;
    //verify SQL user_id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sqlUserID: any = sqlUserIDCheck[0][0].user_id;
    //If user making request does not match user in db, throw error
    if (sqlUserID !== jwtUserID) {
      return res.status(401).send("Unauthorized");
    }
    //If user making request does match user in db, begin update
    const fields = [
      "room_id",
      "controller_serial",
      "controller_make",
      "controller_model",
    ];

    const setClauses = fields.map((field) => `${field} = ?`);
    const values = fields.map((field) => {
      const value = req.body[field];
      return value != null ? value : null; // If value is null or undefined, replace with null
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    const sql = `UPDATE controller SET ${setClauses.join(
      ", "
    )} WHERE controller_id = ?`;
    values.push(req.params.controller_id);

    const formattedSql = con.format(sql, values);
    const [rows] = await con.execute(formattedSql);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tabularRow: any = rows;

    if (tabularRow.affectedRows === 0) {
      return res.status(404).json({ message: "No changes made" });
    }

    // After updating, fetch the updated job data
    const [updatedController] = await con.execute(
      "SELECT * FROM controller WHERE controller_id = ?",
      [req.params.controller_id]
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tabularData: any = updatedController;

    return res.status(200).json(tabularData); // Assumes the first record is the updated job data
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
