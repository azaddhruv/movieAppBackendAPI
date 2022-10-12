1---- Project Name - movieReviewBackendAPI
==========================================

2---- What this application does =>

a. The user signs up and sets up a password.

b. The user can logs in using email and password. Maximum password attempts are 4 after which the account gets locked for 30 minutes.

c. The user provides basic information about themselves such as name, age, list of favourite movies and rating out of 5 for each movie.

d. The user can search for a movie to fetch the average rating.

d1. Average rating is the average of the ratings provided by users for a particular movie 
d2. The user might not enter the exact movie name, the search results should show all relevant movies.

e. The user can edit the rating for particular movies and the history of changes is required to be maintained.
======================================================================================

3---- Technologies Used =>

a. Node.js
b. Express.js
c. MongoDB
d. Joi Validators
e. express-session
f. mongoose
===============================

4---- How to Run the Project =>

To run the project just cd into the project directory.

First you will need to run the command "npm install" to install all the dependencies.

Then run the project by "node app.js" or "nodemon app.js".

5---- How to use the Project =>

You can use postman for sending requests and receiving data.
The data format i used for this project is JSON.
You will send the data in JSON format and also receive data in JSON format.


a. First you will need to signup for that send data with name as string, email as string, age as number, password as string and favouriteMovies as Array.
favoriteMovies will be an array of objects with key of name as string and rating as number.
Send a post request to "/sigin" and you will get a success or failure message.
Example-
{
  "name": "Doe",
    "age": 20,
    "email": "doe@gmail.com",
    "password": "123456",
    "favoriteMovies": [
        {"name": "Titanic", "rating": 5},
        {"name": "Delhi Belly", "rating": 3},
        {"name": "The Losers", "rating": 5}
    ]
}


b. For Signin you will need email and password.
send a post request to "/signin" and you will get a success or failure
Example-
{
    "email" : "doe@gmail.com",
    "password" : "12345"
}

c. For searching a movie send the name of movie under movie which will be a string.
send a post request to "/search" and you will get a success or failure
Example-
{
    "movie": "Delhi Belly"
}

d. For updating a movie rating you will need to be signed in, to update a movie eneter the name of movie under name as string and the updated rating as rating.
Send a patch request to "/update" and you will get a success or failure.
Example-
{
    "name": "Delhi Belly",
    "rating": 2
}

e. For logging out just send a post request to "/logout".
==============================================================================


Thank You
