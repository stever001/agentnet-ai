// agentnet-backend/src/routes/pages.js
const express = require('express');
const { Page } = require('../models');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/requireRole');

const router = express.Router();

// Public: list published
router.get('/', async (req, res) => {
  try {
    const pages = await Page.findAll({
      where: { status: 'published' },
      order: [['updatedAt', 'DESC']]
    });
    res.json(pages);
  } catch (err) {
    console.error('Error fetching pages list:', err);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// Admin: list all (draft + published)
router.get('/all', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const pages = await Page.findAll({ order: [['updatedAt', 'DESC']] });
    res.json(pages);
  } catch (err) {
    console.error('Error fetching all pages:', err);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// Public: get single by slug
router.get('/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({
      where: { slug: req.params.slug, status: 'published' }
    });
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json(page);
  } catch (err) {
    console.error('Error fetching page:', err);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// Admin: create/update
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { slug, title, content_md, status } = req.body;
    if (!slug || !title || !content_md) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [doc, created] = await Page.upsert({
      slug,
      title,
      content_md,
      status: status || 'published'
    });

    res.json({ ok: true, created, doc });
  } catch (err) {
    console.error('Error creating/updating page:', err);
    res.status(500).json({ error: 'Failed to save page' });
  }
});

// Admin: delete by slug
router.delete('/:slug', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const cnt = await Page.destroy({ where: { slug: req.params.slug } });
    res.json({ ok: true, deleted: cnt });
  } catch (err) {
    console.error('Error deleting page:', err);
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

module.exports = router;
