import pool from "../connection.js";
import { Request, Response } from "express";
const con = await pool.getConnection();

export const getProbe = async (req: Request, res: Response) => {
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

export const logProbe = async (req: Request, res: Response) => {
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

export const updateProbe = async (req: Request, res: Response) => {
  const fields = ["controller_id", "probe_make", "probe_model", "probe_type"];

  const setClauses = fields.map((field) => `${field} = ?`);
  const values = fields.map((field) => {
    const value = req.body[field];
    return value != null ? value : null; // If value is null or undefined, replace with null
  });
  console.log(values);

  const sql = `UPDATE probe SET ${setClauses.join(", ")} WHERE probe_id = ?`;
  values.push(req.params.probe_id);

  const con = await pool.getConnection();
  try {
    const formattedSql = con.format(sql, values);
    const [rows] = await con.execute(formattedSql);
    const tabularRow: any = rows;

    if (tabularRow.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Probe not found or unauthorized" });
    }

    // After updating, fetch the updated job data
    const [updatedProbe] = await con.execute(
      "SELECT * FROM probe WHERE probe_id = ?",
      [req.params.probe_id]
    );
    const tabularData: any = updatedProbe;
    console.log(updatedProbe);

    return res.status(200).json(tabularData); // Assumes the first record is the updated job data
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
