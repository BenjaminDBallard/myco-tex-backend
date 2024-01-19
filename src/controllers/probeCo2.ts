import uniqid from "uniqid";
import pool from "../connection.js";
const con = await pool.getConnection();

export const getProbeCo2 = async (req: any, res: any) => {
  const sql = "SELECT * FROM probe_co2 WHERE probe_id = ?";
  try {
    const probe_id = req.params.probe_id;
    const formattedSql = con.format(sql, probe_id);
    const [rows] = await con.execute(formattedSql);

    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const logProbeCo2 = async (req: any, res: any) => {
  console.log(req.body);

  try {
    const createProbeCo2Sql = `
            INSERT INTO probe_co2 (
                probe_id,
                probe_co2_id,
                probe_co2_measure
            )
            VALUES (?, ?, ?)
        `;

    let newID = uniqid();

    const values = [
      req.params.probe_id, // Required
      newID,
      req.body.probe_co2_measure?.substring(0, 7) || null,
    ];

    const formattedSql = con.format(createProbeCo2Sql, values);
    const [rows] = await con.execute(formattedSql);
    let tempResult: any = rows;
    // Access the insertId property on the result object
    const probeCo2Id = tempResult.insertId;

    return res.status(200).json({ probeCo2Id });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
