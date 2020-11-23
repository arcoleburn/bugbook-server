'use strict';

const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');

const AuthService = require('./auth-service');
const jsonBodyParser = express.json();
const authRouter = express.Router();

authRouter.post('/login', jsonBodyParser, (req, res, next) => {
  const { username, password } = req.body;
  const loginUser = { username, password };

  for (const [key, value] of Object.entries(loginUser))
    if (value == null) {
      return res
        .status(400)
        .json({ error: `missing ${key} in request body` });
    }
  AuthService.getUserWithUserName(
    req.app.get('db'),
    loginUser.username
  )
    .then((dbUser) => {
      if (!dbUser)
        return res
          .status(400)
          .json({ error: 'incorrect username or password' });
      return AuthService.comparePasswords(
        loginUser.password,
        dbUser.password
      ).then((compareMatch) => {
        if (!compareMatch)
          return res.status(400).json({
            error: 'incorrect username or password',
          });

        const sub = dbUser.username;

        const payload = {
          userId: dbUser.id,
          firstName: dbUser.first_name,
        };
        res.send( {
          authToken: AuthService.createJwt(sub, payload),
          userId: dbUser.id,
          firstName: dbUser.first_name,
        });
      });
    })
    .catch(next);
});

authRouter.post('/refresh', requireAuth, (req, res) => {


  const sub = req.user.username;
  const payload = {
    user_id: req.user.id,
    firstName: req.user.firstName,
  };

  res.send({ authToken: AuthService.createJwt(sub, payload) });
});

module.exports = authRouter;
