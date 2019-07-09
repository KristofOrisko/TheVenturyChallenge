'use strict'

require('dotenv').config();
const request = require('request-promise');
const schemas = require('./../data_storage/db_schemas/index_schemas');
const response_map = require('./../response_map');
const mongoose = require('mongoose');
const User = mongoose.model('User');


class MessageService {
  constructor() {
    // incase Random message sent to our page the response is Info with options:
    // A joke please - button
    // Reset - button
    // Help - button
    this.response = response_map.basic;
  }

  async handleMessage(sender_psid, received_message) {

    try{

      // IF they are looking for joke response set to Joke response
      if (received_message.text === 'joke') {

        // Get a random joke
        let joke = await this.getRandomJoke();

        // Set new joke to response
        let response_with_joke = response_map.joke;
        response_with_joke.attachment.payload.text = joke;
        this.response = response_with_joke;

      }

      received_message.text === 'joke' ? await this.callSendAPIWithJoke(sender_psid) : await this.callSendAPI(sender_psid);

    } catch(e){
      console.log(e)
    }

  }

   async handlePostback(sender_psid, received_postback){

     try{
       // Get the payload for the postback
       let payload = await received_postback.payload;

       // Set the response based on the postback payload
       if (payload === 'joke') {

         // Set the new joke response
         let joke = await this.getRandomJoke();
         let response_with_joke = response_map.joke;
         response_with_joke.attachment.payload.text = joke;
         this.response = response_with_joke;

       } else if (payload === 'help') {

         // Set help response
         this.response = response_map.help;

       } else if (payload === 'reset') {

         // update the user counter and tenth_joke_timestamp
         await User.update({sender_psid} , {joke_count: 1,tenth_joke_timestamp: -new Date() + 7*24*60*60*1000 });

         // Set response to reset
         this.response = response_map.reset;

       }

       payload === 'joke' ? await this.callSendAPIWithJoke(sender_psid) : await this.callSendAPI(sender_psid);

     } catch(e){
       console.log(e)
     }

  }

  async callSendAPI(sender_psid){

    try {

      // Construct the message body
      let request_body = {
        "recipient": {
          "id": sender_psid
        },
        "message": this.response
      }

      // Send the HTTP request to the Messenger Platform
      await request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
      })


    } catch (e) {
      console.log(e)
    }

  }

  async callSendAPIWithJoke(sender_psid) {

    try {

      // Get the user profile for later use
      let user = await User.findOne({ sender_psid });

      // Check if the difference between Now and the user 10th joke is less then 24h
      if( ((new Date() - new Date(user.tenth_joke_timestamp).getTime()) < 24*60*60*1000) )  {

        // Set response to reached tenth joke
        this.response = response_map.reached_ten_joke;

      } else if ( user.joke_count > 10 ){

        // User reached the 10th joke so they tenth joke timestamp is updated with the current time and the joke_count is set to 0
        await User.update({sender_psid},{tenth_joke_timestamp: new Date(),joke_count: 0});

        // Set response to reached tenth joke
        this.response = response_map.reached_ten_joke;

      } else {

        // Update the user profile for amount of jokes if joke is sent
        await User.update( {sender_psid}, {$inc: {joke_count: 1} });

      }

      await this.callSendAPI(sender_psid);

    } catch (e) {
      console.log(e);
    }

  }

  async getRandomJoke(){

    try {
      let joke;
      // Get request fr the joke api with random option
      const joke_result = await request('http://api.icndb.com/jokes/random');
      const joke_json = await JSON.parse(joke_result)
      joke = await joke_json.value.joke;
      return joke

    } catch (e) {
      console.log(e)
    }
  }

}

module.exports = MessageService;
