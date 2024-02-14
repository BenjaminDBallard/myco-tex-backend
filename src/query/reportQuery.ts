export const reportQuery = `SELECT
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
  controller.controller_name,
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
WHERE users.user_id = ? ORDER BY user_company_name, location_title, room_title, controller_created_at, probe_created_at DESC;`
