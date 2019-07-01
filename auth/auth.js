const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;

module.exports = database => {
  //Create a passport middleware to handle user registration
  passport.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
      //Save the information provided by the user to the the database
      let db = await database;
      let users = await db.Users;
      let user = await users.createUser(req.body);
      //Send the user information to the next middleware
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  //Create a passport middleware to handle User login
  passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      let db = await database;
      let users = await db.Users;
      //Find the user associated with the email provided by the user
      let user = await users.findByEmail(email);
      validate = await users.authenticateUser(email, password);
      //Send the user information to the next middleware
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  //This verifies that the token sent by the user is valid
  passport.use(new JWTstrategy({
    passReqToCallback: true,
    //secret we used to sign our JWT
    secretOrKey: 'a8729721a1e3e23cb890767e9a56b958',
    //we expect the user to send the token as a query paramater with the name 'secret_token'
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
  }, async (req, token, done) => {
    try {
      //Pass the user details to the next middleware
      return done(null, token.user);
    } catch (error) {
      return done(error);
    }
  }));

  return passport;
}