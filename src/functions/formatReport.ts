/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatReport = (tabData: any) => {
  const formatedData: UserReport[] = convertReportToTreeArray(tabData)
  return formatedData
}

interface ProbeReport {
  probe_id: string
  probe_make: string
  probe_model: string
  probe_type: string
  probe_created_at: string
}

interface ControllerReport {
  controller_id: string
  controller_name: string
  controller_serial: string
  controller_make: string
  controller_model: string
  controller_created_at: string
  probes: ProbeReport[]
}

interface RoomReport {
  room_id: string
  room_title: string
  room_created_at: string
  controllers: ControllerReport[]
}

interface LocationReport {
  location_id: string
  location_title: string
  location_created_at: string
  rooms: RoomReport[]
}

interface UserReport {
  user_id: string
  user_email: string
  user_pass: string
  user_company_name: string
  user_created_at: string
  locations: LocationReport[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, space-before-function-paren
function convertReportToTreeArray(data: any[]): UserReport[] {
  const tree: UserReport[] = []

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
      controller_name,
      controller_serial,
      controller_make,
      controller_model,
      controller_created_at,
      probe_id,
      probe_make,
      probe_model,
      probe_type,
      probe_created_at
    } = item

    let userNode = tree.find((node) => node.user_id === user_id)

    if (!userNode) {
      userNode = {
        user_id,
        user_email,
        user_pass,
        user_company_name,
        user_created_at,
        locations: []
      }
      tree.push(userNode)
    }

    let locationNode = userNode.locations.find((node) => node.location_id === location_id)

    if (!locationNode) {
      locationNode = {
        location_id,
        location_title,
        location_created_at,
        rooms: []
      }
      if (location_id !== null) {
        userNode.locations.push(locationNode)
      }
    }

    let roomNode = locationNode.rooms.find((node) => node.room_id === room_id)

    if (!roomNode) {
      roomNode = {
        room_id,
        room_title,
        room_created_at,
        controllers: []
      }
      if (room_id !== null) {
        locationNode.rooms.push(roomNode)
      }
    }

    let controllerNode = roomNode.controllers.find((node) => node.controller_id === controller_id)

    if (!controllerNode) {
      controllerNode = {
        controller_id,
        controller_name,
        controller_serial,
        controller_make,
        controller_model,
        controller_created_at,
        probes: []
      }
      if (controller_id !== null) {
        roomNode.controllers.push(controllerNode)
      }
    }

    if (probe_id !== null) {
      controllerNode.probes.push({
        probe_id,
        probe_make,
        probe_model,
        probe_type,
        probe_created_at
      })
    }
  })

  return tree
}
