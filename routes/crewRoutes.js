const express = require('express')
const { createCrewHandler } = require('../controllers/crewController')
const authenticateToken = require('../middlewares/authMiddleware')

const router = express.Router()

// Route to create a crew (requires auth)
router.post('/create', authenticateToken, createCrewHandler)

module.exports = router