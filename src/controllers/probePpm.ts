/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import uniqid from 'uniqid'
import pool from '../connection'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

export const getProbePpm = async (req: Request, res: Response) => {
  const con = await pool.getConnection()
  try {
    // This user id is passed to us by verifyJWT()
    const jwtUserID = req.params.user_id
    const probe_id = req.params.probe_id
    const historical = req.params.hist
    let from
    let to

    if (req.params.from === undefined || req.params.from === null) {
      from = '0'
    } else {
      from = req.params.from
    }

    if (req.params.to === undefined || req.params.to === null) {
      to = '2147483647'
    } else {
      to = req.params.to
    }

    let values
    let sql
    if (historical === 'true' && from) {
      sql = `SELECT users.user_id, controller.controller_id, probe_ppm.probe_id, probe_ppm.probe_ppm_id AS measure_id, probe_ppm.probe_ppm_measure AS measure, UNIX_TIMESTAMP(probe_ppm.probe_ppm_created_at) AS measure_created_at
    FROM users
    LEFT JOIN location
      ON users.user_id = location.user_id
    LEFT JOIN room
      ON location.location_id = room.location_id
    LEFT JOIN controller
      ON room.room_id = controller.room_id
    LEFT JOIN probe
      ON controller.controller_id = probe.controller_id
    LEFT JOIN probe_ppm
      ON probe.probe_id = probe_ppm.probe_id
      WHERE (probe.probe_id = ? AND probe_ppm_created_at BETWEEN FROM_UNIXTIME(?) AND FROM_UNIXTIME(?)) 
      ORDER BY measure_created_at DESC;`
      values = [probe_id, from, to]
    } else {
      sql = `SELECT users.user_id, controller.controller_id, probe_ppm.probe_id, probe_ppm.probe_ppm_id AS measure_id, probe_ppm.probe_ppm_measure AS measure, UNIX_TIMESTAMP(probe_ppm.probe_ppm_created_at) AS measure_created_at
    FROM users
    LEFT JOIN location
      ON users.user_id = location.user_id
    LEFT JOIN room
      ON location.location_id = room.location_id
    LEFT JOIN controller
      ON room.room_id = controller.room_id
    LEFT JOIN probe
      ON controller.controller_id = probe.controller_id
    LEFT JOIN probe_ppm
      ON probe.probe_id = probe_ppm.probe_id
    WHERE probe.probe_id = ? ORDER BY measure_created_at DESC LIMIT 1;`
      values = [probe_id]
    }

    const measurements: any = await con.query(sql, values)

    if (measurements[0].length === 0 || measurements[0][0].probe_id === null) {
      return res
        .status(500)
        .send(
          '0 measurements available on this device, or you do not have permission to view the measurements from this device'
        )
    }

    const sqlUserID = measurements[0][0].user_id
    if (sqlUserID !== jwtUserID) {
      return res.status(401).send('You do not have permission to view the measurements from this device')
    }

    return res.status(200).json(measurements[0])
  } catch (err) {
    console.error(err)
    return res.status(500).send(err)
  } finally {
    con.release()
  }
}

export const logProbePpm = async (req: Request, res: Response) => {
  const con = await pool.getConnection()
  try {
    const { controller_id, device_pass, probe_ppm_measure } = req.body
    if (!controller_id || !device_pass || !probe_ppm_measure) {
      return res.status(400).send('Missing required params')
    }
    // verify SQL user_id
    const sqlDeviceCheck: any = await con.execute(
      `SELECT *
        FROM device
        WHERE device_controller_id = ?;`,
      [controller_id]
    )

    const sqlProbeCheck: any = await con.execute(
      `SELECT *
        FROM probe
        WHERE probe_id = ?;`,
      [req.params.probe_id]
    )

    // If device does not already exist
    if (sqlDeviceCheck[0].length === 0) {
      return res.status(400).send('device not added to aproved devices')
    }
    const isValid = await bcrypt.compare(device_pass, sqlDeviceCheck[0][0].device_pass)
    if (!isValid) {
      return res.status(400).send('device access denied')
    }
    // Check if probe exists
    if (sqlProbeCheck[0].length === 0) {
      return res.status(400).send('probe does not exist on this device')
    }

    // If device making request does match device in db, begin insert
    const createProbePpmQuery = `
            INSERT INTO probe_ppm (
                probe_id,
                probe_ppm_id,
                probe_ppm_measure
            )
            VALUES ?;
        `

    const probePpmId = uniqid()
    const createProbePpmValues = [
      [
        req.params.probe_id, // Required
        probePpmId, // Required
        probe_ppm_measure // Required
      ]
    ]
    await con.query(createProbePpmQuery, [createProbePpmValues])

    return res.status(200).json('controllerId: ' + controller_id + ' Type: ppm ' + ' Measure: ' + probe_ppm_measure)
  } catch (err) {
    console.error(err)
    return res.status(500).send(err)
  } finally {
    con.release()
  }
}
