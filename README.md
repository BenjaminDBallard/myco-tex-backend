# myco-tex-backend

This project is the core server-side code for
[Myco-tex](url tbd).
This site provides:

- Static pages for main site (react)
- Node.js application server
- REST endpoints for the main web site

Current work is focused on establishing a monitoring system and database for temps, co2, and other enviromental metrics.

## Related Projects/Modules

- **myco-tex-backend** This project. Serves up REST
endpoints for dashboard application using express, node, & mysql2.

- **myco-tex-dashboard** This is the main dashboard application used for monitoring facility enviromental status using react & styled-components.
The Github project is:
https://github.com/jason-cornish/myco-tex-dashboard.

- **myco-tex-sensors** Scripts to effectively recieve and send temps, humitity, co2 and other enviromental variables using python.
The Github project is:
https://github.com/BenjaminDBallard/myco-tex-sensors.

> [!TIP]
>
> ## Project setup
>
> ```
> npm install
> ```
>
> Create an empty local SQL database and a dotenv file with the following values:
>
> ```
> HOST=localhost
> DBUSERNAME=your database username
> PASSWORD=your database password
> DATABASE=your database name
> ```
> 
> ### Compiles typescript, Initializes DB, & Starts local server
>
> ```
> npm run start
> ```
> 
> ### Run your tests
> 
> ```
> npm run test
> ```
> 
> ### Lints and fixes files
> 
> ```
> npm run lint
> ```

## Endpoints 
>and example post body

Report: (GET Only)

```
/api/report/:user_id/:hist     //hist = true or false
```
```
Returns a json output showing all current ID's needed to navigate API
```
Measure: (GET Only)

```
/api/measure/:room_id/:hist    //hist = true or false
```
```
Returns a Json file showing all measurements from all controllers within a room
```
User:

```
/api/user
```
```
{
    "user_email": "test@test.com",
    "user_pass": "password",
    "user_company_name": "Company"
}
```

Location:

```
/api/location/:user_id
```
```
{
    "location_title": "mycoLab"
}
```

Room:

```
/api/room/:location_id
```
```
{
    "room_title": "incubation"
}
```

Controller:

```
/api/controller/:room_id
```
```
{
    "controller_id": "1",
    "controller_serial": "1234qwer5678",
    "controller_make": "espressif",
    "controller_model": "esp32-wroom-32u",
    "controller_ip": "123.456.678"
}
```

Probe:

```
/api/probe/:controller_id
```
```
{
    "probe_id": "1",
    "probe_make": "makeofprobe",
    "probe_model": "probemodel",
    "probe_type": "therm"
}
```

ProbeCo2:

```
/api/probesCo2/:probe_id/:hist     //hist = true or false
```
```
{
    "probe_co2_measure": "128"
}
```

ProbeHum:

```
/api/probesHum/:probe_id/:hist     //hist = true or false
```
```
{
    "probe_hum_measure": "130"
}
```

ProbePpm:

```
/api/probesPpm/:probe_id/:hist     //hist = true or false
```
```
{
    "probe_ppm_measure": "320"
}
```

ProbeTherm:

```
/api/probesTherm/:probe_id/:hist     //hist = true or false
```
```
{
    "probe_therm_measure": "70"
}
```
