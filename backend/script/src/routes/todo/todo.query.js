const { promiseDb } = require("../../config/db");

async function getAllTodos(userId) {
  const [rows] = await promiseDb.query(
    "SELECT * FROM todo WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );
  return rows;
}

async function getTodoById(id, userId) {
  const [rows] = await promiseDb.query(
    "SELECT * FROM todo WHERE id = ? AND user_id = ?",
    [id, userId]
  );
  return rows[0];
}

async function createTodo(userId, title, description, priority = "low") {
  const [result] = await promiseDb.query(
    "INSERT INTO todo (user_id, title, description, priority, completed) VALUES (?, ?, ?, ?, 0)",
    [userId, title, description, priority]
  );
  return result.insertId;
}

async function updateTodo(id, userId, fields) {
  const { title, description, priority, completed } = fields;

  const [result] = await promiseDb.query(
    "UPDATE todo SET title = ?, description = ?, priority = ?, completed = ? WHERE id = ? AND user_id = ?",
    [title, description, priority, completed ? 1 : 0, id, userId]
  );
  return result.affectedRows;
}

async function deleteTodo(id, userId) {
  const [result] = await promiseDb.query(
    "DELETE FROM todo WHERE id = ? AND user_id = ?",
    [id, userId]
  );
  return result.affectedRows;
}

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
