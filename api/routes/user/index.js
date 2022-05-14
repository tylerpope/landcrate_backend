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
      currentPassword,
    } = req.body;

    try {
      const user = await db.User.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) return res.status(500).send('An error has occured.');

      const fields = [];

      const updates = {};

      if (email) {
        updates.email = email;
        fields.push('email');
      }

      if (password) {
        updates.password = password;
        fields.push('password');
        const validate = await user.isValidPassword(currentPassword);
        if (!validate) {
          res.statusMessage = 'Incorrect current password';
          return res.status(400).end();
        }
      }

      await user.update(updates, { fields });

      return res.status(200).send(`${fields.includes('email')
        ? 'Email successfully updated.'
        : 'Password successfully changed'}`);
    } catch (err) {
      return next(err);
    }
  },
);

module.exports = router;
