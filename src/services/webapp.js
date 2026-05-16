const http = require('http');
const cors = require('cors');
const express = require('express');

const HttpException = require('../utils/HttpException.utils');
const errorMiddleware = require('../middleware/error.middleware');
const routes = require('../routes/routes');
var bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express')
//const swaggerFile = require('../swagger-output.json')

let httpServer;

function initialize(puerto) {
    return new Promise((resolve, reject) => {

        const app = express();
        
        // enabling cors for all requests by using cors middleware
        const whitelist = ['https://etes-app-dev.herokuapp.com', 'https://etes-app-prod.herokuapp.com', 'http://localhost:3001', 'http://localhost:3000', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005'];
        
        // Enable pre-flight
        // app.options("*", cors());
        const corsOptions = {
            origin: whitelist
        };
        
        app.use(cors(corsOptions));
        
        app.use(bodyParser.urlencoded({
            limit: "50mb",
            extended: false
          }));
        app.use(bodyParser.json({limit: "50mb"}));
        
        app.use(express.json({ reviver: reviveJson }));

        const port = Number(process.env.PORT || 3331);

        // Documentación swagger de la API
       // app.use('/api/v1/api-docs', routes.swaggerDocV1);

        // el resto de las rutas
        app.use('/api/v1', routes.v1);

        // Documentacion swagger
        //app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
        // 404 error
        // app.all('*', (req, res, next) => {
        //     next(err);
        // });

        // Error middleware
        app.use(errorMiddleware);

        httpServer = app.listen(port, () =>{
            console.log("Server is running!\nAPI documentation: http://localhost:3000/doc")
            console.log(`🚀 Server ejecutándose en puerto ${port}!`)
        
        });
        httpServer.setTimeout(10800000);

    });
}

module.exports.initialize = initialize;

function close() {
    return new Promise((resolve, reject) => {
        httpServer.close((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

module.exports.close = close;

const iso8601RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

function reviveJson(key, value) {
    // revive ISO 8601 date strings to instances of Date
    if (typeof value === 'string' && iso8601RegExp.test(value)) {
        return new Date(value);
    } else {
        return value;
    }
}