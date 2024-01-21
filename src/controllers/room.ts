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
