'use strict';

const express = require('express');

const usersRouter = express.Router();
const jsonBodyParser = express.json();
const UsersService = require('./users-service');

usersRouter.post('/', jsonBodyParser, (req, res, next) => {
  const { password, username, email, first_name } = req.body;
  for (const field of ['username', 'password', 'email', 'first_name'])
    if (!req.body[field])
      return res
        .status(400)
        .json({ error: `missing ${field} in request body` });

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: `password must be at least 8 characters` });
  }
  if (password.length > 72) {
    return res
      .status(400)
      .json({ error: `password must be less than 72 characters` });
  }
  UsersService.hasUserWithUsername(req.app.get('db'), username)
    .then((hasUserWithUserName) => {
      if (hasUserWithUserName)
        return res.status(400).json({ error: 'username taken' });

      return UsersService.hashPassword(password).then(
        (hashedPassword) => {
          const newUser = {
            username,
            password: hashedPassword,
            email,
            first_name,
          };
          return UsersService.insertUser(
            req.app.get('db'),
            newUser
          ).then((user) => {
            res.status(201).json(UsersService.serializeUser(user));
          });
        }
      );
    })
    .catch(next);
});

module.exports = usersRouter;
