import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

const STAGES = [
  { key: "todo", label: "Todo" },
  { key: "in-progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

const emptyAuthForm = {
  fullName: "",
  username: "",
  email: "",
  password: "",
};

const emptyTaskForm = {
  title: "",
  description: "",
  stage: "todo",
  priority: "medium",
  dueDate: "",
};

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result.data;
}

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(emptyAuthForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLogin = mode === "login";

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const switchMode = () => {
    setMode((current) => (current === "login" ? "signup" : "login"));
    setForm(emptyAuthForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : {
            fullName: form.fullName,
            username: form.username,
            email: form.email,
            password: form.password,
          };

      const data = await apiRequest(isLogin ? "/auth/login" : "/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!isLogin) {
        await apiRequest("/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });
      }

      toast.success(isLogin ? "Welcome back" : "Account created");
      onAuthenticated(data.user);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/80 md:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-slate-950 p-8 text-white sm:p-10">
          <div className="flex h-full min-h-80 flex-col justify-between">
            <div>
              <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400 text-lg font-bold text-slate-950">
                IN
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                INDPRO Task Manager
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
                Manage your work across Todo, In Progress, and Done without
                making the app heavier than it needs to be.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3 text-sm">
              {STAGES.map((stage) => (
                <div
                  className="rounded-xl border border-white/10 bg-white/5 p-3"
                  key={stage.key}
                >
                  <p className="font-medium">{stage.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              {isLogin ? "Sign in to your account" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {isLogin ? "New here?" : "Already registered?"}{" "}
              <button
                className="font-semibold text-emerald-700 hover:text-emerald-800"
                onClick={switchMode}
                type="button"
              >
                {isLogin ? "Create an account" : "Sign in"}
              </button>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <Field
                  label="Full name"
                  onChange={(value) => updateField("fullName", value)}
                  placeholder="Abhijeet Rajput"
                  value={form.fullName}
                />
                <Field
                  label="Username"
                  onChange={(value) => updateField("username", value)}
                  placeholder="abhijeet"
                  value={form.username}
                />
              </>
            )}
            <Field
              label="Email"
              onChange={(value) => updateField("email", value)}
              placeholder="you@example.com"
              type="email"
              value={form.email}
            />
            <Field
              label="Password"
              onChange={(value) => updateField("password", value)}
              placeholder="Minimum 6 characters"
              type="password"
              value={form.password}
            />
            <button
              className="w-full rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Please wait..." : isLogin ? "Sign in" : "Sign up"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({ label, onChange, placeholder, type = "text", value }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
        type={type}
        value={value}
      />
    </label>
  );
}

function TaskForm({ editingTask, onCancel, onSaved }) {
  const initialForm = editingTask
    ? {
        title: editingTask.title || "",
        description: editingTask.description || "",
        stage: editingTask.stage || "todo",
        priority: editingTask.priority || "medium",
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : "",
      }
    : emptyTaskForm;

  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    const payload = {
      ...form,
      dueDate: form.dueDate || undefined,
    };

    try {
      await apiRequest(editingTask ? `/tasks/${editingTask._id}` : "/tasks", {
        method: editingTask ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      toast.success(editingTask ? "Task updated" : "Task created");
      setForm(emptyTaskForm);
      onSaved();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Title
          </span>
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Prepare assignment submission"
            required
            value={form.title}
          />
        </label>
        <label className="md:col-span-2">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </span>
          <textarea
            className="min-h-24 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Add details..."
            value={form.description}
          />
        </label>
        <SelectField
          label="Stage"
          onChange={(value) => updateField("stage", value)}
          options={STAGES}
          value={form.stage}
        />
        <SelectField
          label="Priority"
          onChange={(value) => updateField("priority", value)}
          options={[
            { key: "low", label: "Low" },
            { key: "medium", label: "Medium" },
            { key: "high", label: "High" },
          ]}
          value={form.priority}
        />
        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Due date
          </span>
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            onChange={(event) => updateField("dueDate", event.target.value)}
            type="date"
            value={form.dueDate}
          />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? "Saving..." : editingTask ? "Update task" : "Create task"}
        </button>
        {editingTask && (
          <button
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function SelectField({ label, onChange, options, value }) {
  return (
    <label>
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <select
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TaskBoard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const groupedTasks = useMemo(() => {
    return STAGES.reduce((grouped, stage) => {
      grouped[stage.key] = tasks.filter((task) => task.stage === stage.key);
      return grouped;
    }, {});
  }, [tasks]);

  const fetchTasks = async (showLoader = true) => {
    if (showLoader) {
      setIsLoading(true);
    }

    try {
      const data = await apiRequest("/tasks?limit=50");
      setTasks(data.tasks || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadTasks = async () => {
      try {
        const data = await apiRequest("/tasks?limit=50");
        if (!ignore) {
          setTasks(data.tasks || []);
        }
      } catch (error) {
        if (!ignore) {
          toast.error(error.message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (taskId) => {
    try {
      await apiRequest(`/tasks/${taskId}`, { method: "DELETE" });
      toast.success("Task deleted");
      fetchTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
      toast.success("Signed out");
      onLogout();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              INDPRO
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Task Manager
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
              {user?.fullName || user?.username || user?.email}
            </div>
            <button
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <TaskForm
          key={editingTask?._id || "new-task"}
          editingTask={editingTask}
          onCancel={() => setEditingTask(null)}
          onSaved={() => {
            setEditingTask(null);
            fetchTasks();
          }}
        />

        {isLoading ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Loading tasks...
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {STAGES.map((stage) => (
              <section
                className="min-h-80 rounded-xl border border-slate-200 bg-slate-50 p-3"
                key={stage.key}
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <h2 className="text-sm font-semibold text-slate-900">
                    {stage.label}
                  </h2>
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-500">
                    {groupedTasks[stage.key]?.length || 0}
                  </span>
                </div>
                <div className="space-y-3">
                  {groupedTasks[stage.key]?.length ? (
                    groupedTasks[stage.key].map((task) => (
                      <TaskCard
                        key={task._id}
                        onDelete={() => handleDelete(task._id)}
                        onEdit={() => setEditingTask(task)}
                        task={task}
                      />
                    ))
                  ) : (
                    <p className="rounded-lg border border-dashed border-slate-200 bg-white p-4 text-center text-sm text-slate-400">
                      No tasks
                    </p>
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function TaskCard({ onDelete, onEdit, task }) {
  const priorityClass = {
    low: "bg-sky-50 text-sky-700",
    medium: "bg-amber-50 text-amber-700",
    high: "bg-rose-50 text-rose-700",
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-5 text-slate-950">
          {task.title}
        </h3>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${priorityClass[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>
      {task.description && (
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {task.description}
        </p>
      )}
      {task.dueDate && (
        <p className="mt-3 text-xs font-medium text-slate-500">
          Due {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}
      <div className="mt-4 flex gap-2">
        <button
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          onClick={onEdit}
          type="button"
        >
          Edit
        </button>
        <button
          className="rounded-lg border border-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
          onClick={onDelete}
          type="button"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await apiRequest("/auth/current-user");
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-medium text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      {user ? (
        <TaskBoard onLogout={() => setUser(null)} user={user} />
      ) : (
        <AuthScreen onAuthenticated={setUser} />
      )}
    </>
  );
}

export default App;
