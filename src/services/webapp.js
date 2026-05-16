const http = require('http');
const cors = require('cors');
const express = require('express');

const HttpException = require('../utils/HttpException.utils');
const errorMiddleware = require('../middleware/error.middleware');
const routes = require('../routes/routes');
var bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express')
//const swaggerFile = require('../swagger-output.json')

const app = express();

// enabling cors for all requests by using cors middleware
const whitelist = ['https://udec-etes-app-six.vercel.app', 'http://localhost:3007'];

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

let httpServer;

function initialize(puerto) {
    return new Promise((resolve, reject) => {
        const port = Number(process.env.PORT || 3331);

        httpServer = app.listen(port, () =>{
            console.log("Server is running!\nAPI documentation: http://localhost:3000/doc")
            console.log(`🚀 Server ejecutándose en puerto ${port}!`)
            resolve();
        });
        httpServer.setTimeout(10800000);
    });
}

module.exports.initialize = initialize;
module.exports.app = app;

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