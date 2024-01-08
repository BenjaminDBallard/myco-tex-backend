import pool from "../connection.js";
const con = await pool.getConnection();

export const logUuid = async (req: any, res: any) => {
  try {
    const uuid = req.body.parcel;
    console.log("Successfully retrieved:" + uuid);
    const [rows] = await con.execute("SELECT * FROM users WHERE user_id = ?", [
      uuid,
    ]);
    let tempResult: any = rows;

    if (tempResult.length === 0) {
      const query = `
                INSERT INTO users (user_id)
                VALUES (?)
            `;
      await con.execute(query, [uuid]);
      return res.status(200).send("User Created");
    } else {
      return res.send("Welcome back");
    }
  } catch (err) {
    console.error(err + "UUID failed to send");
  }
};

export const getUserId = async (req: any, res: any) => {
  const uuid = req.params;
  console.log(uuid);
  return res.status(200).json({ user_id: uuid });
};
