const express = require("express");
const router = express.Router();

const {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("./todo.query");
const auth = require("../auth/auth");

router.get("/", auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const todos = await getAllTodos(userId);
    res.json(todos);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const todo = await getTodoById(req.params.id, userId);

    if (!todo) {
      return res.status(404).json({ message: "task not found" });
    }

    res.json(todo);
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "title and description required" });
    }

    const userId = req.user.id;
    const todoId = await createTodo(
      userId,
      title,
      description,
      priority || "low"
    );
    const newTodo = await getTodoById(todoId, userId);

    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, description, priority, completed } = req.body;

    const existing = await getTodoById(req.params.id, userId);
    if (!existing) {
      return res.status(404).json({ message: "task not found" });
    }

    const fields = {
      title: title ?? existing.title,
      description: description ?? existing.description,
      priority: priority ?? existing.priority,
      completed:
        typeof completed === "boolean" ? completed : !!existing.completed,
    };

    const affected = await updateTodo(req.params.id, userId, fields);
    if (affected === 0) {
      return res.status(404).json({ message: "task not found" });
    }

    const updatedTodo = await getTodoById(req.params.id, userId);
    res.json(updatedTodo);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const affected = await deleteTodo(req.params.id, userId);

    if (affected === 0) {
      return res.status(404).json({ message: "task not found" });
    }

    res.json({ message: "task deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
