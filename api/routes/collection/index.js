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
          db.sequelize.literal('ROUND(SUM("CollectionCards"."quantity"*"CollectionCards->CardPrice"."price")::numeric, 2) as "totalValue"'),
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

      return res.status(200).send(collections);
    } catch (error) {
      return next(error);
    }
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
      const userId = req.user.id;

      if (id === 'all') {
        const allCollections = await db.sequelize.query(`
          SELECT ROUND(SUM("CollectionCards"."quantity"*"CardPrices"."price")::numeric, 2) as totalValue,
          SUM("CollectionCards"."quantity") as totalCards
          FROM "CollectionCards"
          LEFT JOIN "CardPrices" ON ("CollectionCards"."priceId"="CardPrices"."id")
          WHERE "CollectionCards"."userId" = '${userId}'
          GROUP BY "CollectionCards"."userId"`, { plain: true });
        const all = {
          name: 'All Cards',
        };
        if (allCollections) {
          all.totalCards = allCollections.totalcards || 0;
          all.totalValue = allCollections.totalvalue || '0.00';
        }
        return res.status(200).send(
          all,
        );
      }

      const collection = await db.Collection.findOne({
        where: { id, userId },
        order: [['name', 'ASC']],
        attributes: [
          db.sequelize.literal('ROUND(SUM("CollectionCards"."quantity"*"CollectionCards->CardPrice"."price")::numeric, 2) as "totalValue"'),
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

      return res.status(200).send(collection);
    } catch (error) {
      return next(error);
    }
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
    const userId = req.user.id;
    const {
      name, limit = 50, offset = 0, orderBy = 'name', order = 'ASC',
    } = req.query;
    let cardConditions = {};
    const whereConditions = { userId };
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
    if (id !== 'all') {
      whereConditions.collectionId = id;
    }
    try {
      const collectionCards = await db.CollectionCard.findAndCountAll({
        where: whereConditions,
        limit,
        offset,
        order: [orderArray()],
        distinct: 'CollectionCards.id',
        include: [
          { model: db.CardPrice, attributes: ['price'] },
          {
            model: db.Card,
            attributes: [
              'id',
              'name',
              'imageUris',
              'legalities',
              'rarity',
              'scryfallUri',
              'oracleText',
              'tcgPlayerId',
            ],
            where: {
              ...cardConditions,
            },
            include: [
              { model: db.Set, attributes: ['name', 'parentSetCode', 'code'] },
              { model: db.CardPrice, attributes: ['type', 'price'] },
              { model: db.CardFinish, attributes: ['finish'] },
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
        subQuery: false,
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

      return res.status(200).send(allCards);
    } catch (error) {
      return next(error);
    }
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
      return res.status(200).send(collection);
    } catch (error) {
      return next(error);
    }
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
        cardId, collectionId, condition, language, purchasePrice, quantity, type, imgUrl,
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

      const cardPrice = await db.CardPrice.findOne({
        where: {
          cardId, type,
        },
      });

      if (!cardPrice) {
        return res.status(500).send('An error has occured');
      }

      const { id } = cardPrice.dataValues;

      if (collectionCard) {
        const card = await collectionCard.update(
          { quantity: +collectionCard.dataValues.quantity + +quantity, priceId: id },
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
        priceId:
        id,
        userId,
      });

      return res.status(200).send(card);
    } catch (error) {
      return next(error);
    }
  },
);

/*
  PUT /api/collections/collection/
  Update collection card for user
*/
router.put(
  '/collection',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const {
        id,
        coverUrl,
        name,
      } = req.body;
      const collection = await db.Collection.findOne({
        where: {
          id,
          userId,
        },
      });
      if (!collection) return res.status(404).send('Collection Not Found');
      const updateItems = {};
      if (coverUrl) {
        updateItems.coverUrl = coverUrl;
      }
      if (name) {
        updateItems.name = name;
      }
      const updatedCollection = await collection.update({ ...updateItems });
      return res.status(200).send(updatedCollection);
    } catch (err) {
      return next(err);
    }
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

      const cardPrice = await db.CardPrice.findOne({
        where: {
          cardId, type,
        },
      });

      if (!cardPrice) {
        return res.status(500).send('An error has occured');
      }

      const updatedCard = await card.update({
        cardId,
        collectionId,
        condition,
        language,
        purchasePrice,
        quantity,
        priceId: cardPrice.dataValues.id,
        type,
      });

      return res.status(200).send(updatedCard);
    } catch (err) {
      return next(err);
    }
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
  },
);

/*
  DELETE /api/collections/collection
  Delete collection card for user
*/
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
        return res.status(404).send('Collection not found!');
      }

      await collection.destroy();
      return res.status(200).send({ message: 'Collection was deleted successfully.' });
    } catch (error) {
      return next(error);
    }
  },
);

module.exports = router;
