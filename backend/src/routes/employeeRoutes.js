const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/employees — Get all employees
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT employee_id, employee_name, email, role, created_at
       FROM employees
       ORDER BY employee_id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// POST /api/employees — Add an employee
router.post('/', async (req, res) => {
  try {
    const { employee_name, email, role } = req.body;

    if (!employee_name?.trim() || !email?.trim()) {
      return res.status(400).json({
        error: 'Employee name and email are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO employees (employee_name, email, role)
       VALUES ($1, $2, $3)
       RETURNING employee_id, employee_name, email, role, created_at`,
      [
        employee_name.trim(),
        email.trim().toLowerCase(),
        role?.trim() || 'Support Agent'
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'An employee with this email already exists'
      });
    }

    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

module.exports = router;
