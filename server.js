const express = require('express')
const app = express()
const port = 8000;

const usersService = require('../users/index');

const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
//    app.use(app.router);

app.listen(port, () => console.log(`Listening on port ${port}`));


// app.get('/', (req, res) => res.send('Hola'));
// app.post('/', (req, res) => res.send('Got a POST request'));

app.post('/api/auth/login', (req, res) => {  
    console.log(req.body.email);
    usersService(config).then(response => {
        response.Users.authenticateUser(req.body.email, req.body.password).then(same => res.send(same));
    })

} );

passport.use('login', new localStrategy({
    usernameField : 'email',
    passwordField : 'password'
  }, async (email, password, done) => {
    try {
      //Find the user associated with the email provided by the user
      const users = await usersService(config).Users;
      const user = await usersService.findByEmail(email);
      if( !user ){
        //If the user isn't found in the database, return a message
        return done(null, false, { message : 'User not found'});
      }
      //Validate password and make sure it matches with the corresponding hash stored in the database
      //If the passwords match, it returns a value of true.
      const validate = await users.authenticateUser(email, password);
      if( !validate ){
        return done(null, false, { message : 'Wrong Password'});
      }
      //Send the user information to the next middleware
      return done(null, user, { message : 'Logged in Successfully'});
    } catch (error) {
      return done(error);
    }
  }));

const config = {
    database: process.env.DB_NAME || 'rappiclone_users',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '123456789',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    setup: false,
    logging: false
}   




