const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all planters
router.get('/', async (req, res) => {
  try {
    const { stage, status, rep } = req.query;
    let query = 'SELECT * FROM planters WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (stage) {
      query += ` AND current_stage = $${paramCount}`;
      params.push(stage);
      paramCount++;
    }
    if (status) {
      query += ` AND current_status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
    if (rep) {
      query += ` AND field_staff_rep = $${paramCount}`;
      params.push(rep);
      paramCount++;
    }

    query += ' ORDER BY last_name, first_name';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single planter
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM planters WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Planter not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new planter
router.post('/', async (req, res) => {
  try {
    const {
      first_name, last_name, phone, email, field_staff_rep,
      church_name, sending_church, current_stage, current_status,
      spouse_first_name, spouse_last_name, monthly_funding
    } = req.body;

    const result = await pool.query(
      `INSERT INTO planters 
       (first_name, last_name, phone, email, field_staff_rep, church_name, 
        sending_church, current_stage, current_status, spouse_first_name, 
        spouse_last_name, monthly_funding)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [first_name, last_name, phone, email, field_staff_rep, church_name,
       sending_church, current_stage || 'PREPARE', current_status || 'Potential',
       spouse_first_name, spouse_last_name, monthly_funding || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update planter
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    
    const setClause = Object.keys(fields)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = Object.values(fields);
    
    const result = await pool.query(
      `UPDATE planters SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Planter not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete planter
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM planters WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Planter not found' });
    }
    
    res.json({ message: 'Planter deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get planter tasks
router.get('/:id/tasks', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT pt.*, ptp.is_completed, ptp.completed_date, ptp.notes as progress_notes, ps.stage_name
       FROM process_tasks pt
       LEFT JOIN planter_task_progress ptp ON pt.id = ptp.task_id AND ptp.planter_id = $1
       LEFT JOIN pace_stages ps ON pt.stage_id = ps.id
       ORDER BY ps.stage_order, pt.task_order`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task progress
router.post('/:planterId/tasks/:taskId', async (req, res) => {
  try {
    const { planterId, taskId } = req.params;
    const { is_completed, notes } = req.body;
    
    const result = await pool.query(
      `INSERT INTO planter_task_progress (planter_id, task_id, is_completed, completed_date, notes)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (planter_id, task_id) 
       DO UPDATE SET is_completed = $3, completed_date = $4, notes = $5, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [planterId, taskId, is_completed, is_completed ? new Date() : null, notes]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
