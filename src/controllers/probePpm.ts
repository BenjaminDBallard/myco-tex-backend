import uniqid from "uniqid";
import pool from "../connection.js";
import { Request, Response } from "express";
const con = await pool.getConnection();

export const getProbePpm = async (req: Request, res: Response) => {
  const historical = req.params.hist;
  let sql;
  if (historical === "true") {
    sql =
      "SELECT * FROM probe_ppm WHERE probe_id = ? ORDER BY probe_ppm_created_at DESC";
  } else {
    sql =
      "SELECT * FROM probe_ppm WHERE probe_id = ? ORDER BY probe_ppm_created_at DESC LIMIT 1";
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

export const logProbePpm = async (req: Request, res: Response) => {
  try {
    const createProbePpmQuery = `
            INSERT INTO probe_ppm (
                probe_id,
                probe_ppm_id,
                probe_ppm_measure
            )
            VALUES ?;
        `;

    const probePpmId = uniqid();

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
