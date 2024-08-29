const mongoose = require('mongoose');
require("dotenv").config()
const connectDB = async () => {
    try {
        const conn = mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB;