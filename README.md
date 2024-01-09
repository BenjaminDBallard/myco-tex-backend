# myco-tex-backend

This project is the core server-side code for
[Myco-tex](url tbd).
This site provides:

- Static pages for main site (react)
- Node.js application server
- REST endpoints for the main web site

Current work is focused on establishing a monitoring system and database for temps, co2, and other enviromental metrics.

## Related Projects/Modules

**myco-tex-backend** This project. Serves up REST
endpoints for dashboard application using express, node, & mysql2.

**myco-tex-dashboard** This is the main dashboard application used for monitoring facility enviromental status using react & styled-components.
The Github project is:
https://github.com/jason-cornish/myco-tex-dashboard.

**myco-tex-sensors** Scripts to effectively recieve and send temps, humitity, co2 and other enviromental variables using python.
The Github project is:
https://github.com/BenjaminDBallard/myco-tex-sensors.

## Project setup

```
npm install
```

Create an empty local SQL database and a dotenv file with the following values:

```
HOST=localhost
DBUSERNAME=your database username
PASSWORD=your database password
DATABASE=your database name
```

### Compiles typescript, Initializes DB, & Starts local server

```
npm run start
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

## Endpoints

###User:

```
http://localhost:3000/api/uuid/post
```

Example user post body:

```
{
    "parcel": "userID001"
}
```

###Location:

```
http://localhost:3000/api/locations/${user_id}/location
```

Example location post body:

```
{
    "user_id": "userID001",
    "location_title": "mycoLab"
}
```

###Room:

```
http://localhost:3000/api/rooms/${location_id}/room
```

Example room post body:

```
{
    "location_id": "1",
    "room_title": "incubation"
}
```

###Controller:

```
http://localhost:3000/api/controllers/${room_id}/controller
```

Example controller post body:

```
{
    "room_id": "1",
    "controller_serial": "1234qwer5678",
    "controller_make": "espressif",
    "controller_model": "esp32-wroom-32u",
    "controller_ip": "123.456.678"
}
```

###Probe:

```
http://localhost:3000/api/probes/${controller_id}/probe
```

Example probe post body:

```
{
    "controller_id": "1",
    "probe_make": "makeofprobe",
    "probe_model": "probemodel",
    "probe_type": "therm"
}
```

###ProbeCo2:

```
http://localhost:3000/api/probesCo2/${probe_id}/probeCo2
```

Example probeCo2 post body:

```
{
    "probe_id": "1",
    "probe_co2_measure": "128"
}
```

###ProbeHum:

```
http://localhost:3000/api/probesHum/${probe_id}/probeHum
```

Example probeHum post body:

```
{
    "probe_id": "1",
    "probe_hum_measure": "130"
}
```

###ProbePpm:

```
http://localhost:3000/api/probesPpm/${probe_id}/probePpm
```

Example probePpm post body:

```
{
    "probe_id": "1",
    "probe_ppm_measure": "320"
}
```

###ProbeTherm:

```
http://localhost:3000/api/probesTherm/${probe_id}/probeTherm
```

Example probeTherm post body:

```
{
    "probe_id": "1",
    "probe_therm_measure": "70"
}
```
