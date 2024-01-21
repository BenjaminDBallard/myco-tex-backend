import uniqid from "uniqid";
import pool from "../connection.js";
import { Request, Response } from "express";
const con = await pool.getConnection();

export const getProbeCo2 = async (req: Request, res: Response) => {
  const historical = req.params.hist;
  let sql;
  if (historical === "true") {
    sql =
      "SELECT * FROM probe_co2 WHERE probe_id = ? ORDER BY probe_c02_created_at DESC;";
  } else {
    sql =
      "SELECT * FROM probe_co2 WHERE probe_id = ? ORDER BY probe_c02_created_at DESC LIMIT 1;";
  }
  try {
    const probe_id = req.params.probe_id;
    const [measurements] = await con.query(sql, probe_id);

    return res.status(200).json(measurements);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const logProbeCo2 = async (req: Request, res: Response) => {
  try {
    const createProbeCo2Query = `
            INSERT INTO probe_co2 (
                probe_id,
                probe_co2_id,
                probe_co2_measure
            )
            VALUES ?;
        `;

    const probeCo2Id = uniqid();
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
