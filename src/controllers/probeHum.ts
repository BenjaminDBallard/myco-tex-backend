import uniqid from "uniqid";
import pool from "../connection.js";
import { Request, Response } from "express";
const con = await pool.getConnection();

export const getProbeHum = async (req: Request, res: Response) => {
  const historical = req.params.hist;
  let sql;
  if (historical === "true") {
    sql =
      "SELECT * FROM probe_hum WHERE probe_id = ? ORDER BY probe_hum_created_at DESC;";
  } else {
    sql =
      "SELECT * FROM probe_hum WHERE probe_id = ? ORDER BY probe_hum_created_at DESC LIMIT 1;";
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

export const logProbeHum = async (req: Request, res: Response) => {
  try {
    const createProbeHumQuery = `
            INSERT INTO probe_hum (
                probe_id,
                probe_hum_id,
                probe_hum_measure
            )
            VALUES ?;
        `;

    const probeHumId = uniqid();

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
