const mongoose = require('mongoose');

const mongoDB = `mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/test?retryWrites=true&w=majority`;

//const mongoDB = `mongodb://${process.env.DB_ADMIN}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
//mongodb+srv://db_admin:<password>@cluster0-h5hct.mongodb.net/test?retryWrites=true&w=majority
const db = mongoose.connect(mongoDB, {useNewUrlParser: true});

module.exports = db;
