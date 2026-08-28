const mongoose = require('mongoose');

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prodApp';
        await mongoose.connect(connStr);
        console.log("mongodb connected...");
    } catch (error) {
        console.log(error);
    }
};

module.exports = connectDB;