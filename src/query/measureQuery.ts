export const measureQuery = `
  SELECT room.room_id, room.room_title, room.room_created_at, controller.controller_id, controller.controller_serial, controller.controller_make, controller.controller_model, controller.controller_created_at, probe.probe_id, probe.probe_make, probe.probe_model, probe.probe_type, probe.probe_created_at, probe_co2.probe_co2_id AS measure_id, probe_co2.probe_co2_measure AS measure, probe_co2.probe_c02_created_at AS measure_created_at
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
  WHERE probe_co2_measure IS NOT NULL AND room.room_id = ?
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
  WHERE probe_hum_measure IS NOT NULL AND room.room_id = ?
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
    WHERE probe_ppm_measure IS NOT NULL AND room.room_id = ?
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
  WHERE probe_therm_measure IS NOT NULL AND room.room_id = ? ORDER BY room_title, controller_created_at, probe_created_at, measure_created_at DESC;
`;
