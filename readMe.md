Facebook chatbot in Node.js

To before launch we will few things to be done:
- creating a .env file with variables:
    - PORT
    - PAGE_ACCESS_TOKEN - fb business page access token
    - DB_URL - MongoDB url
    - DB_NAME - the name of the database
    - DB_PORT - MongoDBs port to acces it
    - DB_ADMIN - database account name
    - DB_PASSWORD - password to account name

- create a Heroku account and download Heroku CLI
- now we can deploy it to Heroku with these commands:
    - 'git add .'
    - 'git commit -am "some message about the commit" '
    - 'git remote origin heroku master' - set up remote
    - 'git push heroku master'

Folder architecture:
  - data_storage/: - database related files
    - db_index.js - database connection
    - db_schemas/: - database models/schemas folder
      - index_schemas.js - schemas loader
      - people_schema.js - People schema for the database

  - routes/ - cointains express router and the controllers
    - router.js - express router with routes
    - controllers/
      - webhook_post.js - if we got a message from someone we check if she/he is in our database, if not we upload him. Than depending on the message type we handling the message and setting up a correct response to it.
      - webhook_get.js - this route is for verification of the service

  - services - business logic implementation
    - message_service.js - class where we set up the correct response
      - implemented methods:
        - handleMessage() - for handling text messages
        - handlePostback() - for handling postbacks like buttons
        - callSendAPI() - for sending message to facebook
        - callSendAPIWithJoke - for sending message to facebook with joke
        - getRandomJoke() - get a random joke from an other API
  - test - Unit test for the MessageService class
  - index.js - loading and starting the service
