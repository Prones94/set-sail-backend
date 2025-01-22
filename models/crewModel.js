const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

// Create a new crew
const createCrew = async (crewName, description) => {
  try {
    const res = await pool.query(
      'INSERT INTO crews (name, description) VALUES ($1, $2) RETURNING *',
      [crewName, description]
    );
    return res.rows[0];
  } catch (err) {
    throw new Error(`Error creating crew: ${err.message}`);
  }
};

// Fetch all crews
const getAllCrews = async () => {
  try {
    const res = await pool.query('SELECT * FROM crews');
    return res.rows;
  } catch (err) {
    throw new Error(`Error fetching crews: ${err.message}`);
  }
};

// Find a crew by ID
const findCrewById = async (crewId) => {
  try {
    const res = await pool.query('SELECT * FROM crews WHERE id = $1', [crewId]);
    return res.rows[0];
  } catch (err) {
    throw new Error(`Error finding crew: ${err.message}`);
  }
};

// Add a user to a crew
const addMemberToCrew = async (crewId, userId) => {
  try {
    const res = await pool.query(
      'INSERT INTO crew_members (crew_id, user_id) VALUES ($1, $2) RETURNING *',
      [crewId, userId]
    );
    return res.rows[0];
  } catch (err) {
    throw new Error(`Error adding member to crew: ${err.message}`);
  }
};

// Get all members of a crew
const getCrewMembers = async (crewId) => {
  try {
    const res = await pool.query(
      `SELECT users.id, users.username, users.email
       FROM crew_members
       JOIN users ON crew_members.user_id = users.id
       WHERE crew_members.crew_id = $1`,
      [crewId]
    );
    return res.rows;
  } catch (err) {
    throw new Error(`Error fetching crew members: ${err.message}`);
  }
};

// Remove a user from a crew
const removeMemberFromCrew = async (crewId, userId) => {
  try {
    const res = await pool.query(
      'DELETE FROM crew_members WHERE crew_id = $1 AND user_id = $2',
      [crewId, userId]
    );
    if (res.rowCount === 0) {
      throw new Error('User is not part of the crew or crew does not exist');
    }
    return { message: 'Member removed from crew' };
  } catch (err) {
    throw new Error(`Error removing member from crew: ${err.message}`);
  }
};

// Remove a specific member from a crew
const removeSpecificMemberFromCrew = async (crewId, memberId) => {
  try {
    const res = await pool.query(
      'DELETE FROM crew_members WHERE crew_id = $1 AND user_id = $2',
      [crewId, memberId]
    );
    if (res.rowCount === 0) {
      throw new Error('User is not part of the crew or crew does not exist');
    }
    return { message: 'Member removed from crew' };
  } catch (err) {
    throw new Error(`Error removing specific member from crew: ${err.message}`);
  }
};

// Create an invitation
const createInvitation = async (crewId, userId) => {
  try {
    const res = await pool.query(
      'INSERT INTO invitations (crew_id, user_id) VALUES ($1, $2) RETURNING *',
      [crewId, userId]
    );
    return res.rows[0];
  } catch (err) {
    throw new Error(`Error creating invitation: ${err.message}`);
  }
};

// Accept an invitation
const acceptInvitation = async (invitationId) => {
  try {
    const res = await pool.query(
      'UPDATE invitations SET status = $1 WHERE id = $2 RETURNING *',
      ['accepted', invitationId]
    );
    return res.rows[0];
  } catch (err) {
    throw new Error(`Error accepting invitation: ${err.message}`);
  }
};

// Reject an invitation
const rejectInvitation = async (invitationId) => {
  try {
    const res = await pool.query(
      'UPDATE invitations SET status = $1 WHERE id = $2 RETURNING *',
      ['rejected', invitationId]
    );
    return res.rows[0];
  } catch (err) {
    throw new Error(`Error rejecting invitation: ${err.message}`);
  }
};

module.exports = {
  createCrew,
  findCrewById,
  addMemberToCrew,
  getCrewMembers,
  getAllCrews,
  removeMemberFromCrew,
  removeSpecificMemberFromCrew,
  createInvitation,
  acceptInvitation,
  rejectInvitation,
};
