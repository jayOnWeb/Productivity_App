const Task = require("../Models/Task");

// ✅ CREATE TASK
const createTask = async (req, res) => {
  try {
    const { title, discription, status } = req.body;

    const newTask = await Task.create({
      title,
      discription,
      status,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Task added successfully...",
      task: newTask,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error while creating task",
    });
  }
};

// ✅ GET TASKS (ONLY CURRENT USER)
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
    });

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching tasks",
    });
  }
};

// ✏️ UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, discription, status, toggle } = req.body;

    if (title !== undefined) task.title = title;
    if (discription !== undefined) task.discription = discription;

    // 🔥 TOGGLE LOGIC
    if (toggle) {
      if (task.status === "completed") {
        // uncompleting — decrement log
        task.status = task.previousStatus || "pending";

        const DailyLog = require("../Models/DailyLog");
        const today = new Date().toISOString().split("T")[0];
        await DailyLog.findOneAndUpdate(
          { user: req.user._id, date: today },
          { $inc: { completed: -1 } },
          { upsert: true, new: true }
        );

      } else {
        // completing — increment log
        task.previousStatus = task.status;
        task.status = "completed";

        const DailyLog = require("../Models/DailyLog");
        const today = new Date().toISOString().split("T")[0];
        await DailyLog.findOneAndUpdate(
          { user: req.user._id, date: today },
          { $inc: { completed: 1 } },
          { upsert: true, new: true }
        );
      }
    }

    // normal update (for edit modal later)
    else if (status !== undefined) {
      task.status = status;
    }

    const updatedTask = await task.save();

    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error while updating task" });
  }
};

// 🗑 DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    // ❌ Task not found
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ❌ Wrong user trying to delete
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error deleting task",
    });
  }
};
const DailyLog = require("../Models/DailyLog");

const getLogs = async (req, res) => {
  try {
    const logs = await DailyLog.find({ user: req.user._id }).sort({ date: 1 });
    res.status(200).json({ logs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching logs" });
  }
};
module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getLogs,
};
