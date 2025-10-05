// agentnet-backend/src/middleware/requireRole.js
function requireRole(role) {
  return function (req, res, next) {
    const user = req.user || {};
    if (user.role !== role) return res.status(403).json({ code: 'FORBIDDEN' });
    next();
  }
}

module.exports = { requireRole };
