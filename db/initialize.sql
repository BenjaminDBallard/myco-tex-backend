CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(100) NOT NULL PRIMARY KEY,
        user_email VARCHAR(50),
        user_pass VARCHAR(100),
        user_company_name VARCHAR(50),
        user_created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS device (
    user_id VARCHAR(100) NOT NULL,
    device_id VARCHAR(100) NOT NULL PRIMARY KEY,
    device_controller_id VARCHAR(100) NOT NULL,
    device_pass VARCHAR(100) NOT NULL,
    device_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS location (
        user_id VARCHAR(100) NOT NULL,
        location_id VARCHAR(100) NOT NULL PRIMARY KEY,
        location_title VARCHAR(50),
        location_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(user_id)
    );

CREATE TABLE IF NOT EXISTS room (
        location_id VARCHAR(100) NOT NULL,
        room_id VARCHAR(100) NOT NULL PRIMARY KEY,
        room_title VARCHAR(50),
        room_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(location_id) REFERENCES location(location_id)
    );

CREATE TABLE IF NOT EXISTS controller (
        room_id VARCHAR(100) NOT NULL,
        controller_id VARCHAR(100) NOT NULL PRIMARY KEY,
        controller_name VARCHAR(50),
        controller_serial VARCHAR(50),
        controller_make VARCHAR(50),
        controller_model VARCHAR(50),
        controller_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(room_id) REFERENCES room(room_id)
    );

CREATE TABLE IF NOT EXISTS probe (
        controller_id VARCHAR(100) NOT NULL,
        probe_id VARCHAR(100) NOT NULL PRIMARY KEY,
        probe_make VARCHAR(50),
        probe_model VARCHAR(50),
        probe_type VARCHAR(50),
        probe_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(controller_id) REFERENCES controller(controller_id)
    );

CREATE TABLE IF NOT EXISTS probe_co2 (
        probe_id VARCHAR(100) NOT NULL,
        probe_co2_id VARCHAR(100) NOT NULL PRIMARY KEY,
        probe_co2_measure FLOAT,
        probe_c02_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(probe_id) REFERENCES probe(probe_id)
    );

CREATE TABLE IF NOT EXISTS probe_therm (
        probe_id VARCHAR(100) NOT NULL,
        probe_therm_id VARCHAR(100) NOT NULL PRIMARY KEY,
        probe_therm_measure FLOAT,
        probe_therm_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(probe_id) REFERENCES probe(probe_id)
    );

CREATE TABLE IF NOT EXISTS probe_ppm (
        probe_id VARCHAR(100) NOT NULL,
        probe_ppm_id VARCHAR(100) NOT NULL PRIMARY KEY,
        probe_ppm_measure FLOAT,
        probe_ppm_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(probe_id) REFERENCES probe(probe_id)
    );

CREATE TABLE IF NOT EXISTS probe_hum (
        probe_id VARCHAR(100) NOT NULL,
        probe_hum_id VARCHAR(100) NOT NULL PRIMARY KEY,
        probe_hum_measure FLOAT,
        probe_hum_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(probe_id) REFERENCES probe(probe_id)
    );