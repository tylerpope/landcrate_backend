const express = require('express');

const router = express.Router();
const passport = require('passport');
const db = require('../../../db/models');

router.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const collections = await db.Collection.findAll({
        where: { userId },
        attributes: ['uid', 'name'],
        include: {
          model: db.CollectionCard,
          limit: 1,
          attributes: ['cardId'],
          include: {
            model: db.Card,
            attributes: ['imageUris'],
          },
        },
      });
      res.status(200).send(collections);
    } catch (error) {
      console.error(error);
      return next(error);
    }
    return next();
  },
);

router.get(
  '/collection/:id',
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const collection = await db.Collection.findOne({
        where: { uid: id },
        attributes: ['uid', 'name'],
        include: {
          model: db.CollectionCard,
          include: {
            model: db.Card,
          },
          attributes: ['id', 'quantity', 'type'],
        },
      });
      res.status(200).send(collection);
    } catch (error) {
      return next(error);
    }
    return next();
  },
);

router.get(
  '/cards/all',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const cards = await db.CollectionCard.findAll({
        include: [{
          model: db.Collection,
          where: {
            userId,
          },
          attributes: ['name'],
        }, {
          model: db.Card,
          attributes: ['name'],
        }],
        attributes: ['id', 'type'],
      });
      res.status(200).send(cards);
    } catch (error) {
      return next(error);
    }
    return next();
  },
);

router.post(
  '/collection/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { name } = req.body;
      const userId = req.user.id;
      const collection = await db.Collection.create({ name, userId });

      res.status(200).send(collection);
    } catch (error) {
      console.log(error);
      return next(error);
    }
    return next();
  },
);

module.exports = router;
