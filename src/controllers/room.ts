import uniqid from "uniqid";
import pool from "../connection.js";
import { Request, Response } from "express";
const con = await pool.getConnection();

export const getRoom = async (req: Request, res: Response) => {
  try {
    const findRoomsQuery = "SELECT * FROM room WHERE location_id = ?;";
    const location_id = req.params.location_id;
    const [rooms] = await con.query(findRoomsQuery, location_id);

    return res.status(200).json(rooms);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const logRoom = async (req: Request, res: Response) => {
  try {
    const createRoomSql =
      "INSERT INTO room (location_id, room_id, room_title) VALUES ?;";
    const roomId = uniqid();
    const createRoomValues = [
      [
        req.params.location_id,
        roomId,
        req.body.room_title?.substring(0, 50) || null,
      ],
    ];
    await con.query(createRoomSql, [createRoomValues]);

    return res.status(200).json("Room_id: " + roomId);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  const fields = ["room_title"];

  const setClauses = fields.map((field) => `${field} = ?`);
  const values = fields.map((field) => {
    const value = req.body[field];
    return value != null ? value : null; // If value is null or undefined, replace with null
  });
  console.log(values);

  const sql = `UPDATE room SET ${setClauses.join(", ")} WHERE room_id = ?`;
  values.push(req.params.room_id);

  const con = await pool.getConnection();
  try {
    const formattedSql = con.format(sql, values);
    const [rows] = await con.execute(formattedSql);
    const tabularRow: any = rows;

    if (tabularRow.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Room not found or unauthorized" });
    }

    // After updating, fetch the updated job data
    const [updatedRoom] = await con.execute(
      "SELECT * FROM room WHERE room_id = ?",
      [req.params.room_id]
    );
    const tabularData: any = updatedRoom;
    console.log(updatedRoom);

    return res.status(200).json(tabularData); // Assumes the first record is the updated job data
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
