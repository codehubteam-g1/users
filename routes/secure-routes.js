'use strict'

const Express = require('express');
const ErrorHandler = require('../db/lib/errorHandler')

module.exports = database => {
  const router = Express.Router();

  router.get('/', async (req, res, next) => {
    //We'll just send back the user id
    try {
      const db = await database;
      let user = await db.User.findById(req.user.id)
      res.json({
        user
      })
    } catch (error) {
      ErrorHandler(error, next)
    }
  });

  router.post('/updateName', async (req, res, next) => {
    try {
      let name = req.body.name || ''
      const db = await database;
      let user = await db.User.findById(req.user.id)
      await user.update({ name })
      res.json({
        success: true
      });
    } catch (error) {
      ErrorHandler(error, next)
    }
  });

  router.post('/updatePhone', async (req, res, next) => {
    try {
      let phone = req.body.phone || ''
      const db = await database;
      let user = await db.User.findById(req.user.id)
      await user.update({ phone })
      res.json({
        success: true
      });
    } catch (error) {
      ErrorHandler(error, next)
    }
  });

  router.post('/updateProfilePicture', async (req, res, next) => {
    try {
      let profilePictureUrl = req.body.profilePictureUrl || ''
      const db = await database;
      let user = await db.User.findById(req.user.id)
      await user.update({ profilePictureUrl })

      res.json({
        success: true
      });
    } catch (error) {
      ErrorHandler(error, next)
    }
  });

  router.post('/createAddress', async (req, res, next) => {
    try {
      const db = await database;
      let user = await db.User.findById(req.user.id)
      let answer = await user.addAddress(req.body)
      console.log(answer)
      res.json({
        success: true
      });
    } catch (error) {
      ErrorHandler(error, next)
    }
  });

  router.get('/addressesByUserId', async (req, res, next) => {
    try {
      const db = await database;
      let user = await db.User.findById(req.user.id)
      let addresses = await user.getAddresses()
      res.json({
        addresses
      });
    } catch (error) {
      ErrorHandler(error, next)
    }
  });

  router.get('/addressByAddressId', async (req, res, next) => {
    //We'll just send back the user details and the token
    try {
      let db = await database;
      let Address = await db.Address
      let address = await Address.findById(req.body.id)
      res.json({
        address
      })
    } catch (error) {
      return next(error);
    }
  });

  router.post('/updateAddress', async (req, res, next) => {
    try {
      let addressDir = req.body.address || ''
      const db = await database;
      let address = await db.Address.findById(req.body.id)
      await address.update({ address: addressDir })
      res.json({
        success: true
      });
    } catch (error) {
      ErrorHandler(error, next)
    }
  });

  router.post('/updateTag', async (req, res, next) => {
    try {
      let tag = req.body.tag || ''
      const db = await database;
      let address = await db.Address.findById(req.body.id)
      await address.update({ tag })
      res.json({
        success: true
      });
    } catch (error) {
      ErrorHandler(error, next)
    }
  })

  router.post('/deleteAddress', async (req, res, next) => {
    try {
      let db = await database;
      let Address = await db.Address
      let address = await Address.findById(req.body.id)
      await address.deleteAddress()
      res.json({
        success: true
      })
    } catch (error) {
      return next(error);
    }
  })

  router.post('/selectAddress', async (req, res, next) => {
    try {
      let db = await database;
      let user = await db.User.findById(req.user.id)
      await user.unselectAddresses()
      await db.Address.update({ selected: true }, { where: { id: req.body.id } })
      res.json({
        success: true
      })
    } catch (error) {
      return next(error);
    }
  })

  return router;
}