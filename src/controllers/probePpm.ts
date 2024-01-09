import pool from "../connection.js";
const con = await pool.getConnection();

export const getProbePpm = async (req: any, res: any) => {
  const sql = "SELECT * FROM probe_ppm WHERE probe_id = ?";
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

export const logProbePpm = async (req: any, res: any) => {
  console.log(req.body);

  try {
    const createProbePpmSql = `
            INSERT INTO probe_ppm (
                probe_id,
                probe_ppm_measure
            )
            VALUES (?, ?)
        `;

    const values = [
      req.params.probe_id, // Required
      req.body.probe_ppm_measure?.substring(0, 7) || null,
    ];

    const formattedSql = con.format(createProbePpmSql, values);
    const [rows] = await con.execute(formattedSql);
    let tempResult: any = rows;
    // Access the insertId property on the result object
    const probePpmId = tempResult.insertId;

    return res.status(200).json({ probePpmId });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
