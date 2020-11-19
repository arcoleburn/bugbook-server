'use strict';

const express = require('express');
const EntriesService = require('./entries-service');
const { requireAuth } = require('../../src/middleware/jwt-auth');
const entriesRouter = express.Router();
const jsonParser = express.json();

entriesRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    EntriesService.getEntriesForUser(
      req.app.get('db'),
      req.user.id
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
    const userId = req.user.id;

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
          .location(`/api/entries/${userId}/${entry.id}`) //change
          .json(EntriesService.serializeEntry(entry));
      })
      .catch(next);
  });

entriesRouter
  .route('/:id')
  .all(requireAuth)
  .delete((req, res, next) => {
    EntriesService.deleteEntry(req.app.get('db'), req.params.id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { day_rating, deep_hours, journal_entry } = req.body;
    const entryToUpdate = { day_rating, deep_hours, journal_entry };

    EntriesService.updateEntry(
      req.app.get('db'),
      req.params.id,
      entryToUpdate
    ).then((entry) => 
      res.status(200).json(EntriesService.serializeEntry(entry)));
  });

module.exports = entriesRouter;
