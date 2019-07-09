const mongoose = require('mongoose');

const mongoDB = `mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/test?retryWrites=true&w=majority`;

const db = mongoose.connect(mongoDB, {useNewUrlParser: true});

module.exports = db;
