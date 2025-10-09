// run-migrate.js
require('dotenv').config({ path: './agentnet-backend/.env' });
const { execSync } = require('child_process');

console.log('Using DB credentials:');
console.log('  USER:', process.env.DB_USER);
console.log('  PASSWORD:', process.env.DB_PASSWORD ? '********' : '(missing)');

execSync(
  'npx sequelize-cli db:migrate --config agentnet-backend/src/config/config.js',
  { stdio: 'inherit' }
);
