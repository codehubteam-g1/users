const express = require('express');
const users = require('../lib/users')


module.exports = function (db) {
  const router = express.Router();

  //Lets say the route below is very sensitive and we want only authorized users to have access

  //Displays information tailored according to the logged in user
  router.get('/home', (req, res, next) => {
    //We'll just send back the user details and the token
    res.json({
      message: 'You made it to the secure route',
      user: req.user
    })
  });

  router.get('/', (req, res, next) => {
    //We'll just send back the user details and the token
    res.json({
      user: req.user
    })
  });

  // router.post('/updateName', passport.authenticate('updateName', async (req, res, next) => {
  //   res.json({
  //     name : req.name
  //   })
  // }));

  router.post('/updateName', async (req, res, next) => {
    try {
      const Users = await users();
      let answer = await Users.updateName(req, next);
      console.log(answer);
      res.json({
        finished: true
      })
    } catch (error) {
      console.log('lanzando error')
      next(error);
    }
  });

  return router;
}