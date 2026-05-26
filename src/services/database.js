const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 60000,
  idleTimeoutMillis: 60000,
});

pool.on('connect', (client) => {
  client.query("SET client_encoding TO 'UTF8'");
  console.log('Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.log('Conexión a la BD ha fallado! Configuración incorrecta: ', err);
});

module.exports = { pool };