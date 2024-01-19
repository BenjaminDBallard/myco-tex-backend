import uniqid from "uniqid";
import pool from "../connection.js";
const con = await pool.getConnection();

export const getProbeTherm = async (req: any, res: any) => {
  const sql = "SELECT * FROM probe_therm WHERE probe_id = ?";
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

export const logProbeTherm = async (req: any, res: any) => {
  console.log(req.body);

  try {
    const createProbeThermSql = `
            INSERT INTO probe_therm (
                probe_id,
                probe_therm_id,
                probe_therm_measure
            )
            VALUES (?, ?, ?)
        `;

    let newID = uniqid();

    const values = [
      req.params.probe_id, // Required
      newID,
      req.body.probe_therm_measure?.substring(0, 7) || null,
    ];

    const formattedSql = con.format(createProbeThermSql, values);
    const [rows] = await con.execute(formattedSql);
    let tempResult: any = rows;
    // Access the insertId property on the result object
    const probeThermId = tempResult.insertId;

    return res.status(200).json({ probeThermId });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
