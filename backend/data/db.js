const mongoose = require('mongoose');

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        const connStr = process.env.MONGO_URI || 'mongodb+srv://kneeltogenius_db_user:zg401CqAJDd60DQE@prod.ghklwdw.mongodb.net/?appName=PROD';
        await mongoose.connect(connStr);
        console.log("mongodb connected...");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

module.exports = connectDB;