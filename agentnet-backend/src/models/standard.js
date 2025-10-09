// agentnet-backend/src/models/standard.js
module.exports = (sequelize, DataTypes) => {
  const Standard = sequelize.define("Standard", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    version: {
      type: DataTypes.STRING,
      defaultValue: "1.0.0",
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content_md: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    // 🆕 New fields
    group: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "AgentNet Standards",
    },
    section: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    // ✅ Add this field
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "draft", // or "published"
    },
  });

  return Standard;
};
