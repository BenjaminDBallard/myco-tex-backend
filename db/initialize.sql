CREATE TABLE IF NOT EXISTS users (
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS location (
    user_id INT NOT NULL,
    location_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    location_title VARCHAR(50),
    location_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS building (
    location_id INT NOT NULL,
    building_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    building_title VARCHAR(50),
    building_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(location_id) REFERENCES location(location_id)
);

CREATE TABLE IF NOT EXISTS room (
    building_id INT NOT NULL,
    room_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    room_title VARCHAR(50),
    room_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(building_id) REFERENCES building(building_id)
);

CREATE TABLE IF NOT EXISTS controller (
    room_id INT NOT NULL,
    controller_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    controller_serial VARCHAR(50),
    controller_make VARCHAR(50),
    controller_model VARCHAR(50),
    controller_ip VARCHAR(50),
    controller_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(room_id) REFERENCES room(room_id)
);

CREATE TABLE IF NOT EXISTS probe (
    controller_id INT NOT NULL,
    probe_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    probe_serial VARCHAR(50),
    probe_make VARCHAR(50),
    probe_model VARCHAR(50),
    probe_type VARCHAR(50),
    probe_range VARCHAR(50),
    probe_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(controller_id) REFERENCES controller(controller_id)
);

CREATE TABLE IF NOT EXISTS probe_co2 (
    probe_id INT NOT NULL,
    probe_co2_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    probe_co2_measure VARCHAR(50),
    probe_co2_in_range VARCHAR(50),
    probe_c02_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(probe_id) REFERENCES probe(probe_id)
);

CREATE TABLE IF NOT EXISTS probe_therm (
    probe_id INT NOT NULL,
    probe_therm_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    probe_therm_measure VARCHAR(50),
    probe_therm_in_range VARCHAR(50),
    probe_therm_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(probe_id) REFERENCES probe(probe_id)
);

CREATE TABLE IF NOT EXISTS probe_ppm (
    probe_id INT NOT NULL,
    probe_ppm_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    probe_ppm_measure VARCHAR(50),
    probe_ppm_in_range VARCHAR(50),
    probe_ppm_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(probe_id) REFERENCES probe(probe_id)
);

CREATE TABLE IF NOT EXISTS probe_hum (
    probe_id INT NOT NULL,
    probe_hum_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    probe_hum_measure VARCHAR(50),
    probe_hum_in_range VARCHAR(50),
    probe_hum_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(probe_id) REFERENCES probe(probe_id)
)