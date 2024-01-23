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
    //This user id is passed to us by verifyJWT()
    const jwtUserID = req.params.user_id;
    const room_id = req.params.room_id;
    const rows = await con.query(sql, [room_id, room_id, room_id, room_id]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tabularData: any = rows[0];

    if (tabularData.length === 0) {
      return res.status(500).send("0 measurments availiable for this room");
    }

    const sqlUserID = tabularData[0].user_id;
    //if user id associated with location is different from user id provided in request, throw error
    if (sqlUserID !== jwtUserID) {
      return res.status(401).send("Room not found or unauthorized");
    }

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
    // sql query only allows user to view their own report implicitly
    const rows = await con.query(sql, user_id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
