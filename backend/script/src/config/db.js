const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promiseDb = db.promise();

const testConnection = async () => {
  try {
    const [rows] = await promiseDb.query('SELECT 1 as test');
    console.log('Database connected successfully!');
    return true;
  } catch (error) {
    console.error('Database connection failed!', error);
    return false;
  }
};

module.exports = { promiseDb, testConnection };
