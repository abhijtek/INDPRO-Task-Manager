import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTaskStats,
  getTasks,
  updateTask,
} from "../controllers/task.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  mongoIdParamValidator,
  taskCreateValidator,
  taskListValidator,
  taskUpdateValidator,
} from "../validators/index.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(taskListValidator(), validate, getTasks)
  .post(taskCreateValidator(), validate, createTask);

router.route("/stats").get(getTaskStats);

router
  .route("/:taskId")
  .get(mongoIdParamValidator("taskId"), validate, getTask)
  .patch(
    mongoIdParamValidator("taskId"),
    taskUpdateValidator(),
    validate,
    updateTask,
  )
  .delete(mongoIdParamValidator("taskId"), validate, deleteTask);

export default router;
