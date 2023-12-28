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

**myco-tex-sensors** This project holds scripts to effectively recieve and send temps, humitity, co2 and other enviromental variables using python.

## Project setup

```
npm install
```

### Compiles typescript & starts local server

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
