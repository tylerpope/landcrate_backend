const express = require("express");
const router = express.Router();
const passport = require("passport");
const db = require("../../../db/models");

router.get(
  "/collection",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const cards = await db.UserCard.findAll({
        where: { userId },
        include: {
          model: db.Card,
          include: [
            {
              model: db.CardColor,
              as: "colors",
              attributes: ["color"],
            },
            {
              model: db.CardColorIdentity,
              as: "coloridentities",
              attributes: ["color"],
            },
          ],
        },
      });
      res.send(cards);
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

module.exports = router;
