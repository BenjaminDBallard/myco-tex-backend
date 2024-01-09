import pool from "../connection.js";
const con = await pool.getConnection();

export const logUser = async (req: any, res: any) => {
  try {
    const user = req.body.parcel;
    console.log("Successfully retrieved:" + user);
    const [rows] = await con.execute("SELECT * FROM users WHERE user_id = ?", [
      user,
    ]);
    let tempResult: any = rows;

    if (tempResult.length === 0) {
      const query = `
                INSERT INTO users (user_id)
                VALUES (?)
            `;
      await con.execute(query, [user]);
      return res.status(200).send("User Created");
    } else {
      return res.send("Welcome back");
    }
  } catch (err) {
    console.error(err + "User failed to send");
  }
};

// export const getUser = async (req: any, res: any) => {
//   const user = req.params;
//   console.log(user);
//   return res.status(200).json({ user_id: user });
// };

export const getUser = async (req: any, res: any) => {
  const sql = "SELECT * FROM users";
  try {
    const formattedSql = con.format(sql);
    const [rows] = await con.execute(formattedSql);

    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};
