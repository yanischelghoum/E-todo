require('dotenv').config();
const express = require('express');
const { testConnection } = require('./config/db.js');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const loginMiddleware = require('./middleware/login');
const registerMiddleware = require('./middleware/register');
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:8080", 
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'E-TODO API is running!',
    status: 'ok'
  });
});

app.post('/login', loginMiddleware, (req, res) => {
  console.log("LOGIN OK");
  res.status(201).json({ msg: 'User logged in' });
});


app.post('/register', registerMiddleware, (req, res) => {
  console.log("INSCRIPTION OK");
  res.status(201).json({ msg: 'User registered' });
});


const todoRoutes = require('./routes/todo/todo.js');
app.use('/todos', todoRoutes);

const userRoutes = require('./routes/user/user.js');
app.use('/user', userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function waitForDatabase(maxRetries = 20, delay = 3000) {
  for (let i = 1; i <= maxRetries; i++) {
    console.log(`Attempt ${i}/${maxRetries} - Connecting to database...`);  
    
    const connected = await testConnection();
    if (connected) {
      console.log('Database ready!');
      return true;
    }
    
    if (i < maxRetries) {
      console.log(`Waiting ${delay/1000}s before retry...`);  
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.error('Could not connect to database after', maxRetries, 'attempts');
  process.exit(1);
}

app.listen(PORT, async () => {
  console.log('=================================');
  console.log(`Server running on port ${PORT}`);  
  console.log('=================================');
  
  await waitForDatabase();
  
  console.log('=================================');
  console.log('Server ready to accept requests');
  console.log('=================================');
});