// agentnet-backend/src/routes/standards.js
const express = require('express')
const semver = require('semver')
const { Op, Sequelize } = require('sequelize')
const { Standard } = require('../models')
const { authenticateToken } = require('../middleware/authMiddleware')
const { requireRole } = require('../middleware/requireRole')

const router = express.Router()

/* ============================================================================
   ADMIN: List all standards (published + draft)
   GET /api/standards/all
============================================================================ */
router.get('/all', authenticateToken, requireRole('admin'), async (_req, res) => {
  try {
    const standards = await Standard.findAll({
      order: [['group', 'ASC'], ['section', 'ASC'], ['updatedAt', 'DESC']],
    })
    res.json(standards)
  } catch (err) {
    console.error('Error fetching all standards:', err)
    res.status(500).json({ error: 'Failed to fetch all standards' })
  }
})

/* ============================================================================
   ADMIN: List all unique groups for dropdowns
   GET /api/standards/groups
============================================================================ */
router.get('/groups', authenticateToken, requireRole('admin'), async (_req, res) => {
  try {
    const groups = await Standard.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('group')), 'group']],
      where: { group: { [Op.ne]: null } },
      order: [['group', 'ASC']],
    })
    const groupList = groups.map(g => g.group).filter(Boolean)
    res.json(groupList)
  } catch (err) {
    console.error('Error fetching groups:', err)
    res.status(500).json({ error: 'Failed to fetch groups' })
  }
})

/* ============================================================================
   PUBLIC: List published standards only
   GET /api/standards
============================================================================ */
router.get('/', async (_req, res) => {
  try {
    const standards = await Standard.findAll({
      where: { status: 'published' },
      order: [['group', 'ASC'], ['section', 'ASC'], ['updatedAt', 'DESC']],
    })
    res.json(standards)
  } catch (err) {
    console.error('Error fetching published standards:', err)
    res.status(500).json({ error: 'Failed to fetch standards' })
  }
})

/* ============================================================================
   ADMIN: Fetch specific standard by slug (any status)
   GET /api/standards/admin/:slug
============================================================================ */
router.get('/admin/:slug', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { slug } = req.params
    const standard = await Standard.findOne({ where: { slug } })
    if (!standard) return res.status(404).json({ error: 'Standard not found' })
    res.json(standard)
  } catch (err) {
    console.error('Error fetching standard by slug (admin):', err)
    res.status(500).json({ error: 'Failed to fetch standard' })
  }
})

/* ============================================================================
   ADMIN: Create or update (upsert) a standard
   POST /api/standards
============================================================================ */
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const {
      slug,
      title,
      description,
      content_md,
      status,
      visibility,
      requiredLicense,
      version,
      group,
      section,
    } = req.body

    if (!slug || !title || !content_md) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const [doc, created] = await Standard.upsert({
      slug,
      title,
      description: description || '',
      content_md,
      status: status || 'published',
      version: version || '1.0.0',
      visibility: visibility || undefined,
      requiredLicense: requiredLicense || null,
      group: group || 'AgentNet Standards',
      section: section || null,
    })

    res.json({ ok: true, created, doc })
  } catch (err) {
    console.error('Error creating/updating standard:', err)
    res.status(500).json({ error: 'Failed to save standard' })
  }
})

/* ============================================================================
   ADMIN: Update existing standard by slug (semantic version aware)
   PUT /api/standards/:slug
============================================================================ */
router.put('/:slug', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { slug } = req.params
    const standard = await Standard.findOne({ where: { slug } })
    if (!standard) return res.status(404).json({ error: 'Standard not found' })

    const { updateType, ...fields } = req.body

    // ✅ Protect slug from being overwritten
    if (fields.slug && fields.slug !== slug) {
      delete fields.slug
    }

    // ✅ Validate numeric section
    if (fields.section && isNaN(parseFloat(fields.section))) {
      return res.status(400).json({ error: 'Section must be a valid number' })
    }

    // ✅ Whitelist allowed updatable fields
    const allowed = ['title', 'version', 'summary', 'content_md', 'group', 'section', 'status']
    const updates = {}
    for (const key of allowed) {
      if (Object.hasOwn(fields, key)) updates[key] = fields[key]
    }

    // Normalize status
    if (updates.status) updates.status = updates.status.toLowerCase().trim()

    // Apply safe updates
    Object.assign(standard, updates)

    // Semantic version bump if requested
    if (updateType && ['major', 'minor', 'patch'].includes(updateType)) {
      const currentVersion = standard.version || '1.0.0'
      const newVersion = semver.inc(currentVersion, updateType)
      if (newVersion) standard.version = newVersion
    }

    await standard.save()
    res.json({ ok: true, updated: true, version: standard.version })
  } catch (err) {
    console.error('Error updating standard by slug:', err)
    res.status(500).json({ error: 'Failed to update standard' })
  }
})

/* ============================================================================
   ADMIN: Delete a standard by slug
   DELETE /api/standards/:slug
============================================================================ */
router.delete('/:slug', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const deletedCount = await Standard.destroy({ where: { slug: req.params.slug } })
    if (deletedCount === 0) return res.status(404).json({ error: 'Standard not found' })
    res.json({ ok: true, deleted: deletedCount })
  } catch (err) {
    console.error('Error deleting standard by slug:', err)
    res.status(500).json({ error: 'Failed to delete standard' })
  }
})

/* ============================================================================
   PUBLIC: Get published standard by slug
   GET /api/standards/:slug
============================================================================ */
router.get('/:slug', async (req, res) => {
  try {
    const standard = await Standard.findOne({
      where: { slug: req.params.slug, status: 'published' },
    })
    if (!standard) return res.status(404).json({ error: 'Standard not found' })
    res.json(standard)
  } catch (err) {
    console.error('Error fetching standard (public):', err)
    res.status(500).json({ error: 'Failed to fetch standard' })
  }
})

module.exports = router
