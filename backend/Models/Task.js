const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    discription: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "working", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["urgent", "high", "medium", "low"],
      default: "medium",
    },
    category: {
      type: String,
      enum: ["work", "personal", "learning", "health", "finance", "other"],
      default: "work",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    estimatedMinutes: {
      type: Number,
      default: 30,
    },
    subtasks: [subtaskSchema],
    previousStatus: {
      type: String,
      enum: ["pending", "working", "completed"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } }
);

// Pre-save hook to normalize description and discription
taskSchema.pre("save", function () {
  if (this.discription && !this.description) {
    this.description = this.discription;
  } else if (this.description && !this.discription) {
    this.discription = this.description;
  }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
