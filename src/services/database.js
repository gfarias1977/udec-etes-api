const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  requestTimeout: 60000,
  options: {
    encrypt: Boolean( process.env.DB_ENCRYPT ),
    trustedConnection: true,
    enableArithAbort: true,
    requestTimeout: 60000,
    idleTimeoutMillis: 60000,
  },
  parseJSON: true,
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Conectado a MSSQL')
    return pool
  })
  .catch(err => console.log('Conexión a la BD ha fallado! Configuración incorrecta: ', err));

module.exports = {
  sql, poolPromise
};