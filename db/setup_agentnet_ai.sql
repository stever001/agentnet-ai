-- Create the AgentNet database
CREATE DATABASE IF NOT EXISTS agentnet_ai
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Create a dedicated user (change the password!)
CREATE USER IF NOT EXISTS 'agentnet_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';

-- Grant privileges only on this database
GRANT ALL PRIVILEGES ON agentnet_ai.* TO 'agentnet_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;
