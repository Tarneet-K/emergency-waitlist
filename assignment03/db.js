// db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',          // keep this
  port: 5432,                 // default PostgreSQL port
  database: 'emergency_waitlist',  // MUST match your database name
  user: 'postgres',           // CHANGE THIS to your postgres username
  password: 'Tarneet@123'   // CHANGE THIS to your postgres password
});

module.exports = pool;
