export const measureQueryCurrent = `
(SELECT users.user_id, room.*, controller.*, probe.*, probe_co2.probe_co2_id AS measure_id, probe_co2.probe_co2_measure AS measure, probe_co2.probe_c02_created_at AS measure_created_at
  FROM users
  LEFT JOIN location
	ON users.user_id = location.user_id
  LEFT JOIN room
	ON location.location_id = room.location_id
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
  WHERE probe_co2_measure IS NOT NULL AND room.room_id = ? ORDER BY measure_created_at DESC LIMIT 1)
UNION ALL
(SELECT users.user_id, room.*, controller.*, probe.*, probe_hum.probe_hum_id AS measure_id, probe_hum.probe_hum_measure AS measure, probe_hum.probe_hum_created_at AS measure_created_at
  FROM users
  LEFT JOIN location
	ON users.user_id = location.user_id
  LEFT JOIN room
	ON location.location_id = room.location_id
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
  WHERE probe_hum_measure IS NOT NULL AND room.room_id = ? ORDER BY measure_created_at DESC LIMIT 1)
UNION ALL
(SELECT users.user_id, room.*, controller.*, probe.*, probe_ppm.probe_ppm_id AS measure_id, probe_ppm.probe_ppm_measure AS measure, probe_ppm.probe_ppm_created_at AS measure_created_at
  FROM users
  LEFT JOIN location
	ON users.user_id = location.user_id
  LEFT JOIN room
	ON location.location_id = room.location_id
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
    WHERE probe_ppm_measure IS NOT NULL AND room.room_id = ? ORDER BY measure_created_at DESC LIMIT 1)
UNION ALL
(SELECT users.user_id, room.*, controller.*, probe.*, probe_therm.probe_therm_id AS measure_id, probe_therm.probe_therm_measure AS measure, probe_therm.probe_therm_created_at AS measure_created_at
  FROM users
  LEFT JOIN location
	ON users.user_id = location.user_id
  LEFT JOIN room
	ON location.location_id = room.location_id
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
  WHERE probe_therm_measure IS NOT NULL AND room.room_id = ?  ORDER BY measure_created_at DESC LIMIT 1);`;
