const { createCrew, findCrewById, addMemberToCrew, getCrewMembers,getAllCrews, removeMemberFromCrew, removeSpecificMemberFromCrew, createInvitation, acceptInvitation, rejectInvitation } = require('../models/crewModel')
const logger = require('../utils/logger')

const validateId = (id) => {
  const parsedId = parseInt(id, 10)
  if(isNaN(parsedId)){
    throw new Error('Invalid ID')
  }
  return parsedId
}

const roleCheckMiddleware = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: User information missing' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied: Insufficient role' });
  }
  next();
};


const createCrewHandler = async (req,res) => {
  const { crewName, description } = req.body

  if (!crewName || !description) {
    return res.status(400).json({ error: 'Crew name and description are required'})
  }

  try {
    const newCrew = await createCrew(crewName, description)
    res.status(201).json(newCrew)
  } catch(err){
    logger.error(`Error creating crew: ${err.message}`)
    res.status(500).json({ error: err.message })
  }
}

const addCrewMemberHandler = async (req,res) => {
  const { crewId } = req.params
  const userId = req.user.id

  try {
    const crewMember = await addMemberToCrew(crewId, userId)
    res.status(201).json(crewMember)
  }catch(err){
    res.status(500).json({ error: err.message })
  }
}

const getCrewMembersHandler = async (req, res) => {
  try {
    const crewId = validateId(req.params.crewId);
    const members = await getCrewMembers(crewId);
    res.status(200).json(members);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


const getAllCrewsHandler = async (req,res) => {
  try {
    const crews = await getAllCrews()
    res.status(200).json(crews)
  } catch(err){
    res.status(500).json({ error: err.message })
  }
}

const removeCrewMemberHandler = async (req, res) => {
  try {
    const crewId = validateId(req.params.crewId);
    const userId = req.user.id;

    const response = await removeMemberFromCrew(crewId, userId);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const removeSpecificMemberHandler = async (req, res) => {
  try {
    const crewId = validateId(req.params.crewId);
    const memberId = validateId(req.params.memberId);

    const userRole = req.user.role;
    if (userRole !== 'captain' && userRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const response = await removeSpecificMemberFromCrew(crewId, memberId);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const createInvitationHandler = async (req, res) => {
  try {
    const crewId = validateId(req.body.crewId);
    const userId = validateId(req.body.userId);

    const invitation = await createInvitation(crewId, userId);
    res.status(201).json(invitation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


const acceptInvitationHandler = async (req, res) => {
  try {
    const invitationId = validateId(req.params.invitationId);

    const updatedInvitation = await acceptInvitation(invitationId);
    res.status(200).json(updatedInvitation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const rejectInvitationHandler = async (req,res) => {
  const { invitationId } = req.params

  try {
    const updatedInvitation = await rejectInvitation(invitationId)
    res.status(200).json(updatedInvitation)
  } catch(err){
    res.status(500).json({ error: err.message })
  }
}

module.exports = { createCrewHandler, addCrewMemberHandler, getCrewMembersHandler, getAllCrewsHandler, removeCrewMemberHandler , removeSpecificMemberHandler, createInvitationHandler, acceptInvitationHandler, rejectInvitationHandler }