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

- To see documentation:
    - 'npm install'
    - 'documentation serve index.js'
