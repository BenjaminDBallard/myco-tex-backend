import pool from "../connection.js";
const con = await pool.getConnection();

export const getLocation = async (req: any, res: any) => {
  const sql = "SELECT * FROM location WHERE user_id = ?";
  try {
    const user_id = req.params.user_id;
    const formattedSql = con.format(sql, user_id);
    const [rows] = await con.execute(formattedSql);

    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const logLocation = async (req: any, res: any) => {
  console.log(req.body);

  try {
    const createLocationSql = `
            INSERT INTO location (
                user_id,
                location_title
            )
            VALUES (?, ?)
        `;

    const values = [
      req.params.user_id, // Required
      req.body.location_title?.substring(0, 100) || null,
    ];

    const formattedSql = con.format(createLocationSql, values);
    const [rows] = await con.execute(formattedSql);
    let tempResult: any = rows;
    // Access the insertId property on the result object
    const locationId = tempResult.insertId;

    return res.status(200).json({ locationId });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
