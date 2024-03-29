/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import uniqid from 'uniqid'
import pool from '../connection'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { SECRET_KEY } from '../middleware/verifyJwt'

export const signUp = async (req: Request, res: Response) => {
  const con = await pool.getConnection()
  if (!req.body.user_email || !req.body.user_pass) {
    return res.status(400).send('Missing required params')
  }
  // Determine if user already exists
  try {
    const findUserQuery = 'SELECT * FROM users WHERE user_email = ?;'
    const { user_email, user_pass } = req.body
    const hash = await bcrypt.hash(user_pass, 13)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: any = await con.query(findUserQuery, user_email)
    // let userOptions = {user_id: user.}
    // let userArray = new UserArray(user);

    // If user does not already exist
    if (!user[0].length) {
      // Post new user
      const populateUserQuery = 'INSERT INTO users (user_id, user_email, user_pass, user_company_name) VALUES ?;'
      const userId = uniqid()
      let userCompany = req.body.user_company_name
      if (userCompany === null || userCompany === undefined) {
        userCompany = 'Personal'
      }
      const populateUserValues = [[userId, user_email, hash, userCompany]]
      await con.query(populateUserQuery, [populateUserValues])

      // Post new location to user
      const populateLocationQuery = 'INSERT INTO location (user_id, location_id, location_title) VALUES ?;'
      const locationId = uniqid()
      const locationTitle = userCompany
      const populateLocationValues = [[userId, locationId, locationTitle]]
      await con.query(populateLocationQuery, [populateLocationValues])

      // Post new rooms to location
      const populateRoomsQuery = 'INSERT INTO room (location_id, room_id, room_title) VALUES ?;'
      const populateRoomsValues = [
        [locationId, uniqid(), 'Mixer'],
        [locationId, uniqid(), 'Steamer'],
        [locationId, uniqid(), 'Lab'],
        [locationId, uniqid(), 'Incubation']
      ]
      await con.query(populateRoomsQuery, [populateRoomsValues])

      return res.status(200).send('User created! user_id: ' + userId)
    } else {
      return res.status(400).send('email is already associated with an account')
    }
  } catch (err) {
    return res.status(500).send(err + 'User creation failed')
  } finally {
    con.release()
  }
}

export const logIn = async (req: Request, res: Response) => {
  const con = await pool.getConnection()
  if (!req.body.user_email || !req.body.user_pass) {
    return res.status(400).send('Missing required params')
  }
  try {
    // Determine if user already exists
    const { user_email, user_pass } = req.body
    const findUserQuery = 'SELECT * FROM users WHERE user_email = ?;'
    const userArray: any = await con.query(findUserQuery, user_email)

    // If user does not exist (error)
    if (!userArray[0].length || userArray[0][0].user_email === null) {
      return res.status(400).send('Incorrect username or password')
    }

    // If user does exist, verify password
    const isValid = await bcrypt.compare(user_pass, userArray[0][0].user_pass)

    // If incorrect password (error)
    if (!isValid) {
      return res.status(400).send('Incorrect username or password')
    }

    // If secret SECRET_KEY does not exist (error)
    if (!SECRET_KEY) return res.status(500).send('Access token not found')

    //If secret SECRET_KEY does exist generate JWT
    const id: string = userArray[0][0].user_id
    const token = jwt.sign({ id }, SECRET_KEY, { expiresIn: '1h' })
    const refreshToken = jwt.sign({ id }, SECRET_KEY, { expiresIn: '8h' })

    res.cookie('x-refresh-token', refreshToken, {
      httpOnly: true,
      sameSite: 'strict'
    })
    res.set('Access-Control-Expose-Headers', 'x-access-token')
    res.header('x-access-token', token).json({ user_id: id })
  } catch (err) {
    return res.status(500).send('Unable to log in')
  } finally {
    con.release()
  }
}

