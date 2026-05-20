"use client";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../../components/Protectroutes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, CheckCircle2, Circle, Trash2, Loader2, Pencil } from "lucide-react";

type Priority = "low" | "medium" | "high";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
}

export default function DashboardPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("medium");
  const [error, setError] = useState("");;
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<Priority>("medium");
  const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:3000/todos", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.msg || "Unable to load tasks.");
          return;
        }

        setTasks(data as Task[]);
      } catch {
        setError("Unable to contact server.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchTasks();
    else {
      setLoading(false);
      setTasks([]);
    }

  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newTitle.trim()) {
      setError("Please enter a task title.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          priority: newPriority
        }),
      });


      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Unable to create task.");
        return;
      }

      setTasks((prev) => [...prev, data as Task]);
      setNewTitle("");
      setNewDescription("");
      setNewPriority("medium");
    } catch {
      setError("Unable to contact server.");
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
  };


  const toggleTask = async (task: Task) => {
    setError("");

    try {
      const res = await fetch(`http://localhost:3000/todos/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          priority: task.priority,
          completed: !task.completed,
        }),
      });


      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Unable to update task.");
        return;
      }

      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
      );
    } catch {
      setError("Unable to contact server.");
    }
  };

  const deleteTask = async (taskId: number) => {
    setError("");

    try {
      const res = await fetch(`http://localhost:3000/todos/${taskId}`, {
        method: "DELETE",
        headers: {
        Authorization: token ? `Bearer ${token}` : "",
        },
      });


      if (!res.ok) {
        const data = await res.json();
        setError(data.msg || "Unable to delete task.");
        return;
      }

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch {
      setError("Unable to contact server.");
    }
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    setError("");

    try {
      const res = await fetch(`http://localhost:3000/todos/${editingTask.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          priority: editPriority,
          completed: editingTask.completed,
        }),
      });

    const data = await res.json();

    if (!res.ok) {
      setError(data.msg || "Unable to update task.");
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === editingTask.id ? (data as Task) : t))
    );
    setEditingTask(null);
  } catch {
    setError("Unable to contact server.");
  }
};


  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;

  const priorityLabel = (p: Priority) =>
    p === "high" ? "High" : p === "medium" ? "Medium" : "Low";

  const priorityClasses = (p: Priority) => {
    if (p === "high") return "border-red-500/60 text-red-300 bg-red-500/10";
    if (p === "medium") return "border-amber-400/60 text-amber-200 bg-amber-400/10";
    return "border-emerald-400/60 text-emerald-200 bg-emerald-400/10";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
       <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-light tracking-[0.25em] uppercase">
            Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Manage your tasks in a calm, focused workspace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="text-xs sm:text-sm px-4 py-2 rounded border border-slate-600 text-slate-200 hover:bg-slate-800 tracking-[0.2em] uppercase"
          >
            Profile
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs sm:text-sm px-4 py-2 rounded border border-slate-600 text-slate-200 hover:bg-slate-800 tracking-[0.2em] uppercase"
          >
            Logout
          </button>
        </div>
      </header>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 shadow-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Total
            </p>
            <p className="text-3xl font-semibold mt-2">{total}</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 shadow-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Active
            </p>
            <p className="text-3xl font-semibold mt-2">{active}</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 shadow-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Completed
            </p>
            <p className="text-3xl font-semibold mt-2">{completed}</p>
          </div>
        </section>

        <section className="bg-slate-900/80 border border-slate-700 rounded-2xl shadow-xl p-6 space-y-4">
          <h2 className="text-lg font-medium tracking-[0.2em] uppercase text-slate-200">
            New Task
          </h2>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-all"
                placeholder="Task title"
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Priority)}
                className="bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-all"
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </select>
            </div>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={3}
              className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-all resize-none"
              placeholder="Add a short description (optional)"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 text-sm font-medium tracking-[0.15em] uppercase shadow-lg shadow-slate-900/40 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </form>
        </section>

        {error && (
          <p className="text-sm text-red-400 text-center">{error}</p>
        )}

        {editingTask && (
          <section className="bg-slate-900/80 border border-slate-700 rounded-2xl shadow-xl p-6 space-y-4">
            <h2 className="text-lg font-medium tracking-[0.2em] uppercase text-slate-200">
              Edit Task
            </h2>
            <form onSubmit={saveEdit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-all"
                  placeholder="Task title"
                />
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as Priority)}
                  className="bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-all"
                >
                  <option value="low">Low priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="high">High priority</option>
                </select>
              </div>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-all resize-none"
                placeholder="Description"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 text-sm font-medium tracking-[0.15em] uppercase shadow-lg shadow-slate-900/40 transition-all"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-800 px-4 py-2 text-sm tracking-[0.15em] uppercase"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}


        <section className="bg-slate-900/80 border border-slate-700 rounded-2xl shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium tracking-[0.2em] uppercase text-slate-200">
              Your Tasks
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10 text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading tasks...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p className="text-sm">
                No tasks yet. Start by creating your first one above.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-start justify-between gap-4 bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleTask(task)}
                      className="mt-1 text-blue-400 hover:text-blue-300"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className={`text-sm font-medium ${
                            task.completed
                              ? "line-through text-slate-500"
                              : "text-slate-100"
                          }`}
                        >
                          {task.title}
                        </h3>
                        <span
                          className={`text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${priorityClasses(
                            task.priority
                          )}`}
                        >
                          {priorityLabel(task.priority)}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-xs text-slate-400 mt-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => startEdit(task)}
                    className="mt-1 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="mt-1 text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
