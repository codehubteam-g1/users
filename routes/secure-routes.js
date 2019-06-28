const express = require('express');
const usersLib = require('../lib/users')


module.exports = function (database) {
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

  router.post('/updateName', async (req, res, next) => {
    const db = await database;
    let users = await usersLib(db);
    await users.updateName(req, next);
    res.json({
      finished: true
    });
  });

  router.post('/updatePhone', async (req, res, next) => {
    const db = await database;
    let users = await usersLib(db);
    await users.updatePhone(req, next);
    res.json({
      finished: true
    });
  });

  router.post('/updateProfilePicture', async (req, res, next) => {
    const db = await database;
    let users = await usersLib(db);
    await users.updateProfilePicture(req, next);
    res.json({
      finished: true
    });
  });

  return router;
}