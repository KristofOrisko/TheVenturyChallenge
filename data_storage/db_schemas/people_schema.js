'use strict';

const db = require('./../db_index');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({

    timestamp:            {type: Date, default: Date.now , required: true},
    sender_psid:          {type: String , required: true },
    joke_count:           {type: Number , required: true },
    tenth_joke_timestamp: {type: Date , default: -new Date() + 7*24*60*60*1000 }

});

const User = mongoose.model('User', userSchema );

module.exports = User;
