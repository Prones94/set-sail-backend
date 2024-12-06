const express = require('express');
const {
  createCrewHandler,
  addCrewMemberHandler,
  getCrewMembersHandler,
  getAllCrewsHandler,
  removeCrewMemberHandler
} = require('../controllers/crewController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to create a crew (requires captain or admin role)
router.post('/create', authenticateToken, authorizeRole(['captain', 'admin']), createCrewHandler);

// Adds the authenticated user to the specified crew, identified by crewId.
// Requires a valid JWT token in the Authorization header to identify and authenticate the user.
router.post('/:crewId/join', authenticateToken, addCrewMemberHandler);

// Retrieves a list of all members in the specified crew, identified by crewId.
// Requires a valid JWT token in the Authorization header to ensure the requester is authenticated.
router.get('/:crewId/members', authenticateToken, getCrewMembersHandler);

// Route to get all crews (requires admin role)
router.get('/', authenticateToken, authorizeRole(['admin']), getAllCrewsHandler);

// Allow a user to leave a crew they are part of
router.delete('/:crewId/leave', authenticateToken, removeCrewMemberHandler);

module.exports = router;
