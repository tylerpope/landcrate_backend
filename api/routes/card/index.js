const express = require('express');
const { uniqBy } = require('lodash');
const { Op } = require('@sequelize/core');

const router = express.Router();
const passport = require('passport');
const db = require('../../../db/models');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const name = req.query.name || '';
      const cards = await db.Card.findAll({
        where: {
          name: {
            [Op.iLike]: `%${name}%`,
          },
        },
        include: {
          model: db.CardPrice,
        },
        limit: 15,
      });
      res.status(200).send(uniqBy(cards, 'dataValues.name'));
    } catch (error) {
      console.error(error);
      return next(error);
    }
    return next();
  },
);

router.get(
  '/card',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const name = req.query.name || '';
      const cards = await db.Card.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
        include: {
          model: db.CardPrice,
        },
      });
      res.status(200).send(cards);
    } catch (error) {
      return next(error);
    }
    return next();
  },
);

module.exports = router;