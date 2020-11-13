'use strict';

const express = require('express');
const EntriesService = require('./entries-service');
const { requireAuth } = require('../../src/middleware/jwt-auth')
const entriesRouter = express.Router();
const jsonParser = express.json();

entriesRouter
  .route('/:userId')
  .all(requireAuth)
  .get((req, res, next) => {
    EntriesService.getEntriesForUser(
      req.app.get('db'),
      req.params.userId
    ).then((entries) =>
      res.json(
        entries.map((entry) => {
          return EntriesService.serializeEntry(entry);
        })
      )
    );
  })
  .post(jsonParser, (req, res, next) => {
    const { day_rating, deep_hours, journal_entry } = req.body;
    const userId = req.params.userId;
    console.log('req params', req.params);
    console.log('req body: ', req.body);
    const newEntry = {
      day_rating,
      deep_hours,
      journal_entry,
      user_id: userId,
    };

    for (const [key, value] of Object.entries(newEntry))
      if (value == null)
        return res
          .status(400)
          .json({ error: { message: `Missing ${key} in request` } });

    EntriesService.insertEntry(req.app.get('db'), newEntry, userId)
      .then((entry) => {
        res
          .status(201)
          .location(`/api/entries/${userId}/${entry.id}`)
          .json(EntriesService.serializeEntry(entry));
      })
      .catch(next);
  });

module.exports = entriesRouter;
