import pool from "../connection.js";
const con = await pool.getConnection();

export const getMeasure = async (req: any, res: any) => {
  const sql = `SELECT
  controller.controller_id,
  probe.probe_id,
  probe.probe_type,
  probe_co2.probe_co2_measure,
  probe_hum.probe_hum_measure,
  probe_ppm.probe_ppm_measure,
  probe_therm.probe_therm_measure
FROM room
LEFT JOIN controller
  ON room.room_id = controller.room_id
LEFT JOIN probe
  ON controller.controller_id = probe.controller_id
LEFT JOIN probe_co2
  ON probe.probe_id = probe_co2.probe_id
  LEFT JOIN probe_hum
  ON probe.probe_id = probe_hum.probe_id
  LEFT JOIN probe_ppm
  ON probe.probe_id = probe_ppm.probe_id
  LEFT JOIN probe_therm
  ON probe.probe_id = probe_therm.probe_id
WHERE room.room_id = ?;
`;
  try {
    const room_id = req.params.room_id;
    const formattedSql = con.format(sql, room_id);
    const [rows] = await con.execute(formattedSql);
    let tabularData: any = rows;
    console.log(tabularData);
    const treeDataArray: User[] = convertToTreeArray(tabularData);

    return res.status(200).json(treeDataArray, null, 2);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

export const getReport = async (req: any, res: any) => {
  const sql = `SELECT
  users.user_id,
  location.location_id,
  location.location_title,
  room.room_id,
  room.room_title,
  controller.controller_id,
  probe.probe_id,
  probe.probe_type
FROM users 
LEFT JOIN location
  ON users.user_id = location.user_id
LEFT JOIN room
  ON location.location_id = room.location_id
LEFT JOIN controller
  ON room.room_id = controller.room_id
LEFT JOIN probe
  ON controller.controller_id = probe.controller_id
WHERE users.user_id = ?;`;
  try {
    const user_id = req.params.user_id;
    const formattedSql = con.format(sql, user_id);
    const [rows] = await con.execute(formattedSql);
    let tabularData: any = rows;
    console.log(tabularData);
    const treeDataArray: User[] = convertToTreeArray(tabularData);

    return res.status(200).json(treeDataArray, null, 2);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

interface Probe {
  probe_id: string;
  probe_type: string;
}

interface Controller {
  controller_id: string;
  probes: Probe[];
}

interface Room {
  room_id: string;
  room_title: string;
  controllers: Controller[];
}

interface Location {
  location_id: string;
  location_title: string;
  rooms: Room[];
}

interface User {
  user_id: string;
  locations: Location[];
}

function convertToTreeArray(data: any[]): User[] {
  const tree: User[] = [];

  data.forEach((item) => {
    const {
      user_id,
      location_id,
      location_title,
      room_id,
      room_title,
      controller_id,
      probe_id,
      probe_type,
    } = item;

    let userNode = tree.find((node) => node.user_id === user_id);

    if (!userNode) {
      userNode = {
        user_id,
        locations: [],
      };
      tree.push(userNode);
    }

    let locationNode = userNode.locations.find(
      (node) => node.location_id === location_id
    );

    if (!locationNode) {
      locationNode = {
        location_id,
        location_title,
        rooms: [],
      };
      if (location_id !== null) {
        userNode.locations.push(locationNode);
      }
    }

    let roomNode = locationNode.rooms.find((node) => node.room_id === room_id);

    if (!roomNode) {
      roomNode = {
        room_id,
        room_title,
        controllers: [],
      };
      if (room_id !== null) {
        locationNode.rooms.push(roomNode);
      }
    }

    let controllerNode = roomNode.controllers.find(
      (node) => node.controller_id === controller_id
    );

    if (!controllerNode) {
      controllerNode = {
        controller_id,
        probes: [],
      };
      if (controller_id !== null) {
        roomNode.controllers.push(controllerNode);
      }
    }
    if (probe_id !== null) {
      controllerNode.probes.push({
        probe_id,
        probe_type,
      });
    }
  });

  return tree;
}

//   const treeDataArray: User[] = convertToTreeArray(tabularData);
//   console.log(JSON.stringify(treeDataArray, null, 2));
