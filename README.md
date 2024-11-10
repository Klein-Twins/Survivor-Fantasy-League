## Generating API Client Library
### Pre-requisites
1. This application uses a script that pulls the _swagger-codegen-cli-v3_ image from [Docker](https://www.docker.com/products/docker-desktop/)
```
npm run generate-client
```

## Installing Dependencies
Before running the application, you must install all the necessary dependencies.  You can do so by entering the following command:
```
npm run install-dependencies
```

## Starting Dev Server
Both the front end and back end can be ran simulaneous thanks to [Concurrently](https://www.npmjs.com/package/concurrently). <br>
To run both the **front end and the backend**, enter the following command:
```
npm run dev
```
To run just the **frontend**, enter the following command:
```
npm run frontend
```
To run just the **backend**, enter the following command:
```
npm run backend
```