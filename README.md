# Groupomania P7 #
This project uses NodeJs, Express and Mysql for the backend, and VueJS 2.6. 
You need to have Node, npm, and VueJs installed locally on your machine. ( Node Version 14.18.0 recommanded)
## PREREQUISITES
Please clone this repository.

### DB
Create a mysql DB named groupomania

### ENV
create a .env file with that kind of model and customize it
``` 
DB_HOST=localhost
DB_USER=<user name>
DB_PASSWORD=<user password>
DB_NAME=groupomania
JWT_RAND_SECRET=<your token>

```
### Backend

 ```
$ cd api/
$ npm install
$ nodemon
```

### Frontend
Run the command :

 ```
$ cd client/
$ npm run serve
```
The app's frontend is visible on http://localhost:8081/.

### CREATE USER

Then a create a user fill in the Sign up form, login and enjoy 

