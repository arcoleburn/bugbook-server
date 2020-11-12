'use strict';

const express = require('express');
const ObservationsService = require('./observations-service');

const observationsRouter = express.Router();
const jsonParser = express.json();

observationsRouter
  .route('/:userId')
  .get((req, res, next) => {
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
  })
  .post(jsonParser, (req, res, next) => {
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
        .json(ObservationsService.serializeObservation(obs));
    });
  });

module.exports = observationsRouter;
