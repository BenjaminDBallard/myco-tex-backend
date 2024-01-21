import uniqid from "uniqid";
import pool from "../connection.js";
const con = await pool.getConnection();
import { measureQuery } from "../query/measureQuery.js";
import { reportQuery } from "../query/reportQuery.js";
import { formatReport } from "../functions/formatReport.js";
import { formatMeasure } from "../functions/formatMeasure.js";
import { Request, Response } from "express";
import { measureQueryCurrent } from "../query/measureQueryCurrent.js";

console.log("!!!!!! new ID !!!!!!!");
console.log(uniqid());

export const getMeasure = async (req: Request, res: Response) => {
  const historical = req.params.hist;
  let sql;
  if (historical === "true") {
    sql = measureQuery;
  } else {
    sql = measureQueryCurrent;
  }
  try {
    const room_id = req.params.room_id;
    const rows = await con.query(sql, [room_id, room_id, room_id, room_id]);
    const tabularData: any = rows[0];
    const treeDataArray = formatMeasure(tabularData);
    const finalMeasure = treeDataArray[0].locations[0].rooms[0];

    return res.status(200).json(finalMeasure);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const getReport = async (req: Request, res: Response) => {
  const sql = reportQuery;
  try {
    const user_id = req.params.user_id;
    // const formattedSql = con.format(sql, user_id);
    const rows = await con.query(sql, user_id);
    const typedData: any = rows[0];
    const treeDataArray = formatReport(typedData);
    const finalReport = treeDataArray[0];

    return res.status(200).json(finalReport);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

// interface SqlReport {
//   user_id: string;
//   user_email: string;
//   user_pass: string;
//   user_company_name: string;
//   user_created_at: string;
//   location_id: string;
//   location_title: string;
//   location_created_at: string;
//   room_id: string;
//   room_title: string;
//   room_created_at: string;
//   controller_id: string;
//   controller_serial: string;
//   controller_make: string;
//   controller_model: string;
//   controller_created_at: string;
//   probe_id: string;
//   probe_make: string;
//   probe_model: string;
//   probe_type: string;
//   probe_created_at: string;
// }
