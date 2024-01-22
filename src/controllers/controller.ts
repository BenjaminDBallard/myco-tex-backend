import pool from "../connection.js";
import { Request, Response } from "express";
const con = await pool.getConnection();

export const getController = async (req: Request, res: Response) => {
  try {
    const findControlersQuery = "SELECT * FROM controller WHERE room_id = ?";
    const room_id = req.params.room_id;
    const [controllers] = await con.query(findControlersQuery, room_id);

    return res.status(200).json(controllers);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const logController = async (req: Request, res: Response) => {
  try {
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
  console.log(values);

  const sql = `UPDATE controller SET ${setClauses.join(
    ", "
  )} WHERE controller_id = ?`;
  values.push(req.params.controller_id);

  const con = await pool.getConnection();
  try {
    const formattedSql = con.format(sql, values);
    const [rows] = await con.execute(formattedSql);
    const tabularRow: any = rows;

    if (tabularRow.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Controller not found or unauthorized" });
    }

    // After updating, fetch the updated job data
    const [updatedController] = await con.execute(
      "SELECT * FROM controller WHERE controller_id = ?",
      [req.params.controller_id]
    );
    const tabularData: any = updatedController;
    console.log(updatedController);

    return res.status(200).json(tabularData); // Assumes the first record is the updated job data
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
