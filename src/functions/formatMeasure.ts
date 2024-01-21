export const formatMeasure = (tabData: any) => {
  const formatedData: User[] = convertMeasureToTreeArray(tabData);
  return formatedData;
};

interface Measurement {
  measure_id: string;
  measure: number;
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

function convertMeasureToTreeArray(data: any[]): User[] {
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
