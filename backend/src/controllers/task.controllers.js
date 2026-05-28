import { Task } from "../models/task.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const getTaskById = async (taskId, ownerId) => {
  const task = await Task.findOne({ _id: taskId, owner: ownerId });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
};

const createTask = asyncHandler(async (req, res) => {
  const { title, description, stage, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    stage,
    priority,
    dueDate: dueDate || undefined,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { task }, "Task created successfully"));
});

const getTasks = asyncHandler(async (req, res) => {
  const { stage, priority, search } = req.query;
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;

  const filter = {
    owner: req.user._id,
  };

  if (stage) filter.stage = stage;
  if (priority) filter.priority = priority;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const [tasks, totalTasks] = await Promise.all([
    Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Task.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        tasks,
        pagination: {
          page,
          limit,
          totalTasks,
          totalPages: Math.ceil(totalTasks / limit) || 1,
        },
      },
      "Tasks fetched successfully",
    ),
  );
});

const getTask = asyncHandler(async (req, res) => {
  const task = await getTaskById(req.params.taskId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, { task }, "Task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await getTaskById(req.params.taskId, req.user._id);

  const allowedFields = ["title", "description", "stage", "priority", "dueDate"];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      task[field] = req.body[field] || undefined;
    }
  });

  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { task }, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await getTaskById(req.params.taskId, req.user._id);
  await task.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

const getTaskStats = asyncHandler(async (req, res) => {
  const [statusStats, priorityStats, overdueTasks] = await Promise.all([
    Task.aggregate([
      { $match: { owner: req.user._id } },
      { $group: { _id: "$stage", count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $match: { owner: req.user._id } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]),
    Task.countDocuments({
      owner: req.user._id,
      stage: { $ne: "done" },
      dueDate: { $lt: new Date() },
    }),
  ]);

  const stats = {
    stage: {
      todo: 0,
      "in-progress": 0,
      done: 0,
    },
    priority: {
      low: 0,
      medium: 0,
      high: 0,
    },
    overdue: overdueTasks,
  };

  statusStats.forEach((item) => {
    stats.stage[item._id] = item.count;
  });

  priorityStats.forEach((item) => {
    stats.priority[item._id] = item.count;
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { stats }, "Task stats fetched successfully"));
});

export { createTask, deleteTask, getTask, getTaskStats, getTasks, updateTask };
