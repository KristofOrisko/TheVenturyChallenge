'use strict';

const express = require('express');
const router = express.Router();

const webhook_post = require('./controllers/webhook_post');

const webhook_get =  require('./controllers/webhook_get');

router.post('/webhook', webhook_post );

router.get('/webhook', webhook_get );

module.exports = router;
