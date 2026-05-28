import { body, param, query } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username cant be empty")
      .isLowercase()
      .withMessage("Username must be in lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be atleast 3 characters"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 characters"),
    body("fullName").optional().trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").trim().notEmpty().withMessage("Email is required").isEmail(),
    body("password").notEmpty().withMessage("Password is Required"),
  ];
};

const userChangePasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old Password is Required"),
    body("newPassword")
      .notEmpty()
      .withMessage("New Password Is Required")
      .isLength({ min: 6 })
      .withMessage("New Password must be atleast 6 characters"),
  ];
};

const mongoIdParamValidator = (fieldName = "taskId") => {
  return [
    param(fieldName)
      .isMongoId()
      .withMessage(`${fieldName} must be a valid MongoDB id`),
  ];
};

const taskCreateValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Task title is required")
      .isLength({ min: 3, max: 120 })
      .withMessage("Task title must be between 3 and 120 characters"),
    body("description").optional().trim().isLength({ max: 1000 }),
    body("stage")
      .optional()
      .isIn(["todo", "in-progress", "done"])
      .withMessage("Stage must be todo, in-progress, or done"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Priority must be low, medium, or high"),
    body("dueDate")
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601()
      .withMessage("Due date must be a valid date"),
  ];
};

const taskUpdateValidator = () => {
  return [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 3, max: 120 })
      .withMessage("Task title must be between 3 and 120 characters"),
    body("description").optional().trim().isLength({ max: 1000 }),
    body("stage")
      .optional()
      .isIn(["todo", "in-progress", "done"])
      .withMessage("Stage must be todo, in-progress, or done"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Priority must be low, medium, or high"),
    body("dueDate")
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601()
      .withMessage("Due date must be a valid date"),
  ];
};

const taskListValidator = () => {
  return [
    query("stage")
      .optional()
      .isIn(["todo", "in-progress", "done"])
      .withMessage("Stage must be todo, in-progress, or done"),
    query("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Priority must be low, medium, or high"),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
  ];
};

export {
  mongoIdParamValidator,
  taskCreateValidator,
  taskListValidator,
  taskUpdateValidator,
  userChangePasswordValidator,
  userLoginValidator,
  userRegisterValidator,
};
