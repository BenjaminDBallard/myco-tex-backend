import pool from "../connection.js";
const con = await pool.getConnection();

export const getProbe = async (req: any, res: any) => {
  try {
    const findProbesQuery = "SELECT * FROM probe WHERE controller_id = ?";
    const controller_id = req.params.controller_id;
    const [probes] = await con.query(findProbesQuery, controller_id);

    return res.status(200).json(probes);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const logProbe = async (req: any, res: any) => {
  try {
    const createProbeQuery = `
            INSERT INTO probe (
                controller_id,
                probe_id,
                probe_make,
                probe_model,
                probe_type
            )
            VALUES ?;
        `;

    const createProbeValues = [
      [
        req.params.controller_id, // Required
        req.body.probe_id?.substring(0, 100),
        req.body.probe_make?.substring(0, 50) || null,
        req.body.probe_model?.substring(0, 50) || null,
        req.body.probe_type?.substring(0, 50) || null,
      ],
    ];
    await con.query(createProbeQuery, [createProbeValues]);

    return res
      .status(200)
      .json(
        "Probe added successfully to controller: " + req.params.controller_id
      );
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
