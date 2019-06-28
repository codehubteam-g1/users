const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

//When the user sends a post request to this route, passport authenticates the user based on the
//middleware created previously
router.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
  console.log(req.authInfo)
  return res.json({
    message: 'Signup successful',
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      phone: req.user.phone
    }
  });
});

router.post('/updateName', passport.authenticate('updateName', { session: false }), async (req, res, next) => {
  console.log('algo');
  return res.json({
    name: 'testoo'
  });
});

router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err) {
        const error = new Error('Ocurrió un error en el servidor. Por favor inténtalo de nuevo más tarde');
        error.status = 500;
        return next(error);
      }
      else if (!user) {
        console.log('pruebasss');
        console.log(user.password);
        // console.log('email ' + email);
        // console.log('password ' + password);
        const error = new Error('El email o contraseña ingresados son incorrectos');
        error.status = 401;
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error)
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        const body = { id: user.id };
        //Sign the JWT token and populate the payload with the user email and id
        const token = jwt.sign({ user: body }, 'top_secret_asjhkasjdalksjdaksjdlaksjdoaisjd', {expiresIn: "14 days"});
        //Send back the token to the user
        return res.json({ token });
      });
    } catch (error) {
      console.log('error');
      return next(error);
    }
  })(req, res, next);
});

module.exports = router;