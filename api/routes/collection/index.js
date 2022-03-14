const express = require('express');

const router = express.Router();
const passport = require('passport');
const { Op } = require('@sequelize/core');
const db = require('../../../db/models');

router.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const collections = await db.Collection.findAll({
        where: { userId },
        attributes: [
          db.sequelize.literal('ROUND(SUM("CollectionCards"."quantity"*"CollectionCards->CardPrice"."price")::numeric, 2) as "totalValue"'),
          db.sequelize.literal('array_agg(DISTINCT "CollectionCards->Card->CardColors"."color") AS colors'),
          [
            db.sequelize.literal(`(
                SELECT SUM("CollectionCards"."quantity")
                FROM "CollectionCards"
                WHERE
                    "Collection"."id" = "CollectionCards"."collectionId"
            )`),
            'totalCards',
          ],
          'id',
          'name',
          'coverUrl',
        ],
        include: {
          model: db.CollectionCard,
          attributes: [],
          include: [
            {
              model: db.CardPrice,
              attributes: [],
            },
            {
              model: db.Card,
              attributes: [],
              include: {
                model: db.CardColor,
                attributes: [],
              },
            },
          ],
        },
        raw: true,
        group: ['Collection.id'],
      });

      res.status(200).send(collections);
    } catch (error) {
      return next(error);
    }
    return next();
  },
);

router.get(
  '/collection/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const collection = await db.Collection.findOne({
        where: { id },
        attributes: [
          'name',
          'id',
          'coverUrl',
        ],
      });
      res.status(200).send(collection);
    } catch (error) {
      return next(error);
    }
    return next();
  },
);

router.get(
  '/collection/:id/cards',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const { id } = req.params;
    const { name, limit = 5, offset = 0 } = req.query;
    let cardConditions = {};
    if (name) {
      cardConditions = {
        ...cardConditions,
        name: {
          [Op.like]: `%${name}%`,
        },
      };
    }
    try {
      const collectionCards = await db.CollectionCard.findAndCountAll({
        where: {
          collectionId: id,
        },
        subQuery: false,
        limit,
        offset,
        order: [
          [{ model: db.Card }, 'name', 'ASC'],
        ],
        include: [
          { model: db.CardPrice },
          {
            model: db.Card,
            where: {
              ...cardConditions,
            },
            include: { model: db.CardFinish },
          },
        ],
      });
      return res.status(200).send(collectionCards);
    } catch (error) {
      return next(error);
    }
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
      return next(error);
    }
    return next();
  },
);

router.post(
  '/collection/card',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const userId = req.user.id;
    try {
      const {
        cardId,
        collectionId,
        condition,
        language,
        purchasePrice,
        quantity,
        type,
        priceId,
        imgUrl,
      } = req.body;
      const collection = await db.Collection.findOne({ where: { id: collectionId } });

      if (!collection || collection.userId !== userId) {
        return res.status(500).send('An error has occured');
      }
      const collectionCard = await db.CollectionCard.findOne({
        where: {
          cardId,
          userId,
          collectionId,
          condition,
          language,
          purchasePrice,
          type,
        },
      });

      if (collectionCard) {
        const card = await collectionCard.update(
          { quantity: +collectionCard.dataValues.quantity + +quantity, priceId },
        );
        return res.status(200).send(card);
      }

      if (!collection.coverUrl) {
        await collection.update({
          coverUrl: imgUrl,
        });
      }

      const card = await db.CollectionCard.create({
        cardId,
        collectionId,
        condition,
        language,
        purchasePrice,
        quantity,
        type,
        priceId,
        userId,
      });

      res.status(200).send(card);
    } catch (error) {
      return next(error);
    }
    return next();
  },
);

router.delete(
  '/collection',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.query;
      const userId = req.user.id;

      const collection = await db.Collection.findOne({
        where: {
          id,
          userId,
        },
      });

      if (!collection) {
        return next();
      }

      await collection.destroy();
      res.status(200).send({ message: 'Record was deleted successfully.' });
    } catch (error) {
      return next(error);
    }
    return next();
  },
);

module.exports = router;
