const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all events
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY event_date');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create event
router.post('/', async (req, res) => {
  try {
    const { event_name, event_type, event_date, event_time, location, description } = req.body;
    
    const result = await pool.query(
      `INSERT INTO events (event_name, event_type, event_date, event_time, location, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [event_name, event_type, event_date, event_time, location, description]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
