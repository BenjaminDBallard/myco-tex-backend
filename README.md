<hr/>

# MycoTex backend

## Summary

This project is the core server-side code for
[Myco-tex](url tbd).
This website provides:

- Static React pages for main site
- Node.js application server
- REST endpoints for the main web site

Current work is focused on establishing a monitoring system and database for temps, co2, and other enviromental metrics.

<br/>
<hr/>

## Related Projects/Modules

**myco-tex-backend** (https://github.com/BenjaminDBallard/myco-tex-backend) (This project)

- Serves up REST endpoints for dashboard application using express, node, & mysql2. Authorization and security for the API use JWT and Bcrypt.

**myco-tex-dashboard** (https://github.com/jason-cornish/myco-tex-dashboard)

- This is the main dashboard application used for monitoring facility enviromental status with React & Styled-Components.

**myco-tex-sensors** (https://github.com/BenjaminDBallard/myco-tex-sensors)

- Contains scripts to effectively recieve and send temps, humitity, co2 and other enviromental variables using C++ with the Arduino IDE.

<br/>
<hr/>

## Development

**Main**

- [x] Initialize DB
- [x] Complete core routers & controllers
- [x] Ensure response outputs are formated
- [x] Ensure unique ID's populate
- [x] Establish historical and current parameters for GET requests
- [x] Add JWT and bcrypt to routers and controllers for authorization
- [x] Add new table, routers, and controllers for ESP authorization
- [ ] Set up JWT token refresh

**Quality Assurance**

- [ ] Review error handling. (Some GET request and multi-insert errors slip through the cracks)
- [ ] Test and ensure optional params are actually optional

**Final**

- [ ] DEPLOY to Digital Ocean droplets

<br/>
<hr/>

# Project Setup

> [!TIP]
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

<br/>
<hr/>

# Endpoints

## Report:

| Request |   Endpoint    | Description                                                           |
| ------: | :-----------: | :-------------------------------------------------------------------- |
|     GET | `/api/report` | Returns a json output showing all current ID's needed to navigate API |

<br/>
<hr/>

## Measure:

> :/hist = (true or false) determines whether you recieve the single current value or all historical values

| Request |           Endpoint            | Description                                                                     |
| ------: | :---------------------------: | :------------------------------------------------------------------------------ |
|     GET | `/api/measure/:room_id/:hist` | Returns a Json file showing all measurements from all controllers within a room |

<br/>
<hr/>

## User:

**Endpoints**

| Request |      Endpoint       |                     Parameters                     | Description                                                                                                                                                         |
| ------: | :-----------------: | :------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|    POST | `/api/user/signup`  | user_email <br/> user_pass <br/> user_company_name | Signs user up and populates a location and standard rooms                                                                                                           |
|    POST |  `/api/user/login`  |             user_email <br/> user_pass             | Verifies user and returns JWT token and refresh token. the token for the client is stored in the res.headers and the refresh token is stored in an httpOnly cookie. |
|    POST | `/api/user/refresh` |                        N/A                         | verifies that user has a refresh token, and if valid, returns a new token for the client in res.headers                                                             |
|     PUT | `/api/user/update`  | user_email <br/> user_pass <br/> user_company_name | Update user email, pass, and/or company name                                                                                                                        |

<br/>

**Parameter Info**

|              Name | Required |       Type        | Description              |
| ----------------: | :------: | :---------------: | :----------------------- |
|        user_email |   yes    |      string       | The email of the user    |
|         user_pass |   yes    |      string       | The password of the user |
| user_company_name | optional | string <br/> null | The company of the user  |

<br/>

**Example Request Body**

```
{
    "user_email": "test@test.com",
    "user_pass": "password",
    "user_company_name": "Company"
}
```

<br/>
<hr/>

## Location:

**Endpoints**

| Request |              Endpoint               |   Parameters   | Description              |
| ------: | :---------------------------------: | :------------: | :----------------------- |
|    POST |         `/api/location/new`         | location_title | Add new location to user |
|     PUT | `/api/location/update/:location_id` | location_title | Update location title    |

<br/>

**Parameter Info**

|           Name | Required |       Type        | Description              |
| -------------: | :------: | :---------------: | :----------------------- |
| location_title | optional | string <br/> null | Prefered name of the lab |

<br/>

**Example Request Body**

```
{
    "location_title": "Incubation",
}
```

<br/>
<hr/>

## Room:

**Endpoints**

| Request |           Endpoint           | Parameters | Description              |
| ------: | :--------------------------: | :--------: | :----------------------- |
|    POST | `/api/room/new/:location_id` | room_title | Add new room to location |
|     PUT | `/api/room/update/:room_id`  | room_title | Update room title        |

<br/>

**Parameter Info**

|       Name | Required |       Type        | Description               |
| ---------: | :------: | :---------------: | :------------------------ |
| room_title | optional | string <br/> null | Prefered name of the room |

<br/>

**Example Request Body**

```
{
    "room_title": "North Wall",
}
```

<br/>
<hr/>

## Device:

**Endpoints**

| Request |              Endpoint               |                                                                                          Parameters                                                                                           | Description                                                               |
| ------: | :---------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------ |
|    POST |     `/api/device/new/:room_id`      | controller_id <br/> device_pass <br/> controller_name <br/> controller_serial <br/> controller_make <br/> controller_model <br/> probe_id <br/> probe_make <br/> probe_model <br/> probe_type | Adds new device (multi-inserts into controller, probe, and device tables) |
|     PUT | `/api/device/update/:controller_id` |                                                                                 room_id <br/> controller_name                                                                                 | Update device name and/or move device to different room                   |

<br/>

**Parameter Info**

|              Name | Required |  Type  | Description                                                          |
| ----------------: | :------: | :----: | :------------------------------------------------------------------- |
|     controller_id |   yes    | string | ID of the device (supplied with controller on delivery)              |
|       device_pass |   yes    | string | Password of the device (supplied with controller)                    |
|   controller_name | optional | string | Prefered name of device                                              |
| controller_serial | optional | string | Serial number of the ESP32                                           |
|   controller_make | optional | string | Make of ESP32 (Arduino, Esspressif, ect)                             |
|  controller_model | optional | string | Model of ESP32 (devkit esp32-wroom-32u)                              |
|          probe_id |   yes    | string | ID of probe/reader/thermostat (supplied with controller on delivery) |
|        probe_make | optional | string | Make/Brand of probe/reader/thermostat (BOJACK, Weewooday, ect)       |
|       probe_model | optional | string | Model of ESP32 (DS18B20, DHT11, DHT22, ect)                          |
|        probe_type | optional | string | Type of probe (therm, co2, ppm, hum)                                 |

<br/>

**Example Request Body**

```
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

<br/>
<hr/>

## Measurements:

> :/hist = (true or false) determines whether you recieve the single current value or all historical values

**Endpoints**

| Request |          Endpoint           |                       Parameters                        | Description                                  |
| ------: | :-------------------------: | :-----------------------------------------------------: | :------------------------------------------- |
|     GET | `/api/co2/:probe_id/:hist`  |                           N/A                           | Get historical or current device measurement |
|     GET | `/api/hum/:probe_id/:hist`  |                           N/A                           | Get historical or current device measurement |
|     GET | `/api/ppm/:probe_id/:hist`  |                           N/A                           | Get historical or current device measurement |
|     GET | `/api/temp/:probe_id/:hist` |                           N/A                           | Get historical or current device measurement |
|    POST |  `/api/co2/new/:probe_id`   | controller_id <br/> device_pass <br/> probe_co2_measure | Post new co2 measurement                     |
|    POST |  `/api/hum/new/:probe_id`   | controller_id <br/> device_pass <br/> probe_co2_measure | Post new humidity measurement                |
|    POST |  `/api/ppm/new/:probe_id`   | controller_id <br/> device_pass <br/> probe_co2_measure | Post new ppm measurement                     |
|    POST |  `/api/temp/new/:probe_id`  | controller_id <br/> device_pass <br/> probe_co2_measure | Post new temperature measurement             |

<br/>

**Parameter Info**

|               Name | Required |  Type  | Description                                             |
| -----------------: | :------: | :----: | :------------------------------------------------------ |
|      controller_id |   yes    | string | ID of the device (supplied with controller on delivery) |
|        device_pass |   yes    | string | Password of the device (supplied with controller)       |
|  probe_co2_measure |   yes    |  int   | Current measurement of co2 probe                        |
|  probe_hum_measure |   yes    |  int   | Current measurement of humidity probe                   |
|  probe_ppm_measure |   yes    |  int   | Current measurement of ppm probe                        |
| probe_temp_measure |   yes    |  int   | Current measurement of temperature probe                |

<br/>

**Example Request Body**

```
{
    "controller_id": "12345",
    "device_pass": "password123",
    "probe_co2_measure": 146
}
```
