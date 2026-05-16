const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 60000,
  idleTimeoutMillis: 60000,
});

pool.on('connect', () => {
  console.log('Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.log('Conexión a la BD ha fallado! Configuración incorrecta: ', err);
});

module.exports = { pool };