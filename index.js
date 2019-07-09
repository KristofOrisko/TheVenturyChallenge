'use strict';
require('dotenv').config();

// Imports dependencies and set up http server
const express = require('express');
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const helmet = require('helmet');
const router = require('./routes/router');
const app = express(); // creates express http server


app.use(expressSanitizer());
app.use(bodyParser.json());
app.use(helmet())
app.use('/', router );

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
