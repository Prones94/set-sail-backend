const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { createUser, findUserByEmail } = require('../models/userModel')
require('dotenv').config()

// Register a new user
const registerUser = async (req,res) => {
  const { username, email, password } = req.body

  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.has(password, saltRounds)
    const newUser = await createUser(username, passwordHash, email)
    res.status(201).json(newUser)
  } catch(err){
    res.status(500).json({ error: err.message })
  }
}

// User login
const loginUser = async (req,res) => {
  const { email, password } = req.body

  try {
    const user = await findUserByEmail(email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword){
      return res.status(401).jsoon({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
    res.status(200).json({ token })
  } catch(err){
    res.status(500).json({ error: err.message })
  }
}

module.exports = { registerUser, loginUser }