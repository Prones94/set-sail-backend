const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

// Create a new user
const createUser = async (username, passwordHash, email, role = 'member') => {
  try {
    const res = await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, passwordHash, email, role]
    );
    return res.rows[0];
  } catch (err) {
    throw new Error(`Error creating user: ${err.message}`);
  }
};

// Find a user by email
const findUserByEmail = async (email) => {
  try {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
  } catch (err) {
    throw new Error(`Error finding user: ${err.message}`);
  }
};

module.exports = { createUser, findUserByEmail };
