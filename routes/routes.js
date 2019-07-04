'use strict'

const Express = require('express');
const Passport = require('passport');
const JWT = require('jsonwebtoken');
const router = Express.Router();

//When the user sends a post request to this route, passport authenticates the user based on the
//middleware created previously
router.post('/signup', Passport.authenticate('signup', { session: false }), async (req, res, next) => {
  return res.json({
    success: true
  });
});

router.get('/login', Passport.authenticate('login', { session: false }), async (req, res, next) => {
  let user = req.user
  req.login(req, { session: false }, async (error) => {
    if (error) return next(error)
    //We don't want to store the sensitive information such as the
    //user password in the token so we pick only the id
    const body = { id: user.id };
    //Sign the JWT token and populate the payload with the user email and id
    const token = JWT.sign({ user: body }, 'a8729721a1e3e23cb890767e9a56b958', { expiresIn: "14 days" });
    //Send back the token to the user
    return res.json({ token });
  });
});

module.exports = router;