const express = require('express');

const router = express.Router();
const passport = require('passport');
const db = require('../../../db/models');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    res.send('test');
  },
);

router.put(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const userId = req.user.id;

    const {
      email,
      password,
    } = req.body;

    try {
      const user = await db.User.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) return res.status(500).send('An error has occured.');
      const fields = [];

      if (email) {
        user.email = email;
        fields.push('email');
      }

      if (password) {
        user.password = password;
        fields.push('password');
      }

      await user.save({ fields });

      return res.status(200).send('User successfully updated.');
    } catch (err) {
      return next(err);
    }
  },
);

module.exports = router;
