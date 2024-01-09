import pool from "../connection.js";
const con = await pool.getConnection();

export const getRoom = async (req: any, res: any) => {
  const sql = "SELECT * FROM room WHERE location_id = ?";
  try {
    const location_id = req.params.location_id;
    const formattedSql = con.format(sql, location_id);
    const [rows] = await con.execute(formattedSql);

    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const logRoom = async (req: any, res: any) => {
  console.log(req.body);

  try {
    const createRoomSql = `
            INSERT INTO room (
                location_id,
                room_title
            )
            VALUES (?, ?)
        `;

    const values = [
      req.params.location_id, // Required
      req.body.room_title?.substring(0, 100) || null,
    ];

    const formattedSql = con.format(createRoomSql, values);
    const [rows] = await con.execute(formattedSql);
    let tempResult: any = rows;
    // Access the insertId property on the result object
    const roomId = tempResult.insertId;

    return res.status(200).json({ roomId });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
