const express = require('express');

const router = express.Router();
const passport = require('passport');
const { Op } = require('@sequelize/core');
const db = require('../../../db/models');

/*
  GET /api/collections/
  Get all collections for user
*/
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const collections = await db.Collection.findAll({
        where: { userId },
        order: [['name', 'ASC']],
        attributes: [
          [
            db.sequelize.literal(`(
                SELECT SUM("CollectionCards"."quantity")
                FROM "CollectionCards"
                WHERE
                    "Collection"."id" = "CollectionCards"."collectionId"
            )`),
            'totalCards',
          ],
          [
            db.sequelize.literal(`(
                SELECT ROUND(SUM("CollectionCards"."quantity"*"CardPrices"."price")::numeric, 2)
                FROM "CollectionCards", "CardPrices"
                WHERE
                  "CollectionCards"."cardId" = "CardPrices"."cardId"
                AND
                  "CollectionCards"."type" = "CardPrices"."type"
            )`),
            'totalValue',
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

/*
  GET /api/collections/:id
  Get single collection for user
*/
router.get(
  '/collection/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const collection = await db.Collection.findOne({
        where: { id },
        order: [['name', 'ASC']],
        attributes: [
          [
            db.sequelize.literal(`(
                SELECT ROUND(SUM("CollectionCards"."quantity"*"CardPrices"."price")::numeric, 2)
                FROM "CollectionCards", "CardPrices"
                WHERE
                  "CollectionCards"."cardId" = "CardPrices"."cardId"
                AND
                  "CollectionCards"."type" = "CardPrices"."type"
            )`),
            'totalValue',
          ],
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
      res.status(200).send(collection);
    } catch (error) {
      return next(error);
    }
    return next();
  },
);

/*
  GET /api/collections/:id/cards
  Get all card for collection for user
*/
router.get(
  '/collection/:id/cards',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const { id } = req.params;
    const {
      name, limit = 50, offset = 0, orderBy = 'name', order = 'ASC',
    } = req.query;
    let cardConditions = {};
    const orderArray = () => {
      switch (orderBy) {
        case ('name'):
        case ('setCode'):
          return [{ model: db.Card }, orderBy, order];
        case ('price'):
          return [{ model: db.CardPrice }, orderBy, order];
        default:
          return [orderBy, order];
      }
    };
    if (name) {
      cardConditions = {
        ...cardConditions,
        name: {
          [Op.iLike]: `%${name}%`,
        },
      };
    }
    try {
      const collectionCards = await db.CollectionCard.findAndCountAll({
        where: {
          collectionId: id,
        },
        limit,
        offset,
        order: [orderArray()],
        include: [
          { model: db.CardPrice, attributes: ['price'] },
          {
            model: db.Card,
            where: {
              ...cardConditions,
            },
            include: [
              { model: db.Set, attributes: ['name', 'parentSetCode', 'code'] },
            ],
          },
        ],
        attributes: [
          'id',
          'condition',
          'language',
          'quantity',
          'type',
          'purchasePrice',
          'cardId',
        ],
      });
      return res.status(200).send(collectionCards);
    } catch (error) {
      return next(error);
    }
  },
);

/*
  GET /api/collections/cards
  Get all cards for all collections for user
*/
router.get(
  '/cards',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const {
        name, limit = 50, offset = 0, order = 'ASC',
      } = req.query;

      let conditions = {};

      if (name) {
        conditions = {
          ...conditions,
          name: {
            [Op.iLike]: `%${name}%`,
          },
        };
      }

      const allCards = await db.CollectionCard.findAndCountAll(
        {
          where: { userId },
          limit,
          offset,
          order: [
            [{ model: db.Card }, 'name', order],
          ],
          attributes: [
            'id',
            'quantity',
            'type',
            'condition',
            'language',
            'purchasePrice',
            'collectionId',
          ],
          include: [
            { model: db.Card, where: conditions },
            {
              model: db.Collection,
              attributes: [
                'name',
                'id',
              ],
            },
          ],
        },
      );

      res.status(200).send(allCards);
    } catch (error) {
      return next(error);
    }
    return next();
  },
);

/*
  POST /api/collections/collection
  Create collection for user
*/
router.post(
  '/collection/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { name, coverUrl = null } = req.body;
      const userId = req.user.id;
      const collection = await db.Collection.create({ name, coverUrl, userId });

      res.status(200).send(collection);
    } catch (error) {
      return next(error);
    }
    return next();
  },
);

/*
  POST /api/collections/colleciton/card
  Create collection card for user
*/
router.post(
  '/collection/card',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const userId = req.user.id;
    try {
      const {
        cardId, collectionId, condition, language, purchasePrice, quantity, type, priceId, imgUrl,
      } = req.body;

      const collection = await db.Collection.findOne({ where: { id: collectionId } });

      if (!collection || collection.userId !== userId) {
        return res.status(500).send('An error has occured');
      }
      const collectionCard = await db.CollectionCard.findOne({
        where: {
          cardId, userId, collectionId, condition, language, purchasePrice, type,
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
        cardId, collectionId, condition, language, purchasePrice, quantity, type, priceId, userId,
      });

      res.status(200).send(card);
    } catch (error) {
      return next(error);
    }
    return next();
  },
);

/*
  PUT /api/collections/collection/card
  Update collection card for user
*/
router.put(
  '/collection/card',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const {
        cardId,
        collectionId,
        condition,
        language,
        purchasePrice,
        priceId,
        quantity,
        type,
        id,
      } = req.body;

      const card = await db.CollectionCard.findOne({
        where: {
          userId,
          id,
        },
      });

      if (!card) return res.status(404).send('Card Not Found');

      const updatedCard = await card.update({
        cardId,
        collectionId,
        condition,
        language,
        purchasePrice,
        quantity,
        priceId,
        type,
      });

      res.status(200).send(updatedCard);
    } catch (err) {
      return next(err);
    }
    return next();
  },
);

/*
  DELETE /api/collections/collection/card
  Delete collection card for user
*/
router.delete(
  '/collection/card',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.query;
      const userId = req.user.id;

      const collectionCard = await db.CollectionCard.findOne({
        where: {
          id,
          userId,
        },
      });

      if (!collectionCard) return res.status(404).send('Collection card not found!');

      await collectionCard.destroy();
      res.status(200).send({ message: 'Collection card was deleted successfully.' });
    } catch (error) {
      return next(error);
    }
    return next();
  },
);

/*
  DELETE /api/collections/collection
  Delete collection card for user
*/
router.delete(
  '/collection/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const collection = await db.Collection.findOne({
        where: {
          id,
          userId,
        },
      });

      if (!collection) {
        return res.status(404).send('Collection not found!');
      }

      await collection.destroy();
      res.status(200).send({ message: 'Collection was deleted successfully.' });
    } catch (error) {
      return next(error);
    }
    return next();
  },
);

module.exports = router;
