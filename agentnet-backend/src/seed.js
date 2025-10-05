// agentnet-backend/src/seed.js
const { sequelize, Page, Standard } = require('./models')

async function seed() {
  try {
    await sequelize.sync({ alter: true }) // creates tables if missing, updates if changed

    // Seed core pages
    await Page.bulkCreate(
      [
        {
          slug: 'home',
          title: 'Home',
          content_md: `# AgentNet.ai
Welcome to the machine-first web. This site houses our **Educational pages**, **Docs**, and **Standards**.`,
          status: 'published'
        },
        {
          slug: 'about',
          title: 'About',
          content_md: `# About AgentNet
AgentNet is building the machine-first web — a registry and standards hub for agents, capsules, and structured content.`,
          status: 'published'
        },
        {
          slug: 'docs',
          title: 'Docs',
          content_md: `# Documentation
This section will house educational guides and API references for developers, standards contributors, and Node registrants.`,
          status: 'published'
        },
        {
          slug: 'contact',
          title: 'Contact',
          content_md: `# Contact Us
You can reach the AgentNet team at:

- **Email**: support@agentnet.ai  
- **Discord**: [AgentNet Community](https://discord.gg/agentnet)  
- **GitHub**: [agentnet-demo](https://github.com/stever001/agentnet-demo)`,
          status: 'published'
        }
      ],
      { ignoreDuplicates: true }
    )

    // Seed initial standards
    await Standard.bulkCreate(
      [
        {
          slug: 'agentnet-standards-intro',
          title: 'AgentNet Standards (Intro)',
          summary: 'Living standards for agent registration and capsules.',
          content_md: `# AgentNet Standards (Living Document)
This section defines the initial standards for agent registration, capsules, and dual-canonicality.

- Version: 0.1.0
- Status: Draft`,
          status: 'published',
          version: '0.1.0'
        }
      ],
      { ignoreDuplicates: true }
    )

    console.log('✅ Seed data inserted/verified successfully.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding failed:', err)
    process.exit(1)
  }
}

seed()
