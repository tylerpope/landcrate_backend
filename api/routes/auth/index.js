const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

router.post('/signup', async (req, res, next) => {
  passport.authenticate('signup', { session: false }, async (err, user) => {
    try {
      if (err) {
        const errorMessage = err && err.errors[0] && err.errors[0].message === 'email must be unique' ? 'Email already registered' : 'An error has occured';
        return res.status(401).send(errorMessage);
      }
      const body = { id: user.id, email: user.email };
      const token = jwt.sign({ user: body }, process.env.SECRET, { expiresIn: '24h' });

      return res.json({
        email: user.email,
        accessToken: token,
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.post('/signin', async (req, res, next) => {
  // eslint-disable-next-line consistent-return
  passport.authenticate('login', async (err, user, info = {}) => {
    try {
      if (err || !user) {
        const errorMessage = info.message || err || 'An error occured.';
        return res.status(401).send(errorMessage);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { id: user.id, email: user.email };
        const token = jwt.sign({ user: body }, process.env.SECRET, { expiresIn: '24h' });

        return res.json({
          email: user.email,
          accessToken: token,
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = router;
