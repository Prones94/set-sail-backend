const { createCrew, findCrewById } = require('../models/crewModel')

const createCrewHandler = async (req,res) => {
  const { crewName, description } = req.body

  try {
    const newCrew = await createCrew(crewName, description)
    res.status(201).json(newCrew)
  } catch(err){
    res.status(500).json({ error: err.message })
  }
}

module.exports = { createCrewHandler }