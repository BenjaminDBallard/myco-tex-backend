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
> access_token=your access token
> ```
>
> Your testing requests will require a header with a key of "x-access token" and the token value returned from the post user endpoint
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

Report:

```
>GET /api/report //Returns a json output showing all current ID's needed to navigate API
```

Measure: //hist = true or false

```
>GET /api/measure/:room_id/:hist    //Returns a Json file showing all measurements from all controllers within a room
```

User:

```
>POST /api/user/signup    //Signs user up and populates a location and standard rooms
>POST /api/user/login     //Verifies user and returns JWT
>PUT /api/user/update     //Update user email, pass, and/or company name
```

```
>POST & PUT req body:
{
    "user_email": "test@test.com",
    "user_pass": "password",
    "user_company_name": "Company"
}

>POST req body:
{
    "user_email": "test@test.com",
    "user_pass": "password"
}
```

Location:

```
>POST /api/location/new                   //Add new location to user
>PUT /api/location/update/:location_id    //Update location title
```

```
>POST & PUT req body
{
    "location_title": "mycoLab"
}
```

Room:

```
>POST /api/room/new/:location_id    //Add new room to location
>PUT /api/room/update/:room_id         //Update room title
```

```
>POST & PUT req body
{
    "room_title": "incubation"
}
```

Device:

```
>POST /api/device/new/:room_id    //Adds new device (controller, probe, and deviceAuth)
```

```
>POST req body
{
    "controller_id": "12345990011",
    "device_pass": "password123",
    "controller_name": "northwall",
    "controller_serial": "1234qwer5678",
    "controller_make": "espressif",
    "controller_model": "esp32-wroom-32u",
    "probe_id": "1122334455",
    "probe_make": "makeofprobe",
    "probe_model": "probemodel",
    "probe_type": "therm"
}
```

```
>PUT /api/device/update/:controller_id    //Update device name and/or move device to different room
```

```
>PUT req body
{
    "room_id": "d3j0b6or6lrmshr0j",
    "controller_name": "northwall"
}
```

Co2: //hist = true or false

```
>GET /api/co2/:probe_id/:hist     //Get historical or current device measurement
>GET /api/co2/new/:probe_id       //Post new device measurement
```

```
{
    "controller_id": "12345",
    "device_pass": "password123",
    "probe_co2_measure": "146"
}
```

Humidity: //hist = true or false

```
/api/hum/:probe_id/:hist     //Get historical or current device measurement
/api/hum/new/:probe_id       //Post new device measurement
```

```
{
    "controller_id": "12345",
    "device_pass": "password123",
    "probe_hum_measure": "130"
}
```

PartsPerMillion: //hist = true or false

```
/api/ppm/:probe_id/:hist     //Get historical or current device measurement
/api/ppm/new/:probe_id       //Post new device measurement
```

```
{
    "controller_id": "12345",
    "device_pass": "password123",
    "probe_ppm_measure": "320"
}
```

Temperature: //hist = true or false

```
/api/temp/:probe_id/:hist     //Get historical or current device measurement
/api/temp/new/:probe_id       //Post new device measurement
```

```
{
    "controller_id": "12345",
    "device_pass": "password123",
    "probe_therm_measure": "70"
}
```
