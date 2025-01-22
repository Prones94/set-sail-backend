const express = require('express');
const {
  createCrewHandler,
  addCrewMemberHandler,
  getCrewMembersHandler,
  getAllCrewsHandler,
  removeCrewMemberHandler,
  removeSpecificMemberHandler,
  createInvitationHandler,
  acceptInvitationHandler,
  rejectInvitationHandler
} = require('../controllers/crewController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const { validateCreateCrew, validateInvitation } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Route to create a crew
router.post('/crews', authenticateToken, authorizeRole(['captain', 'admin']), validateCreateCrew, createCrewHandler);

// Join a crew
router.post('/crews/:crewId/join', authenticateToken, addCrewMemberHandler);

// Get members of a crew
router.get('/crews/:crewId/members', authenticateToken, getCrewMembersHandler);

// Get all crews
router.get('/crews', authenticateToken, authorizeRole(['admin']), getAllCrewsHandler);

// Leave a crew
router.delete('/crews/:crewId/leave', authenticateToken, removeCrewMemberHandler);

// Remove a member from a crew
router.delete('/crews/:crewId/members/:memberId/remove', authenticateToken, authorizeRole(['captain', 'admin']), removeSpecificMemberHandler);

// Send an invitation
router.post('/crews/:crewId/invite', authenticateToken, authorizeRole(['captain', 'admin']), validateInvitation, createInvitationHandler);

// Accept an invitation
router.post('/invitations/:invitationId/accept', authenticateToken, acceptInvitationHandler);

// Reject an invitation
router.post('/invitations/:invitationId/reject', authenticateToken, rejectInvitationHandler);

module.exports = router;
