/* eslint-disable @typescript-eslint/no-explicit-any */
import uniqid from 'uniqid'
import pool from '../connection'
import { Request, Response } from 'express'

export const logLocation = async (req: Request, res: Response) => {
  const con = await pool.getConnection()
  try {
    // This user id is passed to us by verifyJWT()
    const jwtUserID = req.params.user_id
    if (!req.body.location_title) {
      return res.status(400).send('Missing required params')
    }
    // verify SQL location names
    const sqltitleCheck: any = await con.execute(
      `SELECT users.user_id, location.location_title
          FROM users
          LEFT JOIN location
            ON users.user_id = location.user_id
          WHERE users.user_id = ?`,
      [jwtUserID]
    )
    // user authenticated
    if (sqltitleCheck[0].length === 0 || sqltitleCheck.user_id === null) {
      return res.status(400).send('user not authorizeed')
    }

    // If location with same name exists throw error
    const locationNamesInLocation = sqltitleCheck[0].map((item: any) => item.location_title)
    if (locationNamesInLocation.includes(req.body.location_title)) {
      return res.status(400).send('this user already has a location with the title: ' + req.body.location_title)
    }

    // user is only able to post a location under their own user_id via sql query
    const createLocationSql = 'INSERT INTO location (user_id, location_id, location_title) VALUES ?;'
    const locationId = uniqid()
    const locationTitle = req.body.location_title
    const createLocationValues = [[jwtUserID, locationId, locationTitle?.substring(0, 50) || null]]
    await con.query(createLocationSql, [createLocationValues])

    return res.status(200).send('New location created! Location_id:' + locationId)
  } catch (err) {
    console.error(err)
    return res.status(500).send(err)
  } finally {
    con.release()
  }
}

export const updateLocation = async (req: Request, res: Response) => {
  const con = await pool.getConnection()
  if (!req.body.location_title) {
    return res.status(400).send('Missing required params')
  }
  // This user id is passed to us by verifyJWT()
  const jwtUserID = req.params.user_id

  // verify SQL location names
  const sqltitleCheck: any = await con.execute(
    `SELECT users.user_id, location.location_id, location.location_title
      FROM users
      LEFT JOIN location
        ON users.user_id = location.user_id
      WHERE users.user_id = ?`,
    [jwtUserID]
  )
  // user authenticated
  if (sqltitleCheck[0].length === 0 || sqltitleCheck.user_id === null) {
    return res.status(400).send('user not authorized')
  }

  // If location ID does not exist throw error
  const locationIDs = sqltitleCheck[0].map((item: any) => item.location_id)
  if (!locationIDs.includes(req.params.location_id)) {
    return res.status(400).send('cannot rename location that does not exist')
  }

  // If location with same name exists throw error
  const locationNames = sqltitleCheck[0].map((item: any) => item.location_title)
  if (locationNames.includes(req.body.location_title)) {
    return res.status(400).send('this user already has a location with the title: ' + req.body.location_title)
  }

  const fields = ['location_title']

  const setClauses = fields.map((field) => `${field} = ?`)
  const values = fields.map((field) => {
    const value = req.body[field]
    return value != null ? value : null // If value is null or undefined, replace with null
  })

  const sql = `UPDATE location SET ${setClauses.join(', ')} WHERE location_id = ? AND location.user_id = ?`
  // user is only able to update a location under their own user_id via sql query
  values.push(req.params.location_id, jwtUserID)

  try {
    const formattedSql = con.format(sql, values)
    const [rows] = await con.query(formattedSql)
    const tabularRow: any = rows

    if (tabularRow.affectedRows === 0) {
      return res.status(404).send('Location not found or unauthorized')
    }

    // After updating, fetch the updated job data
    const [updatedLocation] = await con.execute(
      'SELECT * FROM location WHERE location_id = ? AND location.user_id = ?;',
      [req.params.location_id, jwtUserID]
    )

    const tabularData: any = updatedLocation

    return res.status(200).json(tabularData) // Assumes the first record is the updated job data
  } catch (err) {
    console.error(err)
    return res.status(500).send(err)
  } finally {
    con.release()
  }
}

// export const getLocation = async (req: Request, res: Response) => {
//   try {
//     //This user id is passed to us by verifyJWT()
//     const jwtUserID = req.params.user_id;
//     //user is only able to get a location under their own user_id via sql query
//     const findLocationQuery = `SELECT location.*
//     FROM users
//     LEFT JOIN location
//       ON users.user_id = location.user_id
//     WHERE users.user_id = ?;`;

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const locations: any = await con.query(findLocationQuery, jwtUserID);

//     if (locations.length === 0)
//       return res.status(500).send("0 locations available for this user");

//     const sqlUserID = locations[0][0].user_id;

//     //if user id associated with location is different from user id provided in request, throw error
//     if (sqlUserID !== jwtUserID) {
//       return res
//         .status(401)
//         .send("You do not have permission to view this location");
//     }

//     return res.status(200).json(locations[0]);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send(err);
//   } finally {
//     con.release();
//   }
// };
