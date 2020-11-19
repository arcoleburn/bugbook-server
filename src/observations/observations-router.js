'use strict';

const express = require('express');
const ObservationsService = require('./observations-service');
const { requireAuth } = require('../middleware/jwt-auth');
const observationsRouter = express.Router();
const jsonParser = express.json();

observationsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    ObservationsService.getObservationsForUser(
      req.app.get('db'),
      req.user.id
    ).then((observations) => {
      return res.json(
        observations.map((obs) =>
          ObservationsService.serializeObservation(obs)
        )
      );
    });
  })
  .post(jsonParser, (req, res, next) => {
    const { observation } = req.body;
    const userId = req.user.id;
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
observationsRouter
  .route('/:id')
  .all(requireAuth)
  .delete((req, res, next) => {
    ObservationsService.delObservation(
      req.app.get('db'),
      req.params.id
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = observationsRouter;
