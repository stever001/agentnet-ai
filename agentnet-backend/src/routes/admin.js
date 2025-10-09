// agentnet-backend/src/routes/admin.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AdminUser } = require('../models');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_access_secret';

// -------------------------------------------
// POST /api/admin/register  { email, password }
// -------------------------------------------
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const existing = await AdminUser.findOne({ where: { email } });
    if (existing)
      return res.status(400).json({ error: 'Admin already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await AdminUser.create({ email, passwordHash });

    res.json({ ok: true, id: user.id, email: user.email });
  } catch (err) {
    console.error('❌ Error registering admin:', err);
    res.status(500).json({ error: 'Failed to register admin' });
  }
});

// -------------------------------------------
// POST /api/admin/login  { email, password }
// -------------------------------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const user = await AdminUser.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role || 'admin' },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ ok: true, token });
  } catch (err) {
    console.error('❌ Error logging in admin:', err);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

module.exports = router;

