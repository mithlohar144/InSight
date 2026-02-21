const mongoose = require('mongoose');


async function connectDB() {
    await mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to DB'))
}


module.exports = connectDB;