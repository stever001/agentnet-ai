// agentnet-frontend/src/utils/viewerApi.js
import axios from 'axios';

const viewerAPI = axios.create({
  baseURL: import.meta.env.VITE_VIEWER_API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Attach the admin JWT from AgentNet-AI’s AuthContext
viewerAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('agentnet_admin_token'); // same key you use in AuthMiddleware
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default viewerAPI;
