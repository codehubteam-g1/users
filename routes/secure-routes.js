const express = require('express');
const usersLib = require('../lib/users')


module.exports = db => {
  const router = express.Router();

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
    try {
      let users = await usersLib(db);
      await users.updateName(req.body.id, req.body.name);
      res.json({
        success: true
      });
    } catch (error) {
      return next(error);
    }
  });

  router.post('/updatePhone', async (req, res, next) => {
    try {
      let users = await usersLib(db);
      await users.updatePhone(req.body.id, req.body.phone);
      res.json({
        success: true
      });
    } catch (error) {
      return next(error);
    }
  });

  router.post('/updateProfilePicture', async (req, res, next) => {
    try {
      let users = await usersLib(db);
      await users.updateProfilePicture(req.body.id, req.body.profilePictureUrl);
      res.json({
        success: true
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}