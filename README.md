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
>POST /api/user
>GET & PUT /api/user/:user_id
```
```
>POST & PUT req body:
{
    "user_email": "test@test.com",
    "user_pass": "password",
    "user_company_name": "Company"
}
```

Location:

```
>GET & POST /api/location/:user_id
>PUT /api/location/:location_id
```
```
>POST & PUT req body
{
    "location_title": "mycoLab"
}
```

Room:

```
>GET & POST /api/room/:location_id
>PUT /api/room/:room_id
```
```
>POST & PUT req body
{
    "room_title": "incubation"
}
```

Controller:

```
>GET & POST /api/controller/:room_id
>PUT /api/controller/:controller_id
```
```
>POST req body
{
    "controller_id": "1",
    "controller_serial": "1234qwer5678",
    "controller_make": "espressif",
    "controller_model": "esp32-wroom-32u"
}

>PUT req body
{
    "room_id": "d3j0b6or6lrmshr0j",
    "controller_serial": "1234qwer56784@",
    "controller_make": "espressif4@",
    "controller_model": "esp32-wroom-324u@"
}
```

Probe:

```
>GET & POST /api/probe/:controller_id
>PUT /api/probe/:probe_id
```
```
>POST req body
{
    "probe_id": "1",
    "probe_make": "makeofprobe",
    "probe_model": "probemodel",
    "probe_type": "therm"
}

>PUT req body
{
    "controller_id": "d3j0b6a90lrk32laj3",
    "probe_make": "makeofpfobe@@",
    "probe_model": "probemofdel@@",
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
