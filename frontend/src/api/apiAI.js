import axios from "axios";

const API = "http://localhost:3000/api/ai";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const chatWithAI = async (message, conversationHistory = []) => {
  const customApiKey = localStorage.getItem("openrouter_api_key") || "";
  const res = await axios.post(
    `${API}/chat`,
    { message, conversationHistory, customApiKey },
    getAuthHeaders()
  );
  return res.data;
};

export const breakdownTask = async (taskTitle, taskDescription = "") => {
  const customApiKey = localStorage.getItem("openrouter_api_key") || "";
  const res = await axios.post(
    `${API}/breakdown`,
    { taskTitle, taskDescription, customApiKey },
    getAuthHeaders()
  );
  return res.data;
};

export const getAISuggestions = async () => {
  const customApiKey = localStorage.getItem("openrouter_api_key") || "";
  const res = await axios.post(
    `${API}/suggestions`,
    { customApiKey },
    getAuthHeaders()
  );
  return res.data;
};

export const autoOrganizeTasks = async () => {
  const customApiKey = localStorage.getItem("openrouter_api_key") || "";
  const res = await axios.post(
    `${API}/auto-organize`,
    { customApiKey },
    getAuthHeaders()
  );
  return res.data;
};
