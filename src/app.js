'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const EntriesService = require('./journalEntries/entries-service');
const entriesRouter = require('../src/journalEntries/entries-router');
const ObservationsService = require('./observations/observations-service');
const {
  serializeEntry,
} = require('./journalEntries/entries-service');
const {
  serializeObservation,
} = require('./observations/observations-service');
const app = express();

const jsonParser = express.json();
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/entries', entriesRouter);



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


app.post(
  '/api/observations/:userId',
  jsonParser,
  (req, res, next) => {
    console.log('req body', req.body);
    const { observation } = req.body;
    console.log(observation);
    const userId = req.params.userId;
    const newObservation = { observation, user_id: userId };

    ObservationsService.insertObservation(
      req.app.get('db'),
      newObservation,
      userId
    ).then((obs) => {
      res
        .status(201)
        .location(`/api/observations/${userId}/${obs.id}`)
        .json(serializeObservation(obs));
    });
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
