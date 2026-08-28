import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "";
const API = `${API_BASE}/api/tasks`;

// ✅ GET TASKS
export const getTasks = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
};

// ✅ CREATE TASK
export const createTask = async (data) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(API, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
};

// ✅ BATCH CREATE TASKS
export const batchCreateTasks = async (tasksArray) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(`${API}/batch`, { tasks: tasksArray }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
};

// ✅ UPDATE TASK
export const updateTask = async (id, data) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(`${API}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
};

// ✅ DELETE TASK
export const deleteTask = async (id) => {
  const token = localStorage.getItem("token");

  const res = await axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
};

// ✅ GET LOGS
export const getLogs = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/logs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
