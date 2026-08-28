const Task = require("../Models/Task");
const DailyLog = require("../Models/DailyLog");

// ✅ CREATE TASK
const createTask = async (req, res) => {
  try {
    const {
      title,
      discription,
      description,
      status,
      priority,
      category,
      dueDate,
      estimatedMinutes,
      subtasks,
    } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Task title is required" });
    }

    const taskDesc = description !== undefined ? description : (discription || "");

    const newTask = await Task.create({
      title: title.trim(),
      discription: taskDesc,
      description: taskDesc,
      status: status || "pending",
      priority: priority || "medium",
      category: category || "work",
      dueDate: dueDate || null,
      estimatedMinutes: estimatedMinutes || 30,
      subtasks: Array.isArray(subtasks) ? subtasks : [],
      user: req.user._id,
    });

    res.status(201).json({
      message: "Task added successfully...",
      task: newTask,
    });
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({
      message: "Server error while creating task",
      error: error.message,
    });
  }
};

// ✅ BATCH CREATE TASKS (For AI breakdown & smart suggestions)
const batchCreateTasks = async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ message: "No tasks array provided" });
    }

    const createdTasks = [];
    for (const t of tasks) {
      const taskDesc = t.description !== undefined ? t.description : (t.discription || "");
      const created = await Task.create({
        title: t.title,
        discription: taskDesc,
        description: taskDesc,
        status: t.status || "pending",
        priority: t.priority || "medium",
        category: t.category || "work",
        dueDate: t.dueDate || null,
        estimatedMinutes: t.estimatedMinutes || 30,
        subtasks: Array.isArray(t.subtasks) ? t.subtasks : [],
        user: req.user._id,
      });
      createdTasks.push(created);
    }

    res.status(201).json({
      message: `${createdTasks.length} tasks added successfully`,
      tasks: createdTasks,
    });
  } catch (error) {
    console.error("Batch Create Error:", error);
    res.status(500).json({ message: "Server error creating batch tasks", error: error.message });
  }
};

// ✅ GET TASKS (ONLY CURRENT USER)
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

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

    const {
      title,
      discription,
      description,
      status,
      priority,
      category,
      dueDate,
      estimatedMinutes,
      subtasks,
      toggle,
    } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) {
      task.description = description;
      task.discription = description;
    } else if (discription !== undefined) {
      task.description = discription;
      task.discription = discription;
    }

    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (estimatedMinutes !== undefined) task.estimatedMinutes = estimatedMinutes;
    if (subtasks !== undefined) task.subtasks = subtasks;

    // 🔥 TOGGLE LOGIC FOR COMPLETE / UNCOMPLETE
    if (toggle) {
      if (task.status === "completed") {
        task.status = task.previousStatus || "pending";

        const today = new Date().toISOString().split("T")[0];
        await DailyLog.findOneAndUpdate(
          { user: req.user._id, date: today },
          { $inc: { completed: -1 } },
          { upsert: true, new: true }
        );
      } else {
        task.previousStatus = task.status;
        task.status = "completed";

        const today = new Date().toISOString().split("T")[0];
        await DailyLog.findOneAndUpdate(
          { user: req.user._id, date: today },
          { $inc: { completed: 1 } },
          { upsert: true, new: true }
        );
      }
    } else if (status !== undefined) {
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

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

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

// 📈 GET DAILY LOGS
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
  batchCreateTasks,
  getTasks,
  updateTask,
  deleteTask,
  getLogs,
};
