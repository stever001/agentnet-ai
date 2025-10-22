// scripts/exportStandardsToDocx.js
const mysql = require('mysql2/promise');
const fs = require('fs');
const htmlToDocx = require('html-to-docx');   // ✅ correct import
require('dotenv').config();

async function main() {
  const { marked } = await import('marked');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('Connected to MySQL.');

  const [rows] = await connection.execute(
    'SELECT title, section, version, content_md FROM standards WHERE status = ? ORDER BY section ASC',
    ['published']
  );

  console.log(`Fetched ${rows.length} sections.`);

  let html = `
    <h1 style="text-align:center;">AgentNet Standards</h1>
    <h3 style="text-align:center;">Version 1.0.0</h3>
    <h4 style="text-align:center;">© ${new Date().getFullYear()} AgentNet. All Rights Reserved.</h4>
    <hr>
    <h2>Table of Contents</h2>
    <ol>${rows.map(r => `<li>${r.title}</li>`).join('')}</ol>
    <hr>
  `;

  for (const row of rows) {
    html += `
      <h2>Section ${row.section}: ${row.title}</h2>
      <p><em>Version ${row.version}</em></p>
      ${marked.parse(row.content_md || '')}
      <hr>
    `;
  }

  // ✅ Use htmlToDocx instead of convert
  const fileBuffer = await htmlToDocx(html, {
    footer: true,
    footerLeft: `© ${new Date().getFullYear()} AgentNet`,
    footerRight: '{PAGE} of {NUMPAGES}',
    pageNumber: true,
  });

  fs.writeFileSync('AgentNet_Standards_v1.0.0.docx', fileBuffer);
  console.log('✅ AgentNet_Standards_v1.0.0.docx generated successfully!');

  await connection.end();
}

main().catch(console.error);
