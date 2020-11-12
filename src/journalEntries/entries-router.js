'use strict';

const { json } = require('express');
const express = require('express');
const EntriesService = require('./entries-service');

const entriesRouter = express.Router();
const jsonParser = express.json();

entriesRouter
  .route('/:userId')
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
  .post(jsonParser, (req, res));
