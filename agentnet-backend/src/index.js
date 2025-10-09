// agentnet-backend/src/index.js
const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models'); // ✅ use models/index.js, not config/db
const healthRouter = require('./routes/health');
const pagesRouter = require('./routes/pages');
const standardsRouter = require('./routes/standards');
const adminRouter = require('./routes/admin');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/health', healthRouter);
app.use('/api/pages', pagesRouter);
app.use('/api/standards', standardsRouter);
app.use('/api/admin', adminRouter);


// Static serving (for unified mode)
app.use(express.static(path.join(__dirname, '../public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const port = process.env.PORT || 5174;

(async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(port, () => console.log(`✅ Backend running at http://localhost:${port}`));
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
})();
