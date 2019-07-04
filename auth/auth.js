'use strict'

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;

const ErrorHandler = require('../db/lib/errorHandler')

module.exports = database => {
  //Create a passport middleware to handle user registration
  passport.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
      //Save the information provided by the user to the the database
      const db = await database;
      let user = await db.User.createUser(req.body);
      //Send the user information to the next middleware
      return done(null, user);
    } catch (error) {
      ErrorHandler(error, done)
    }
  }));

  //Create a passport middleware to handle User login
  passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const db = await database;
      let user = await db.User.findByEmail(email)
      await user.authenticate(password);
      return done(null, user);
    } catch (error) {
      ErrorHandler(error, done)
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