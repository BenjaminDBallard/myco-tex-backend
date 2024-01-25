import uniqid from "uniqid";
import pool from "../connection.js";
import { Request, Response } from "express";
const con = await pool.getConnection();

export const logRoom = async (req: Request, res: Response) => {
  try {
    //This user id is passed to us by verifyJWT()
    const jwtUserID = req.params.user_id;
    //verify SQL user_id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sqlUserIDCheck: any = await con.execute(
      `SELECT users.user_id, location.location_id
      FROM users
      LEFT JOIN location
        ON users.user_id = location.user_id
      WHERE location.location_id = ?`,
      [req.params.location_id]
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sqlUserID: any = sqlUserIDCheck[0][0].user_id;
    console.log(sqlUserIDCheck);
    //If user making request does not match user in db, throw error
    if (sqlUserID !== jwtUserID) {
      return res.status(401).send("location not found or unauthorized");
    }
    //If user making request does match user in db, begin insert
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
  const con = await pool.getConnection();
  try {
    //This user id is passed to us by verifyJWT()
    const jwtUserID = req.params.user_id;
    //verify SQL user_id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sqlUserIDCheck: any = await con.execute(
      `SELECT users.user_id, room.room_id
      FROM users
      LEFT JOIN location
        ON users.user_id = location.user_id
      LEFT JOIN room
        ON location.location_id = room.location_id
      WHERE room.room_id = ?`,
      [req.params.room_id]
    );
    if (sqlUserIDCheck[0].length === 0)
      return res.status(500).send("Room not found");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sqlUserID: any = sqlUserIDCheck[0][0].user_id;
    console.log(sqlUserIDCheck);
    //If user making request does not match user in db, throw error
    if (sqlUserID !== jwtUserID) {
      return res.status(401).send("Unauthorized");
    }
    //If user making request does match user in db, begin update
    const fields = ["room_title"];
    const setClauses = fields.map((field) => `${field} = ?`);
    const values = fields.map((field) => {
      const value = req.body[field];
      return value != null ? value : null; // If value is null or undefined, replace with null
    });

    const sql = `UPDATE room SET ${setClauses.join(", ")} WHERE room_id = ?`;
    values.push(req.params.room_id);

    const formattedSql = con.format(sql, values);
    const [rows] = await con.execute(formattedSql);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tabularRow: any = rows;

    if (tabularRow.affectedRows === 0) {
      return res.status(404).json({ message: "No changes made" });
    }

    // After updating, fetch the updated job data
    const [updatedRoom] = await con.execute(
      "SELECT * FROM room WHERE room_id = ?",
      [req.params.room_id]
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// export const getRoom = async (req: Request, res: Response) => {
//   try {
//     //This user id is passed to us by verifyJWT()
//     const jwtUserID = req.params.user_id;
//     const findRoomsQuery = `SELECT users.user_id, room.*
//     FROM users
//     LEFT JOIN location
//       ON users.user_id = location.user_id
//     LEFT JOIN room
//       ON location.location_id = room.location_id
//     WHERE location.location_id = ?`;

//     const location_id = req.params.location_id;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const rooms: any = await con.query(findRoomsQuery, location_id);

//     if (rooms[0].length === 0)
//       return res.status(500).send("0 rooms available for this location");

//     const sqlUserID = rooms[0][0].user_id;

//     //if user id associated with location is different from user id provided in request, throw error
//     if (sqlUserID !== jwtUserID) {
//       return res
//         .status(401)
//         .send("You do not have permission to view the rooms in this location");
//     }

//     return res.status(200).json(rooms[0]);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send(err);
//   } finally {
//     con.release();
//   }
// };
