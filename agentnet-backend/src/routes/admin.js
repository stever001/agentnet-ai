// agentnet-backend/src/routes/admin.js
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_access_secret';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dev_admin_pw';

// POST /api/admin/login  { password }
router.post('/login', (req, res) => {
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: 'Missing password' });
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid credentials' });

  // issue a short-lived admin token
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ ok: true, token });
});

module.exports = router;
