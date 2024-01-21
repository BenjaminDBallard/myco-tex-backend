import uniqid from "uniqid";
import pool from "../connection.js";
const con = await pool.getConnection();

export const getProbeCo2 = async (req: any, res: any) => {
  try {
    const findMeasurementsQuery = "SELECT * FROM probe_co2 WHERE probe_id = ?";
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

export const logProbeCo2 = async (req: any, res: any) => {
  try {
    const createProbeCo2Query = `
            INSERT INTO probe_co2 (
                probe_id,
                probe_co2_id,
                probe_co2_measure
            )
            VALUES ?;
        `;

    let probeCo2Id = uniqid();
    const createProbeCo2values = [
      [
        req.params.probe_id, // Required
        probeCo2Id,
        req.body.probe_co2_measure,
      ],
    ];
    await con.query(createProbeCo2Query, [createProbeCo2values]);

    return res
      .status(200)
      .json(
        "ProbeCo2Id: " + probeCo2Id + " Measure: " + req.body.probe_co2_measure
      );
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
