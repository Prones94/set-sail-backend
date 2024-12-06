require('dotenv').config()
const express = require('express')
const authRoutes = require('./routes/authRoutes')
const crewRoutes = require('./routes/crewRoutes')
const errorHandler = require('./middlewares/errorHandler')
const app = express()
const { Pool } = require('pg')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 5002

// Middleware to parse JSON
app.use(express.json())

//Add error handling middleware at the end
app.use(errorHandler)

// Register Routes
app.use('/api/auth', authRoutes)

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
})

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))


// Registering routes
app.use('/api/auth', authRoutes)
app.use('/api/crew', crewRoutes)

// Simple route to test PostgreSQL connection
app.get('/', async (req,res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.send(`Postgres Connected: ${result.rows[0].now}`)
  } catch (err){
    res.status(500).send('Database connection failed')
  }
})

// Start Express server
app.listen(PORT, () => {
  console.log(`Backend service running on port ${PORT}`)
})