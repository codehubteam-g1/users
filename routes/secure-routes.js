const express = require('express');

module.exports = database => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    //We'll just send back the user id
    try {
      let db = await database;
      let Users = await db.Users;
      let user = await Users.findById(req.user.id)
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
      let Users = await db.Users;
      await Users.updateName(req.user.id, req.body.name);
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
      let Users = await db.Users;
      await Users.updatePhone(req.user.id, req.body.phone);
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
      let Users = await db.Users;
      await Users.updateProfilePicture(req.user.id, req.body.profilePictureUrl);
      res.json({
        success: true
      });
    } catch (error) {
      return next(error);
    }
  });

  router.post('/createAddress', async (req, res, next) => {
    try {
      req.body.userId = req.user.id;
      let db = await database;
      let Addresses = await db.Addresses;
      await Addresses.createAddress(req.body);
      res.json({
        success: true
      });
    } catch (error) {
      return next(error);
    }
  });

  router.get('/addressesByUserId', async (req, res, next) => {
    //We'll just send back the user details and the token
    try {
      let db = await database;
      let Addresses = await db.Addresses;
      let addresses = await Addresses.findByUserId(req.user.id)
      res.json({
        addresses
      })
    } catch (error) {
      return next(error);
    }
  });

  router.get('/addressByAddressId', async (req, res, next) => {
    //We'll just send back the user details and the token
    try {
      let db = await database;
      let Addresses = await db.Addresses;
      let address = await Addresses.findByAddressId(req.body.addressId)
      res.json({
        address
      })
    } catch (error) {
      return next(error);
    }
  });

  router.post('/updateAddress', async (req, res, next) => {
    try {
      let db = await database;
      let Addresses = await db.Addresses;
      await Addresses.updateAddress(req.user.id, req.body.addressId, req.body.address);
      res.json({
        success: true
      });
    } catch (error) {
      return next(error);
    }
  });

  router.post('/updateTag', async (req, res, next) => {
    try {
      let db = await database;
      let Addresses = await db.Addresses;
      await Addresses.updateTag(req.user.id, req.body.addressId, req.body.tag);
      res.json({
        success: true
      });
    } catch (error) {
      return next(error);
    }
  });

  router.post('/deleteAddress', async (req, res, next) => {
    try {
      let db = await database;
      let Addresses = await db.Addresses;
      await Addresses.deleteAddress(req.user.id, req.body.addressId);
      res.json({
        success: true
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}