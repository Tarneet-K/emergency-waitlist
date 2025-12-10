// server.js
const express = require('express');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// ===== API ROUTES =====

// Get priorities (for admin drop-down etc.)
app.get('/api/priorities', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM priorities ORDER BY priority_id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching priorities', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooms ORDER BY room_id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching rooms', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new patient triage entry (from Patient page)
app.post('/api/patients', async (req, res) => {
  try {
    const {
      card_number,
      full_name,
      gender,
      date_of_birth,
      injury_type,
      pain_level
    } = req.body;

    const query = `
      INSERT INTO patients
        (card_number, full_name, gender, date_of_birth, injury_type, pain_level)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      card_number || null,
      full_name,
      gender || null,
      date_of_birth || null,
      injury_type,
      pain_level
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating patient', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all patients ordered by priority + arrival time
app.get('/api/patients', async (req, res) => {
  try {
    const query = `
      SELECT p.*, pr.label AS priority_label, pr.ui_colour, pr.approximate_time,
             r.room_name
      FROM patients p
      LEFT JOIN priorities pr ON p.priority_id = pr.priority_id
      LEFT JOIN rooms r ON p.room_id = r.room_id
      ORDER BY
        COALESCE(pr.priority_id, 0) DESC,   -- Critical (4) at top, then High, Medium, Low, then unassigned
        p.arrival_time ASC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching patients', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a patient's priority and/or room (used by admin actions)
app.patch('/api/patients/:id', async (req, res) => {
  const patientId = req.params.id;
  const { priority_id, room_id } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE patients
      SET priority_id = COALESCE($1, priority_id),
          room_id = COALESCE($2, room_id)
      WHERE patient_id = $3
      RETURNING *;
      `,
      [priority_id || null, room_id || null, patientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating patient', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove a patient (when they have been treated/discharged)
app.delete('/api/patients/:id', async (req, res) => {
  const patientId = req.params.id;

  try {
    await pool.query('DELETE FROM patients WHERE patient_id = $1', [patientId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting patient', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
