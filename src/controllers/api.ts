import uniqid from "uniqid";
import pool from "../connection.js";
const con = await pool.getConnection();

console.log("!!!!!! new ID !!!!!!!");
console.log(uniqid());

export const getMeasure = async (req: any, res: any) => {
  const sql = `SELECT room.room_id, room.room_title, room.room_created_at, controller.controller_id, controller.controller_serial, controller.controller_make, controller.controller_model, controller.controller_created_at, probe.probe_id, probe.probe_make, probe.probe_model, probe.probe_type, probe.probe_created_at, probe_co2.probe_co2_id AS measure_id, probe_co2.probe_co2_measure AS measure, probe_co2.probe_c02_created_at AS measure_created_at
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
  WHERE probe_co2_measure IS NOT NULL AND room.room_id = "d3j0b6a90lrk30zi3"
UNION ALL
SELECT room.room_id, room.room_title, room.room_created_at, controller.controller_id, controller.controller_serial, controller.controller_make, controller.controller_model, controller.controller_created_at, probe.probe_id, probe.probe_make, probe.probe_model, probe.probe_type, probe.probe_created_at, probe_hum.probe_hum_id AS measure_id, probe_hum.probe_hum_measure AS measure, probe_hum.probe_hum_created_at AS measure_created_at
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
  WHERE probe_hum_measure IS NOT NULL AND room.room_id = "d3j0b6a90lrk30zi3"
UNION ALL
SELECT room.room_id, room.room_title, room.room_created_at, controller.controller_id, controller.controller_serial, controller.controller_make, controller.controller_model, controller.controller_created_at, probe.probe_id, probe.probe_make, probe.probe_model, probe.probe_type, probe.probe_created_at, probe_ppm.probe_ppm_id AS measure_id, probe_ppm.probe_ppm_measure AS measure, probe_ppm.probe_ppm_created_at AS measure_created_at
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
    WHERE probe_ppm_measure IS NOT NULL AND room.room_id = "d3j0b6a90lrk30zi3"
UNION ALL
SELECT room.room_id, room.room_title, room.room_created_at, controller.controller_id, controller.controller_serial, controller.controller_make, controller.controller_model, controller.controller_created_at, probe.probe_id, probe.probe_make, probe.probe_model, probe.probe_type, probe.probe_created_at, probe_therm.probe_therm_id AS measure_id, probe_therm.probe_therm_measure AS measure, probe_therm.probe_therm_created_at AS measure_created_at
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
  WHERE probe_therm_measure IS NOT NULL AND room.room_id = "d3j0b6a90lrk30zi3";
`;
  try {
    const room_id = req.params.room_id;
    const formattedSql = con.format(sql, room_id);
    const [rows] = await con.execute(formattedSql);
    let tabularData: any = rows;
    const treeDataArray: User[] = convertMToTreeArray(tabularData);
    const finalMeasure = treeDataArray[0].locations[0].rooms[0];

    return res.status(200).json(finalMeasure, null, 2);
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
  users.user_email,
  users.user_pass,
  users.user_company_name,
  users.user_created_at,
  location.location_id,
  location.location_title,
  location.location_created_at,
  room.room_id,
  room.room_title,
  room.room_created_at,
  controller.controller_id,
  controller.controller_serial,
  controller.controller_make,
  controller.controller_model,
  controller.controller_created_at,
  probe.probe_id,
  probe.probe_make,
  probe.probe_model,
  probe.probe_type,
  probe.probe_created_at
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
    const treeDataArray: UserOnly[] = convertToTreeArray(tabularData);
    const finalReport = treeDataArray[0];

    return res.status(200).json(finalReport, null, 2);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  } finally {
    con.release();
  }
};

interface ProbeOnly {
  probe_id: string;
  probe_make: string;
  probe_model: string;
  probe_type: string;
  probe_created_at: string;
}

interface ControllerOnly {
  controller_id: string;
  controller_serial: string;
  controller_make: string;
  controller_model: string;
  controller_created_at: string;
  probes: ProbeOnly[];
}

