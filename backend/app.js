require('dotenv').config();
const express = require('express');

const connectDB = require('./data/db');
const cors = require('cors');
const authRoutes = require('./Routes/authRoute');
const userRoutes = require('./Routes/userRoute');
const tasksRoutes = require('./Routes/taskRoutes');

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/auth' , authRoutes);
app.use('/api/user' , userRoutes);
app.use('/api/tasks' , tasksRoutes);

app.listen(3000 , () => {
    console.log("Server is running...");
});