# BugBook Journal (Server)

App Live at https://bugbookjournal.com

## Public Endpoints 
- POST /login
    - supplied with valid login credentials, will return JWT 
- POST /users
    - registers a new user to the server 


## Private Endpoints (require registration)

### Entries
- GET /entries
   - returns all daily entries for the logged in user
- POST /entries
    - posts a new daily entry for the logged in user to the server
- PATCH /entries/:id
    - updates specified daily entry for the logged in user
- DELETE /entries/:id
    - deletes specified daily entry for the logged in user


### Observations 
- GET /observations
    - returns all observations for the logged in user
- POST /observations
    - posts a new observation for the logged in user
- DELETE /observation/:id
    - deletes specified observatoin for the logged in user. 


## Technology Used 
- Express
- Knex
- PostgreSQL
- CORS 
- Helmet
- bcrpyt 


Hosted on Heroku

