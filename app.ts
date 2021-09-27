import express from 'express';
import mongoose from 'mongoose';
const connectDB = require('./config/db');

//Create Express server
const app = express();

// Connect Database
connectDB();

//Create Mongoose Model
const todoSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
});

const ToDoModel = mongoose.model('ToDo', todoSchema);

//Init Middleware
app.use(express.json());

app.get('/', (req: any, res: any) => {
  res.send('Hello from Express Server (TODO List App)!!');
});

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/todos', require('./routes/api/todos'));

const PORT = process.env.PORT || 8888;

// Start the server
app.listen(PORT, () => console.log('Express server started on port ' + PORT));
