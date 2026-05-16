"use strict";

const assert = require( 'assert' );
const dotenv = require( 'dotenv' );

// read in the .env file
dotenv.config();

const NODE_ENV    = process.env.NODE_ENV    || dotenv.config().NODE_ENV;
const PORT        = process.env.PORT        || dotenv.config().PORT; 
const DB_USER     = process.env.DB_USER     || dotenv.config().DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD || dotenv.config().DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE || dotenv.config().DB_DATABASE;
const DB_SERVER   = process.env.DB_SERVER   || dotenv.config().DB_SERVER;
const DB_ENCRYPT  = process.env.DB_ENCRYPT  || dotenv.config().DB_ENCRYPT;

// validate the required configuration information
assert( NODE_ENV,    "Configuración de parámetro NODE_ENV es requerido." );
assert( PORT,        "Configuración de parámetro PORT es requerido." );
assert( DB_USER,     "Configuración de parámetro DB_USER es requerido." );
assert( DB_PASSWORD, "Configuración de parámetro DB_PASSWORD es requerido." );
assert( DB_DATABASE, "Configuración de parámetro DB_DATABASE es requerido." );
assert( DB_SERVER,   "Configuración de parámetro DB_SERVER es requerido." );
assert( DB_ENCRYPT,  "Configuración de parámetro DB_ENCRYPT es requerido." );

// export the configuration information
module.exports = {
   port: PORT,
   DB_SERVER
};