const express = require('express');
const { uniqBy } = require('lodash');
const { Op } = require('@sequelize/core');

const router = express.Router();
const passport = require('passport');
const db = require('../../../db/models');

/*
  GET /api/cards/
  Get all cards
*/
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
        order: [
          ['releasedAt', 'DESC'],
          [db.CardFinish, 'finish', 'DESC'],
        ],
        include: [
          {
            model: db.CardPrice,
          },
          {
            model: db.CardFinish,
          },
        ],
        limit: 15,
      });
      res.status(200).send(uniqBy(cards, 'dataValues.name'));
    } catch (error) {
      return next(error);
    }
    return next();
  },
);

/*
  GET /api/cards/card/:name
  Get card by name
*/
router.get(
  '/card/:name',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { name } = req.params;
      const cards = await db.Card.findAll({
        where: {
          name: {
            [Op.iLike]: `%${name}%`,
          },
        },
        order: [
          ['releasedAt', 'DESC'],
          [db.CardFinish, 'finish', 'DESC'],
        ],
        include: [
          {
            model: db.CardPrice,
          },
          {
            model: db.CardFinish,
          },
        ],
      });
      res.status(200).send(cards);
    } catch (error) {
      return next(error);
    }
    return next();
  },
);

module.exports = router;
