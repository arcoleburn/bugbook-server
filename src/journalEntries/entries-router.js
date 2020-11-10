'use strict';
const express = require('express');

const entriesRouter = express.Router();

entriesRouter.route(`/api/entries/:userid`).get((req, res, next) => {
  console.log('entries endpt');
  return res.status(200).send('stuff');
});

entriesRouter.route('/api/entries').get((req, res, next) => {
  res.status(200).send('stuff')
})

module.exports = entriesRouter;
