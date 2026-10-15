const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/customers — Get all customers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT customer_id, customer_name, email, phone, created_at
       FROM customers
       ORDER BY customer_id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// POST /api/customers — Add a customer
router.post('/', async (req, res) => {
  try {
    const { customer_name, email, phone } = req.body;

    if (!customer_name?.trim() || !email?.trim()) {
      return res.status(400).json({
        error: 'Customer name and email are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO customers (customer_name, email, phone)
       VALUES ($1, $2, $3)
       RETURNING customer_id, customer_name, email, phone, created_at`,
      [customer_name.trim(), email.trim().toLowerCase(), phone?.trim() || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'A customer with this email already exists'
      });
    }

    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

module.exports = router;