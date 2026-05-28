import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Task title must be at least 3 characters long"],
      maxlength: [120, "Task title must be at most 120 characters long"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Task description must be at most 1000 characters long"],
    },
    stage: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },
    dueDate: {
      type: Date,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Task = mongoose.model("Task", taskSchema);
