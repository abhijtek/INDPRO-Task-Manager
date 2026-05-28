import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import authRouter from "./routes/auth.routes.js";
import healthCheckRouter from "./routes/healthcheck.routes.js";
import taskRouter from "./routes/task.routes.js";
import { ApiError } from "./utils/api-error.js";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", taskRouter);

app.get("/", (req, res) => {
  res.send("Welcome to INDPRO Task Manager");
});

app.use((req, res, next) => {
  next(new ApiError(404, "Route not found"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    statusCode,
    data: err.data || null,
    message: err.message || "Internal Server Error",
    success: false,
    errors: err.errors || [],
  });
});

export default app;
