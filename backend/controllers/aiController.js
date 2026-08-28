const Task = require('../Models/Task');
const DailyLog = require('../Models/DailyLog');
const { callOpenRouterWithFallback, SYSTEM_PROMPTS } = require('../utils/aiService');

/**
 * Clean JSON output from AI response (stripping markdown fenced blocks if model included them)
 */
const parseCleanJSON = (rawText) => {
  let clean = rawText.trim();
  if (clean.startsWith("```json")) {
    clean = clean.replace(/^```json/, "").replace(/```$/, "").trim();
  } else if (clean.startsWith("```")) {
    clean = clean.replace(/^```/, "").replace(/```$/, "").trim();
  }
  return JSON.parse(clean);
};

// 💬 CHAT WITH FOCUS AI
const chatWithAI = async (req, res) => {
  try {
    const { message, conversationHistory = [], customApiKey } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message text is required" });
    }

    // Fetch user's current active tasks to give context to AI
    const activeTasks = await Task.find({ user: req.user._id, status: { $ne: "completed" } }).limit(10);
    const tasksSummary = activeTasks.length > 0
      ? activeTasks.map((t) => `- "${t.title}" (Priority: ${t.priority || 'medium'}, Status: ${t.status})`).join("\n")
      : "No active tasks currently.";

    const systemPromptWithContext = `${SYSTEM_PROMPTS.CHAT_ASSISTANT}

Current User Info:
- User Name: ${req.user.name}
- User's Current Active Tasks:\n${tasksSummary}`;

    const messages = [
      { role: "system", content: systemPromptWithContext },
      ...conversationHistory.slice(-8), // Keep recent history context
      { role: "user", content: message },
    ];

    const result = await callOpenRouterWithFallback(messages, { apiKey: customApiKey });

    res.json({
      reply: result.content,
      modelUsed: result.modelUsed,
    });
  } catch (error) {
    console.error("AI Chat Controller Error:", error);
    res.status(500).json({ message: error.message || "Failed to generate AI response" });
  }
};

// 🔨 AI TASK BREAKDOWN
const breakdownTask = async (req, res) => {
  try {
    const { taskTitle, taskDescription, customApiKey } = req.body;

    if (!taskTitle) {
      return res.status(400).json({ message: "Task title is required for breakdown" });
    }

    const userPrompt = `Task Title: "${taskTitle}"
Description: "${taskDescription || 'None'}"

Please break down this task into logical subtasks with estimated time in minutes.`;

    const messages = [
      { role: "system", content: SYSTEM_PROMPTS.TASK_BREAKDOWN },
      { role: "user", content: userPrompt },
    ];

    const result = await callOpenRouterWithFallback(messages, {
      apiKey: customApiKey,
      temperature: 0.3,
    });

    try {
      const subtasks = parseCleanJSON(result.content);
      res.json({
        subtasks,
        modelUsed: result.modelUsed,
      });
    } catch (parseError) {
      console.warn("JSON parsing failed for subtasks, using fallback text parsing");
      res.json({
        subtasks: [
          { title: `Planning & outline for ${taskTitle}`, estimatedMinutes: 15 },
          { title: `Execution step for ${taskTitle}`, estimatedMinutes: 30 },
          { title: `Review and finalize ${taskTitle}`, estimatedMinutes: 15 },
        ],
        modelUsed: result.modelUsed,
      });
    }
  } catch (error) {
    console.error("AI Breakdown Controller Error:", error);
    res.status(500).json({ message: error.message || "Failed to generate subtasks" });
  }
};

// 💡 AI SMART SUGGESTIONS & PRODUCTIVITY COACH
const getAISuggestions = async (req, res) => {
  try {
    const { customApiKey } = req.body;

    // Fetch user tasks & logs
    const tasks = await Task.find({ user: req.user._id }).sort({ updatedAt: -1 }).limit(15);
    const logs = await DailyLog.find({ user: req.user._id }).sort({ date: -1 }).limit(7);

    const pendingCount = tasks.filter(t => t.status === 'pending').length;
    const workingCount = tasks.filter(t => t.status === 'working').length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;

    const taskTitles = tasks.map(t => `[${t.status.toUpperCase()}] ${t.title} (Category: ${t.category || 'work'})`).join('\n');

    const promptText = `User Tasks Summary:
- Pending: ${pendingCount}, Working: ${workingCount}, Completed: ${completedCount}
- Recent Tasks:\n${taskTitles || 'No recent tasks.'}
- Recent Daily Activity Logs: ${JSON.stringify(logs)}

Generate personalized insights, 3 new smart task suggestions, and a productivity tip.`;

    const messages = [
      { role: "system", content: SYSTEM_PROMPTS.SMART_SUGGESTIONS },
      { role: "user", content: promptText },
    ];

    const result = await callOpenRouterWithFallback(messages, {
      apiKey: customApiKey,
      temperature: 0.5,
    });

    try {
      const suggestions = parseCleanJSON(result.content);
      res.json({
        ...suggestions,
        modelUsed: result.modelUsed,
      });
    } catch (parseErr) {
      res.json({
        insights: `You have ${pendingCount + workingCount} tasks in progress. Keep up your momentum!`,
        suggestedTasks: [
          { title: "Review current week goals", description: "Organize and prioritize your top targets", priority: "high", category: "work" },
          { title: "Clean up completed items", description: "Clear out old finished tasks for mental clarity", priority: "medium", category: "personal" },
          { title: "15-minute quick focus session", description: "Dedicating 15 mins to your most urgent task", priority: "urgent", category: "work" }
        ],
        tip: "Try using the Pomodoro technique (25 min work, 5 min break) for your next complex task.",
        modelUsed: result.modelUsed
      });
    }
  } catch (error) {
    console.error("AI Suggestions Controller Error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch AI suggestions" });
  }
};

// ⚡ AI AUTO-ORGANIZE TASKS
const autoOrganizeTasks = async (req, res) => {
  try {
    const { customApiKey } = req.body;
    const activeTasks = await Task.find({ user: req.user._id, status: { $ne: "completed" } });

    if (activeTasks.length === 0) {
      return res.json({ message: "No active tasks to organize", organizedTasks: [] });
    }

    const inputPayload = activeTasks.map(t => ({
      id: t._id,
      title: t.title,
      description: t.description || t.discription || "",
    }));

    const messages = [
      { role: "system", content: SYSTEM_PROMPTS.AUTO_ORGANIZE },
      { role: "user", content: JSON.stringify(inputPayload) },
    ];

    const result = await callOpenRouterWithFallback(messages, {
      apiKey: customApiKey,
      temperature: 0.2,
    });

    const updates = parseCleanJSON(result.content);

    // Apply updates to MongoDB
    for (const update of updates) {
      if (update.id) {
        await Task.findByIdAndUpdate(update.id, {
          priority: update.priority || 'medium',
          category: update.category || 'work',
          estimatedMinutes: update.estimatedMinutes || 30,
        });
      }
    }

    const updatedTasks = await Task.find({ user: req.user._id });

    res.json({
      message: "Tasks successfully organized by AI!",
      tasks: updatedTasks,
      modelUsed: result.modelUsed,
    });
  } catch (error) {
    console.error("AI Auto-Organize Error:", error);
    res.status(500).json({ message: error.message || "Failed to auto-organize tasks" });
  }
};

module.exports = {
  chatWithAI,
  breakdownTask,
  getAISuggestions,
  autoOrganizeTasks,
};
