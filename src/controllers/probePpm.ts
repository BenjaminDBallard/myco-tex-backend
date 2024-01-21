import uniqid from "uniqid";
import pool from "../connection.js";
const con = await pool.getConnection();

export const getProbePpm = async (req: any, res: any) => {
  try {
    const findMeasurementsQuery = "SELECT * FROM probe_ppm WHERE probe_id = ?";
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

export const logProbePpm = async (req: any, res: any) => {
  try {
    const createProbePpmQuery = `
            INSERT INTO probe_ppm (
                probe_id,
                probe_ppm_id,
                probe_ppm_measure
            )
            VALUES ?;
        `;

    let probePpmId = uniqid();

    const createProbePpmValues = [
      [
        req.params.probe_id, // Required
        probePpmId,
        req.body.probe_ppm_measure,
      ],
    ];
    await con.query(createProbePpmQuery, [createProbePpmValues]);

    return res
      .status(200)
      .json(
        "ProbePpmId: " + probePpmId + " Measure: " + req.body.probe_ppm_measure
      );
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
