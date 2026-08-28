require('dotenv').config();
const express = require('express');

const connectDB = require('./data/db');
const cors = require('cors');
const authRoutes = require('./Routes/authRoute');
const userRoutes = require('./Routes/userRoute');
const tasksRoutes = require('./Routes/taskRoutes');
const aiRoutes = require('./Routes/aiRoute');

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});