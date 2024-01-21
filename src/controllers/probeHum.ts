import uniqid from "uniqid";
import pool from "../connection.js";
const con = await pool.getConnection();

export const getProbeHum = async (req: any, res: any) => {
  try {
    const findMeasurementsQuery = "SELECT * FROM probe_hum WHERE probe_id = ?";
    const probe_id = req.params.probe_id;
    const [measurements] = await con.query(findMeasurementsQuery, probe_id);

    return res.status(200).json(measurements);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const logProbeHum = async (req: any, res: any) => {
  try {
    const createProbeHumQuery = `
            INSERT INTO probe_hum (
                probe_id,
                probe_hum_id,
                probe_hum_measure
            )
            VALUES ?;
        `;

    let probeHumId = uniqid();

    const createProbeHumValues = [
      [
        req.params.probe_id, // Required
        probeHumId,
        req.body.probe_hum_measure,
      ],
    ];
    await con.query(createProbeHumQuery, [createProbeHumValues]);

    return res
      .status(200)
      .json(
        "ProbeHumId: " + probeHumId + " Measure: " + req.body.probe_hum_measure
      );
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
