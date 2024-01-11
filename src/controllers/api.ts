import pool from "../connection.js";
const con = await pool.getConnection();

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
JOIN location
  ON users.user_id = location.user_id
JOIN room
  ON location.location_id = room.location_id
JOIN controller
  ON room.room_id = controller.room_id
JOIN probe
  ON controller.controller_id = probe.controller_id;`;
  try {
    const formattedSql = con.format(sql);
    const [rows] = await con.execute(formattedSql);
    let tabularData: any = rows;
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
      userNode.locations.push(locationNode);
    }

    let roomNode = locationNode.rooms.find((node) => node.room_id === room_id);

    if (!roomNode) {
      roomNode = {
        room_id,
        room_title,
        controllers: [],
      };
      locationNode.rooms.push(roomNode);
    }

    let controllerNode = roomNode.controllers.find(
      (node) => node.controller_id === controller_id
    );

    if (!controllerNode) {
      controllerNode = {
        controller_id,
        probes: [],
      };
      roomNode.controllers.push(controllerNode);
    }

    controllerNode.probes.push({
      probe_id,
      probe_type,
    });
  });

  return tree;
}

//   const treeDataArray: User[] = convertToTreeArray(tabularData);
//   console.log(JSON.stringify(treeDataArray, null, 2));
