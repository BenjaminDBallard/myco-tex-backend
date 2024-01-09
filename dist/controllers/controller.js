import pool from "../connection.js";
const con = await pool.getConnection();
export const getController = async (req, res) => {
    const sql = "SELECT * FROM controller WHERE room_id = ?";
    try {
        const room_id = req.params.room_id;
        const formattedSql = con.format(sql, room_id);
        const [rows] = await con.execute(formattedSql);
        return res.status(200).json(rows);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send(err);
    }
    finally {
        con.release();
    }
};
export const logController = async (req, res) => {
    console.log(req.body);
    try {
        const createControllerSql = `
            INSERT INTO controller (
                room_id,
                controller_serial,
                controller_make,
                controller_model,
                controller_ip
            )
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [
            req.params.room_id, // Required
            req.body.controller_serial?.substring(0, 100) || null,
            req.body.controller_make?.substring(0, 100) || null,
            req.body.controller_model?.substring(0, 100) || null,
            req.body.controller_ip?.substring(0, 100) || null,
        ];
        const formattedSql = con.format(createControllerSql, values);
        const [rows] = await con.execute(formattedSql);
        let tempResult = rows;
        // Access the insertId property on the result object
        const controllerId = tempResult.insertId;
        return res.status(200).json({ controllerId });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send(err);
    }
    finally {
        con.release();
    }
};
