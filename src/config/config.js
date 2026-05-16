"use strict";

const assert = require( 'assert' );
const dotenv = require( 'dotenv' );

// read in the .env file
dotenv.config();

const NODE_ENV     = process.env.NODE_ENV     || dotenv.config().NODE_ENV;
const PORT         = process.env.PORT         || dotenv.config().PORT;
const DATABASE_URL = process.env.DATABASE_URL || dotenv.config().DATABASE_URL;

// validate the required configuration information
assert( NODE_ENV,     "Configuración de parámetro NODE_ENV es requerido." );
assert( PORT,         "Configuración de parámetro PORT es requerido." );
assert( DATABASE_URL, "Configuración de parámetro DATABASE_URL es requerido." );

// export the configuration information
module.exports = {
   port: PORT,
};