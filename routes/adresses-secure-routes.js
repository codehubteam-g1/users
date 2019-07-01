const express = require('express');

module.exports = database => {
  const router = express.Router();

  //Displays information tailored according to the logged in user
  router.get('/home', (req, res, next) => {
    //We'll just send back the user details and the token
    res.json({
      message: 'You made it to the secure route',
      user: req.user
    })
  });

  router.get('/', async (req, res, next) => {
    //We'll just send back the user details and the token
    try {
      let id = req.user.id;
      let db = await database;
      let users = await db.Users;
      let user = await users.findById(id)
      res.json({
        user
      })
    } catch (error) {
      return next(error);
    }
  });

  router.post('/updateName', async (req, res, next) => {
    try {
      let db = await database;
      let users = await db.Users;
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
      let db = await database;
      let users = await db.Users;
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
      let db = await database;
      let users = await db.Users;
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