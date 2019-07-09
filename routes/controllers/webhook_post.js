const MessageService = require('./../../services/message_service');
//const helper = require('./../../helpers');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const request = require('request-promise');

module.exports = async (req, res) => {

  let body = await req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach( async (entry) => {

      // Gets the body of the webhook event
      let webhook_event = await entry.messaging[0];
      //console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = await webhook_event.sender.id;
      //console.log('Sender PSID: ' + sender_psid);

      const user = await User.findOne({sender_psid:sender_psid},{_id:1});

      if(!user) {

        const registerUser = await new User({

          sender_psid:          sender_psid,
          joke_count:           1,

        });

        const userSave = await registerUser.save();

      }

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {

        let messageService = new MessageService();
        await messageService.handleMessage(sender_psid, webhook_event.message);

      } else if (webhook_event.postback) {

        let messageService = new MessageService();
        await messageService.handlePostback(sender_psid, webhook_event.postback);

      }

    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

}
