const dotenv = require('dotenv').config()
const mongoose = require("mongoose")

// conexcion mongo
const dbConect = async () => {
    const DB_URI = process.env.MONGODB_URI
    try {
        await mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('base de datos conectada'))
        .catch(err => console.log(err))
    } catch (error) {
        console.log(error);
    }
}

module.exports = {dbConect}