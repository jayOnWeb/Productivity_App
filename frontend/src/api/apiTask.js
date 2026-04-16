import axios from "axios";

const API = "http://localhost:3000/api/tasks";

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

export const updateTask = async (id, data) => {
    const token = localStorage.getItem("token");

    const res = await axios.put(`${API}/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.data;
};

export const deleteTask = async (id) => {
    const token = localStorage.getItem("token");

    const res = await axios.delete(`${API}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.data;
};

export const getLogs = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:3000/api/tasks/logs", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

