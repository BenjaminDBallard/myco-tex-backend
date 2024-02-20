export const measureQueryCurrent = `
WITH max_co2 AS (
  SELECT probe_id, MAX(probe_c02_created_at) AS max_created_at
  FROM probe_co2
  GROUP BY probe_id
),
max_hum AS (
  SELECT probe_id, MAX(probe_hum_created_at) AS max_created_at
  FROM probe_hum
  GROUP BY probe_id
),
max_ppm AS (
  SELECT probe_id, MAX(probe_ppm_created_at) AS max_created_at
  FROM probe_ppm
  GROUP BY probe_id
),
max_therm AS (
  SELECT probe_id, MAX(probe_therm_created_at) AS max_created_at
  FROM probe_therm
  GROUP BY probe_id
)
SELECT users.user_id, room.*, controller.*, probe.*,
  COALESCE(probe_co2_id, probe_hum_id, probe_ppm_id, probe_therm_id) AS measure_id, 
    COALESCE(probe_co2_measure, probe_hum_measure, probe_ppm_measure, probe_therm_measure) AS measure, 
    COALESCE(probe_c02_created_at, probe_hum_created_at, probe_ppm_created_at, probe_therm_created_at) AS measure_created_at
FROM users
LEFT JOIN location ON users.user_id = location.user_id
LEFT JOIN room ON location.location_id = room.location_id
LEFT JOIN controller ON room.room_id = controller.room_id
LEFT JOIN probe ON controller.controller_id = probe.controller_id
LEFT JOIN max_co2 ON probe.probe_id = max_co2.probe_id
LEFT JOIN max_hum ON probe.probe_id = max_hum.probe_id
LEFT JOIN max_ppm ON probe.probe_id = max_ppm.probe_id
LEFT JOIN max_therm ON probe.probe_id = max_therm.probe_id
LEFT JOIN probe_co2 co2 ON max_co2.probe_id = co2.probe_id AND max_co2.max_created_at = co2.probe_c02_created_at
LEFT JOIN probe_hum hum ON max_hum.probe_id = hum.probe_id AND max_hum.max_created_at = hum.probe_hum_created_at
LEFT JOIN probe_ppm ppm ON max_ppm.probe_id = ppm.probe_id AND max_ppm.max_created_at = ppm.probe_ppm_created_at
LEFT JOIN probe_therm therm ON max_therm.probe_id = therm.probe_id AND max_therm.max_created_at = therm.probe_therm_created_at
WHERE room.room_id = ?
ORDER BY measure_created_at DESC;`
