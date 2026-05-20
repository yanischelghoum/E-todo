const { promiseDb } = require("../../config/db");

const getUserById = async (id) => {
  const [rows] = await promiseDb.query(
    "SELECT id, username, firstname, lastname, email, phone, created_at, updated_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0];
};

const getUserByEmail = async (email) => {
  const [rows] = await promiseDb.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
};

const getUserByUsername = async (username) => {
  const [rows] = await promiseDb.query(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );
  return rows[0];
};

const updateUser = async (id, firstname, lastname, email, phone) => {
  const [result] = await promiseDb.query(
    "UPDATE users SET firstname = ?, lastname = ?, email = ?, phone = ? WHERE id = ?",
    [firstname, lastname, email, phone, id]
  );
  return result.affectedRows;
};

const deleteUser = async (id) => {
  const [result] = await promiseDb.query(
    "DELETE FROM users WHERE id = ?",
    [id]
  );
  return result.affectedRows;
};

module.exports = {
  getUserById,
  getUserByEmail,
  getUserByUsername,
  updateUser,
  deleteUser,
};
