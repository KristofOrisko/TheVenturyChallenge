'use strict'

require('dotenv').config();
const request = require('request-promise');
const schemas = require('./../data_storage/db_schemas/index_schemas');
const response_map = require('./../response_map');
const mongoose = require('mongoose');
const User = mongoose.model('User');

/** MessageService class for handling messages and responses
* @class MessageService
*/
class MessageService {
  constructor() {
    /**
    * Loading basic response. It is send when message does not contain any right command.</br>
    * With options: </br>
    * - <b>Help</b> - Show help text</br>
    * - <b>Reset</b> - Reset user stats in database</br>
    * - <b>A joke please </b> - Sending joke to user</br>
    */
    this.response = response_map.basic;
  }

  /**
  * - Handles text message from user </br>
  * - calls <b>callSendAPIWithJoke()</b> or <b>callSendAPI()</b>
  * @param {string} sender_psid = The id of the facebook user
  * @param {Object} received_message = The text message from facebook messenger
  */

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

  /**
  * Handles text message from user </br>
  * Postback options: </br>
  * - <b>Help</b> - Show help text</br>
  * - <b>Reset</b> - Reset user stats in database</br>
  * - <b>A joke please </b> - Sending joke to user</br>
  *
  * Sets the right response and </br>
  * calls <b>callSendAPIWithJoke()</b> or <b>callSendAPI()</b>
  * @param {string} sender_psid = The id of the facebook user
  * @param {Object} received_postback = The message with payload of the postback from facebook messenger
  */
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

  /**
  * - Sending POST request with response to FB messaging API
  * @param {string} sender_psid = The id of the facebook user
  */

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

  /**
  * - Sending POST request with response and a joke to FB messaging API </br>
  * - Checks if the user could get a joke or not </br>
  * - Updates user profile and sets the right response
  * @param {string} sender_psid = The id of the facebook user
  */
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


  /**
  * - Get a random joke from an API
  * @return {string} joke = The random joke
  */
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