interface RoomOnly {
  room_id: string;
  room_title: string;
  room_created_at: string;
  controllers: ControllerOnly[];
}

interface LocationOnly {
  location_id: string;
  location_title: string;
  location_created_at: string;
  rooms: RoomOnly[];
}

interface UserOnly {
  user_id: string;
  user_email: string;
  user_pass: string;
  user_company_name: string;
  user_created_at: string;
  locations: LocationOnly[];
}

function convertToTreeArray(data: any[]): UserOnly[] {
  const tree: UserOnly[] = [];

  data.forEach((item) => {
    const {
      user_id,
      user_email,
      user_pass,
      user_company_name,
      user_created_at,
      location_id,
      location_title,
      location_created_at,
      room_id,
      room_title,
      room_created_at,
      controller_id,
      controller_serial,
      controller_make,
      controller_model,
      controller_created_at,
      probe_id,
      probe_make,
      probe_model,
      probe_type,
      probe_created_at,
    } = item;

    let userNode = tree.find((node) => node.user_id === user_id);

    if (!userNode) {
      userNode = {
        user_id,
        user_email,
        user_pass,
        user_company_name,
        user_created_at,
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
        location_created_at,
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
        room_created_at,
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
        controller_serial,
        controller_make,
        controller_model,
        controller_created_at,
        probes: [],
      };
      if (controller_id !== null) {
        roomNode.controllers.push(controllerNode);
      }
    }

    let probeNode = controllerNode.probes.find(
      (node) => node.probe_id === probe_id
    );

    if (probe_id !== null) {
      controllerNode.probes.push({
        probe_id,
        probe_make,
        probe_model,
        probe_type,
        probe_created_at,
      });
    }
  });

  return tree;
}

interface Measurement {
  measure_id: string;
  measure: string;
  measure_created_at: string;
}
interface Probe {
  probe_id: string;
  probe_make: string;
  probe_model: string;
  probe_type: string;
  probe_created_at: string;
  measurements: Measurement[];
}

interface Controller {
  controller_id: string;
  controller_serial: string;
  controller_make: string;
  controller_model: string;
  controller_created_at: string;
  probes: Probe[];
}

interface Room {
  room_id: string;
  room_title: string;
  room_created_at: string;
  controllers: Controller[];
}

interface Location {
  location_id: string;
  location_title: string;
  location_created_at: string;
  rooms: Room[];
}

interface User {
  user_id: string;
  user_created_at: string;
  locations: Location[];
}

function convertMToTreeArray(data: any[]): User[] {
  const tree: User[] = [];

  data.forEach((item) => {
    const {
      user_id,
      user_created_at,
      location_id,
      location_title,
      location_created_at,
      room_id,
      room_title,
      room_created_at,
      controller_id,
      controller_serial,
      controller_make,
      controller_model,
      controller_created_at,
      probe_id,
      probe_make,
      probe_model,
      probe_type,
      probe_created_at,
      measure_id,
      measure,
      measure_created_at,
    } = item;

    let userNode = tree.find((node) => node.user_id === user_id);

    if (!userNode) {
      userNode = {
        user_id,
        user_created_at,
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
        location_created_at,
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
        room_created_at,
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
        controller_serial,
        controller_make,
        controller_model,
        controller_created_at,
        probes: [],
      };
      if (controller_id !== null) {
        roomNode.controllers.push(controllerNode);
      }
    }

    let probeNode = controllerNode.probes.find(
      (node) => node.probe_id === probe_id
    );

    if (!probeNode) {
      probeNode = {
        probe_id,
        probe_make,
        probe_model,
        probe_type,
        probe_created_at,
        measurements: [],
      };
      if (probe_id !== null) {
        controllerNode.probes.push(probeNode);
      }
    }
    if (measure !== null) {
      probeNode.measurements.push({
        measure_id,
        measure,
        measure_created_at,
      });
    }
  });

  return tree;
}
