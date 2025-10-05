// agentnet-backend/src/routes/standards.js
const express = require('express')
const { Standard } = require('../models')
const { authenticateToken } = require('../middleware/authMiddleware')
const { requireRole } = require('../middleware/requireRole')

const router = express.Router()

/**
 * ADMIN: List all standards (published + draft)
 * GET /api/standards/all
 * (MUST be defined BEFORE '/:slug' or it will 404)
 */
router.get('/all', authenticateToken, requireRole('admin'), async (_req, res) => {
  try {
    const standards = await Standard.findAll({ order: [['updatedAt', 'DESC']] })
    res.json(standards)
  } catch (err) {
    console.error('Error fetching all standards:', err)
    res.status(500).json({ error: 'Failed to fetch all standards' })
  }
})

/**
 * PUBLIC: List published, public standards
 * GET /api/standards
 */
router.get('/', async (_req, res) => {
  try {
    const standards = await Standard.findAll({
      where: { status: 'published' }, // add visibility constraint here if you implemented it
      order: [['updatedAt', 'DESC']],
    })
    res.json(standards)
  } catch (err) {
    console.error('Error fetching standards:', err)
    res.status(500).json({ error: 'Failed to fetch standards' })
  }
})

/**
 * ADMIN: Create or update a standard
 * POST /api/standards
 * Body: { slug, title, description, content_md, status, ... }
 */
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { slug, title, description, content_md, status, visibility, requiredLicense } = req.body
    if (!slug || !title || !content_md) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const [doc, created] = await Standard.upsert({
      slug,
      title,
      description: description || '',
      content_md,
      status: status || 'published',
      // include these only if your model/migration has them:
      visibility: visibility || undefined,
      requiredLicense: requiredLicense || null,
    })

    res.json({ ok: true, created, doc })
  } catch (err) {
    console.error('Error creating/updating standard:', err)
    res.status(500).json({ error: 'Failed to save standard' })
  }
})

/**
 * ADMIN: Delete a standard by slug
 * DELETE /api/standards/:slug
 * (Keep this ABOVE the generic GET '/:slug' to avoid accidental matches)
 */
router.delete('/:slug', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const deletedCount = await Standard.destroy({ where: { slug: req.params.slug } })
    if (deletedCount === 0) return res.status(404).json({ error: 'Standard not found' })
    res.json({ ok: true, deleted: deletedCount })
  } catch (err) {
    console.error('Error deleting standard:', err)
    res.status(500).json({ error: 'Failed to delete standard' })
  }
})

/**
 * PUBLIC: Get a specific published standard by slug
 * GET /api/standards/:slug
 * (Place this LAST so it doesn’t swallow '/all' or other specific routes)
 */
router.get('/:slug', async (req, res) => {
  try {
    const standard = await Standard.findOne({
      where: { slug: req.params.slug, status: 'published' },
    })
    if (!standard) return res.status(404).json({ error: 'Standard not found' })
    res.json(standard)
  } catch (err) {
    console.error('Error fetching standard:', err)
    res.status(500).json({ error: 'Failed to fetch standard' })
  }
})

module.exports = router
