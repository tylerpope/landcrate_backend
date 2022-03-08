const express = require('express');
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
        limit: 10,
      });
      res.status(200).send(cards);
    } catch (error) {
      console.error(error);
      return next(error);
    }
    return next();
  },
);

module.exports = router;
