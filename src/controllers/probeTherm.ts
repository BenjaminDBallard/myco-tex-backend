import uniqid from "uniqid";
import pool from "../connection.js";
import { Request, Response } from "express";
const con = await pool.getConnection();

export const getProbeTherm = async (req: Request, res: Response) => {
  const historical = req.params.hist;
  let sql;
  if (historical === "true") {
    sql =
      "SELECT * FROM probe_therm WHERE probe_id = ? ORDER BY probe_therm_created_at DESC";
  } else {
    sql =
      "SELECT * FROM probe_therm WHERE probe_id = ? ORDER BY probe_therm_created_at DESC LIMIT 1";
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

export const logProbeTherm = async (req: Request, res: Response) => {
  try {
    const createProbeThermQuery = `
            INSERT INTO probe_therm (
                probe_id,
                probe_therm_id,
                probe_therm_measure
            )
            VALUES ?;
        `;

    const probeThermId = uniqid();

    const createProbeThermValues = [
      [
        req.params.probe_id, // Required
        probeThermId,
        req.body.probe_therm_measure,
      ],
    ];
    await con.query(createProbeThermQuery, [createProbeThermValues]);

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
