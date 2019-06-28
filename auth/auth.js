const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const usersService = require('../usersService');

//Create a passport middleware to handle user registration
passport.use('signup', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    //Save the information provided by the user to the the database
    const uService = await usersService();
    console.log('Enviando a db');
    // console.log(req);
    console.log(req.body);
    const user = await uService.Users.createUser(req.body);
    console.log('recibido de db');
    console.log(user);
    //Send the user information to the next middleware
    return done(null, user, { message: 'Prueba de req.authinfo' });
    console.log('ejecuta después del done');
  } catch (error) {
    console.log('EMpezando error:')
    console.log(error)
    if (error.errors) {
      if (error.errors[0].message === 'phone must be unique') return done({ type: 'phone', message: 'Error al registrarte: El teléfono ingresado ya está registrado', status: 401 });
      else if (error.errors[0].message === 'email must be unique') return done({ type: 'email', message: 'Error al registrarte: El email ingresado ya está registrado', status: 401 });
      else return done({ type: 'unknown', message: 'Error en el servidor. Por favor intente más tarde', status: 500 });
    }
    else return done({ type: 'unknown', message: 'Error en el servidor. Por favor intente más tarde', status: 500 });
  }
}));

//Create a passport middleware to handle User login
passport.use('login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    //Find the user associated with the email provided by the user
    const uService = await usersService();
    const user = await uService.Users.findByEmail(email);
    if (!user) {
      //If the user isn't found in the database, return a message
      return done(null, false, { message: 'User not found' });
    }
    //Validate password and make sure it matches with the corresponding hash stored in the database
    //If the passwords match, it returns a value of true.
    const validate = await uService.Users.authenticateUser(email, password);
    if (!validate) {
      console.log('validacion fallida')
      return done(null, false, { message: 'Wrong Password' });
    }
    //Send the user information to the next middleware
    return done(null, user, { message: 'Logged in Successfully' });
  } catch (error) {
    return done(error);
  }
}));

//Create a passport middleware to handle user name update
passport.use('updateName', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    console.log('fghjk,l'+req);
    console.log(req.query);
    const uService = await usersService();1
    let user = await uService.Users.updateName(4, 'Nestor Jesus');
    console.log(user);
    console.log('Nombre cambiado');
    return done(null, { name: 'Nestor Jesus' });
  } catch (error) {
    console.log(error);
    return done({ type: 'unknown', message: 'Error en el servidor. Por favor intente más tarde', status: 500 })
  }
}));


const JWTstrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  passReqToCallback: true,

  //secret we used to sign our JWT
  secretOrKey: 'top_secret_asjhkasjdalksjdaksjdlaksjdoaisjd',
  //we expect the user to send the token as a query paramater with the name 'secret_token'
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (req, token, done) => {
  try {
    //Pass the user details to the next middleware
    console.log('try');
    return done(null, token.user);
  } catch (error) {
    console.log('catch');
    return done(error);
  }
}));