const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { createUser, findUserByEmail } = require('../models/userModel')
require('dotenv').config()

// Register a new user
const registerUser = async (req,res) => {
  const { username, email, password, role='member' } = req.body

  try {

    if (!['captain', 'admin'].includes(role)){
      return res.status(403).json({ error: 'You cannot assign this role during registration'})
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const newUser = await createUser(username, passwordHash, email, role)
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '1h' }
    )
    res.status(201).json({ token })
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
      return res.status(404).json({ error: 'User not found' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword){
      return res.status(401).jsoon({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
    res.status(200).json({ token })
  } catch(err){
    res.status(500).json({ error: err.message })
  }
}

module.exports = { registerUser, loginUser }