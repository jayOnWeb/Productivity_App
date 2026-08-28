const express = require('express');
const {
  createTask,
  batchCreateTasks,
  getTasks,
  updateTask,
  deleteTask,
  getLogs,
} = require('../controllers/taskController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Create Task
router.post('/', protect, createTask);

// ✅ Batch Create Tasks (for AI task generation / breakdown)
router.post('/batch', protect, batchCreateTasks);

// ✅ Get All Tasks (only logged-in user)
router.get('/', protect, getTasks);

// 📊 Get Daily Logs — must be before /:id
router.get("/logs", protect, getLogs);

// ✅ Update Task
router.put('/:id', protect, updateTask);

// ✅ Delete Task
router.delete('/:id', protect, deleteTask);

module.exports = router;