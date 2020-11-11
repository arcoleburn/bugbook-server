'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const EntriesService = require('./journalEntries/entries-service');
const ObservationsService = require('./observations/observations-service');
const {
  serializeEntry,
} = require('./journalEntries/entries-service');
const app = express();

const jsonParser = express.json();
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.get('/api/entries/:userId', (req, res, next) => {
  console.log(req.params);
  EntriesService.getEntriesForUser(
    req.app.get('db'),
    req.params.userId
  ).then((entries) =>
    res.json(
      entries.map((entry) => {
        console.log(
          'entry from get',
          EntriesService.serializeEntry(entry)
        );
        return EntriesService.serializeEntry(entry);
      })
    )
  );
});

app.get('/api/observations/:userId', (req, res, next) => {
  ObservationsService.getObservationsForUser(
    req.app.get('db'),
    req.params.userId
  ).then((observations) => {
    console.log(observations);
    return res.json(
      observations.map((obs) =>
        ObservationsService.serializeObservation(obs)
      )
    );
  });
});

app.post('/api/entries/:userId', jsonParser, (req, res, next) => {
  const { day_rating, deep_hours, journal_entry } = req.body;
  const userId = req.params.userId;
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
        .json(serializeEntry(entry));
    })
    .catch(next);
});
app.post(
  '/api/observations/:userId',
  jsonParser,
  (req, res, next) => {
    const { newObs } = req.body;
    const userId = req.params.userId;
    const newObservation = { newObs, userId };

    res.status(201).send('stuff');
  }
);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.log(error);
    response = { message: error.messager, error };
  }
  res.status(500).json(response);
});
module.exports = app;
