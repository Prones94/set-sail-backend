const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
})

// Create new crew
const createCrew = async (crewName, description) => {
  try {
    const res = await pool.query(
      'INSERT INTO crew (name, description) VALUES ($1,$2) RETURNING *',
      [crewName, description]
    )
    return res.rows[0]
  } catch(err){
    throw new Error('Error creating crew: ' + err.message)
  }
}

// Find crew by ID
const findCrewById = async (crewId) => {
  try {
    const res = await pool.query('SELECT * FROM crews WHERE id = $1,', [crewId])
    return res.rows[0]
  } catch(err) {
    throw new Error('Error finding crew:' + err.message)
  }
}

module.exports = { createCrew, findCrewById }