export const refreshJWT = async (req: Request, res: Response) => {
  const refreshToken = req.cookies['x-refresh-token']

  if (!refreshToken) {
    return res.status(401).send('Access Denied. No refresh token provided.')
  }

  try {
    const decoded = jwt.verify(refreshToken, SECRET_KEY) as JwtPayload
    const token = jwt.sign({ id: decoded.id }, SECRET_KEY, { expiresIn: '1h' })
    const NewRefreshToken = jwt.sign({ id: decoded.id }, SECRET_KEY, {
      expiresIn: '8h'
    })

    res
      .cookie('x-refresh-token', NewRefreshToken, {
        httpOnly: true,
        sameSite: 'strict'
      })
      .set('Access-Control-Expose-Headers', 'x-access-token')
      .header('x-access-token', token)
      .send(decoded.id)
  } catch (error) {
    return res.status(400).send('Invalid refresh token.')
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const con = await pool.getConnection()
  if (!req.body.user_pass) {
    return res.status(400).send('Missing required params')
  }
  // This user id is passed to us by verifyJWT()
  const jwtUserID = req.params.user_id

  // verify SQL location names
  // eslint-disable-next-line quotes
  const sqlEmailCheck: any = await con.execute(`SELECT user_email FROM users`)

  // verify SQL current user info
  // eslint-disable-next-line quotes
  const sqlCurrentCheck: any = await con.execute(`SELECT * FROM users WHERE user_id = ?`, [jwtUserID])

  // user authenticated
  if (sqlCurrentCheck[0].length === 0 || sqlCurrentCheck.user_id === null) {
    return res.status(400).send('user not authorized')
  }
  // Current values
  const currentEmail = sqlCurrentCheck[0][0].user_email
  const currentHashPass = sqlCurrentCheck[0][0].user_pass
  const currentPass = req.body.user_pass
  const currentCompanyName = sqlCurrentCheck[0][0].user_company_name

  // New values
  const newEmail = req.body.new_user_email
  const newPass = req.body.new_user_pass
  const newCompanyName = req.body.new_user_company_name

  // final values
  let email = currentEmail
  let pass = currentHashPass
  let companyName = currentCompanyName

  // pass validation
  const oldPassIsValid = await bcrypt.compare(currentPass, currentHashPass)
  if (!oldPassIsValid) {
    return res.status(400).send('Incorrect Password')
  }

  // validate email change
  if (newEmail !== undefined && newEmail !== null) {
    const userEmails = sqlEmailCheck[0].map((item: any) => item.user_email)
    if (userEmails.includes(newEmail) && newEmail !== currentEmail) {
      return res.status(400).send('A user with this email already exists: ' + req.body.new_user_email)
    }
    email = newEmail
  }
  // validate password change
  if (newPass !== undefined && newPass !== null) {
    pass = await bcrypt.hash(newPass, 13)
  }

  // validate company change
  if (newCompanyName !== undefined && newEmail !== null) {
    companyName = newCompanyName
  }

  // set values
  const values = [email, pass, companyName]
  const fields = ['user_email', 'user_pass', 'user_company_name']

  const setClauses = fields.map((field) => `${field} = ?`)

  // sql query implicitly only allows users to edit their own user info
  const sql = `UPDATE users SET ${setClauses.join(', ')} WHERE user_id = ?`
  values.push(jwtUserID)
  // submit
  try {
    const formattedSql = con.format(sql, values)
    const [rows] = await con.query(formattedSql)
    const tabularRow: any = rows

    if (tabularRow.affectedRows === 0) {
      return res.status(404).send('User not found or unauthorized')
    }

    // After updating, fetch the updated job data
    const [updatedUser] = await con.execute('SELECT * FROM users WHERE user_id = ?', [jwtUserID])

    const tabularData: any = updatedUser

    return res.status(200).json(tabularData) // Assumes the first record is the updated job data
  } catch (err) {
    console.error(err)
    return res.status(500).send(err)
  } finally {
    con.release()
  }
}

// export const getUser = async (req: Request, res: Response) => {
//   const sql = "SELECT * FROM users WHERE user_id = ?;";
//   try {
//     //This user id is passed to us by verifyJWT()
//     const jwtUserID = req.params.user_id;
//     //sql query implicitly only allows users to look at their own user info
//     const formattedSql = con.format(sql, jwtUserID);
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const users: any = await con.query(formattedSql);

//     if (users.length === 0) return res.status(500).send("user does not exist");

//     const sqlUserID = users[0][0].user_id;

//     //if user id in db is different from user id provided in request, throw error
//     if (sqlUserID !== jwtUserID) {
//       return res
//         .status(401)
//         .send("You do not have permission to view this user");
//     }

//     return res.status(200).json(users[0][0]);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send(err);
//   } finally {
//     con.release();
//   }
// };
