const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tickets ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

router.post('/', async (req, res) => {
  const { customer_name, email, subject, description, priority } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO tickets (customer_name, email, subject, description, priority, status) 
       VALUES ($1, $2, $3, $4, $5, 'Open') RETURNING *`,
      [customer_name, email, subject, description, priority]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE tickets SET status = $1 WHERE ticket_id = $2 RETURNING *',
      [status, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Ticket not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

router.get('/:id/responses', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM ticket_responses WHERE ticket_id = $1 ORDER BY created_at ASC',
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

router.post('/:id/responses', async (req, res) => {
  const { id } = req.params;
  const { responder_name, responder_type, response_text } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO ticket_responses (ticket_id, responder_name, responder_type, response_text) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, responder_name, responder_type, response_text]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add response' });
  }
});

module.exports = router;
