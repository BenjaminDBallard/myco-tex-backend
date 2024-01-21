import uniqid from "uniqid";
import pool from "../connection.js";
const con = await pool.getConnection();

export const getProbeTherm = async (req: any, res: any) => {
  const findMeasurementsQuery = "SELECT * FROM probe_therm WHERE probe_id = ?";
  try {
    const probe_id = req.params.probe_id;
    const [measurements] = await con.execute(findMeasurementsQuery, probe_id);

    return res.status(200).json(measurements);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const logProbeTherm = async (req: any, res: any) => {
  try {
    const createProbeThermQuery = `
            INSERT INTO probe_therm (
                probe_id,
                probe_therm_id,
                probe_therm_measure
            )
            VALUES ?;
        `;

    let probeThermId = uniqid();

    const createProbeThermValues = [
      [
        req.params.probe_id, // Required
        probeThermId,
        req.body.probe_therm_measure,
      ],
    ];
    await con.execute(createProbeThermQuery, [createProbeThermValues]);

    return res
      .status(200)
      .json(
        "ProbeThermId: " +
          probeThermId +
          " Measure: " +
          req.body.probe_therm_measure
      );
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
