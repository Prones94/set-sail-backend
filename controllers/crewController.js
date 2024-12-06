const { createCrew, findCrewById, addMemberToCrew, getCrewMembers,getAllCrews, removeMemberFromCrew } = require('../models/crewModel')

const createCrewHandler = async (req,res) => {
  const { crewName, description } = req.body

  try {
    const newCrew = await createCrew(crewName, description)
    res.status(201).json(newCrew)
  } catch(err){
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

const getCrewMembersHandler = async (req,res) => {
  const crewId = parseInt(req.params.crewId, 10)

  if (isNaN(crewId)) {
    return res.status(400).json({ error: 'Invalid crew ID'})
  }

  try {
    const members = await getCrewMembers(crewId)
    res.status(200).json(members)
  }catch(err){
    res.status(500).json({ error: err.message })
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

const removeCrewMemberHandler = async (req,res) => {
  const { crewId } = req.params
  const userId = req.user.id

  try {
    const response = await removeMemberFromCrew(crewId, userId)
    res.status(200).json(response)
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { createCrewHandler, addCrewMemberHandler, getCrewMembersHandler, getAllCrewsHandler, removeCrewMemberHandler }