const mongoose = require("mongoose");

const dailyLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  completed: { type: Number, default: 0 },
});

module.exports = mongoose.model("DailyLog", dailyLogSchema);