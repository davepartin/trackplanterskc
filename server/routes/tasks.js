const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all tasks by stage
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pt.*, ps.stage_name, ps.stage_order
       FROM process_tasks pt
       JOIN pace_stages ps ON pt.stage_id = ps.id
       ORDER BY ps.stage_order, pt.task_order`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get tasks by stage
router.get('/stage/:stageName', async (req, res) => {
  try {
    const { stageName } = req.params;
    const result = await pool.query(
      `SELECT pt.*
       FROM process_tasks pt
       JOIN pace_stages ps ON pt.stage_id = ps.id
       WHERE ps.stage_name = $1
       ORDER BY pt.task_order`,
      [stageName]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const { stage_name, task_name, task_description, task_order, category } = req.body;
    
    const stageResult = await pool.query('SELECT id FROM pace_stages WHERE stage_name = $1', [stage_name]);
    
    if (stageResult.rows.length === 0) {
      return res.status(404).json({ error: 'Stage not found' });
    }
    
    const stage_id = stageResult.rows[0].id;
    
    const result = await pool.query(
      `INSERT INTO process_tasks (stage_id, task_name, task_description, task_order, category)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [stage_id, task_name, task_description, task_order, category]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { task_name, task_description, task_order, category } = req.body;
    
    const result = await pool.query(
      `UPDATE process_tasks 
       SET task_name = $1, task_description = $2, task_order = $3, category = $4
       WHERE id = $5
       RETURNING *`,
      [task_name, task_description, task_order, category, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM process_tasks WHERE id = $1', [id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
