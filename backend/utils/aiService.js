// Models ordered from highest capability to free tier fallback models
const MODEL_FALLBACK_CHAIN = [
  // Primary Models
  "google/gemini-2.0-flash-001",
  "meta-llama/llama-3.3-70b-instruct",
  "deepseek/deepseek-chat",
  // Free Fallback Models
  "meta-llama/llama-3.2-11b-vision-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "qwen/qwen-2.5-coder-32b-instruct:free",
  "google/gemini-2.0-flash-exp:free",
  "deepseek/deepseek-r1:free"
];

/**
 * Executes a chat completion prompt against OpenRouter API with multi-tiered fallback.
 * Uses native fetch (Node.js 18+) so no external dependencies are required.
 * @param {Array} messages - Chat messages array [{role: 'system'|'user'|'assistant', content: string}]
 * @param {Object} options - Options object ({ apiKey, temperature, responseFormat })
 * @returns {Promise<{content: string, modelUsed: string}>}
 */
const callOpenRouterWithFallback = async (messages, options = {}) => {
  const apiKey = options.apiKey || process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OpenRouter API key is missing. Please check your .env configuration or settings.");
  }

  let lastError = null;

  for (const model of MODEL_FALLBACK_CHAIN) {
    try {
      console.log(`🤖 Attempting AI call using model: ${model}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://focusflow.app",
          "X-Title": "FocusFlow Task Management App",
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.max_tokens ?? 1500,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.choices && data.choices.length > 0) {
          const content = data.choices[0].message.content;
          console.log(`✅ AI success with model: ${model}`);
          return {
            content,
            modelUsed: model,
          };
        }
      } else {
        const errorText = await response.text();
        console.warn(`⚠️ Model ${model} HTTP ${response.status}: ${errorText}`);
        lastError = new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.warn(`⚠️ Model ${model} failed: ${error.message}. Falling back to next model...`);
      lastError = error;
    }
  }

  throw new Error(`All OpenRouter AI models failed. Last error: ${lastError?.message || 'Unknown error'}`);
};

/**
 * System prompts for specific AI tasks
 */
const SYSTEM_PROMPTS = {
  CHAT_ASSISTANT: `You are "Focus AI", an intelligent productivity assistant built directly into FocusFlow task management app.
Your role is to help users manage their workload, organize tasks, break down complex projects into actionable steps, recommend focus techniques, and keep them motivated.
Always provide helpful, concise, well-structured responses formatted with markdown.
If appropriate, suggest concrete new tasks that the user can add.`,

  TASK_BREAKDOWN: `You are a productivity expert assistant. Break down the user's task into 3 to 6 logical, clear, actionable subtasks.
Respond ONLY with a valid JSON array of objects with the structure:
[
  { "title": "Subtask title here", "estimatedMinutes": 15 },
  ...
]
Do not include any intro text, markdown code blocks (like \`\`\`json), or extra explanations. Output raw JSON array only.`,

  SMART_SUGGESTIONS: `You are an AI Productivity Coach for FocusFlow. Analyze the user's current tasks and daily logs.
Provide:
1. "insights": A brief 1-2 sentence assessment of their current workload & streak.
2. "suggestedTasks": An array of 3 recommended next tasks with title, category (work/personal/learning/health/finance/other), priority (urgent/high/medium/low), and description.
3. "tip": One actionable focus or time-management tip.

Respond ONLY with valid JSON matching this schema:
{
  "insights": "string",
  "suggestedTasks": [
    {
      "title": "string",
      "description": "string",
      "priority": "urgent" | "high" | "medium" | "low",
      "category": "work" | "personal" | "learning" | "health" | "finance" | "other"
    }
  ],
  "tip": "string"
}
Do not include markdown code block tags or extra prose. Output raw JSON only.`,

  AUTO_ORGANIZE: `You are an AI task organizer. For each given task in the array, assign the optimal priority ("urgent", "high", "medium", "low"), category ("work", "personal", "learning", "health", "finance", "other"), and estimatedMinutes.
Respond ONLY with a valid JSON array of updated tasks:
[
  {
    "id": "task_id_here",
    "priority": "high",
    "category": "work",
    "estimatedMinutes": 45
  }
]
Output raw JSON array only.`
};

module.exports = {
  callOpenRouterWithFallback,
  SYSTEM_PROMPTS,
  MODEL_FALLBACK_CHAIN
};
