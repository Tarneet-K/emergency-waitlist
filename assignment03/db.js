// db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',          
  port: 5432,                 
  database: 'emergency_waitlist',  
  user: 'postgres',           
  password: 'Tarneet@123'   
});

module.exports = pool;
