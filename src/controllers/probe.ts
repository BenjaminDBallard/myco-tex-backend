import pool from "../connection.js";
const con = await pool.getConnection();

export const getProbe = async (req: any, res: any) => {
  const sql = "SELECT * FROM probe WHERE controller_id = ?";
  try {
    const controller_id = req.params.controller_id;
    const formattedSql = con.format(sql, controller_id);
    const [rows] = await con.execute(formattedSql);

    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const logProbe = async (req: any, res: any) => {
  console.log(req.body);

  try {
    const createProbeSql = `
            INSERT INTO probe (
                controller_id,
                probe_id,
                probe_make,
                probe_model,
                probe_type
            )
            VALUES (?, ?, ?, ?, ?)
        `;

    const values = [
      req.params.controller_id, // Required
      req.body.probe_id?.substring(0, 100),
      req.body.probe_make?.substring(0, 50) || null,
      req.body.probe_model?.substring(0, 50) || null,
      req.body.probe_type?.substring(0, 50) || null,
    ];

    const formattedSql = con.format(createProbeSql, values);
    const [rows] = await con.execute(formattedSql);
    let tempResult: any = rows;
    // Access the insertId property on the result object
    const probeId = tempResult.insertId;

    return res.status(200).json({ probeId });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
