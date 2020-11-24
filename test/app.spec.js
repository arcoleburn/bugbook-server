'use strict';
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');
const entriesService = require('../src/journalEntries/entries-service');
const ObservationsService = require('../src/observations/observations-service');
const { expect } = require('chai');
const AuthService = require('../src/auth/auth-service');

const { serializeObservation } = ObservationsService;

describe('App', () => {
  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app).get('/').expect(200, 'Hello, world!');
  });
});

describe('data endpoints', () => {
  let db;
  const userid = 1;
  const {
    makeUsers,
    makeEntries,
    makeObservations,
    seedTables,
    cleanTables,
    seedUsers,
  } = helpers;

  before('make knex instance', () => {
    db = knex({ client: 'pg', connection: process.env.TEST_DB_URL });
    app.set('db', db);
  });
  after('disconnect db', () => db.destroy());

  before('cleanup', () => cleanTables(db));

  afterEach('cleanup', () => cleanTables(db));

  context('given there is data in db', () => {
    beforeEach('insert users, entries, and observations', () =>
      seedTables(db, makeUsers(), makeEntries(), makeObservations())
    );
    afterEach('cleanup', () => cleanTables(db));

    describe('GET /api/entries/:userid', function () {
      this.retries(3);
      it('responds with 200 and all entries for user', () => {
        const entries = makeEntries();
        const expectedEntries = entries.map((entry) => {
          return entriesService.serializeEntry(entry);
        });
        return supertest(app)
          .get(`/api/entries/${userid}`)
          .expect(200, expectedEntries);
      });
    });
    describe('GET /api/observations/:userId', () => {
      it('responds with 200 and all observations for the user', () => {
        const obs = makeObservations();
        const expObs = obs.map((ob) => serializeObservation(ob));
        return supertest(app)
          .get(`/api/observations/${userid}`)
          .expect(200, expObs);
      });
    });
    describe('POST /api/enrtries/:userId', () => {
      it('creates entry and responds with 201 and new entry', function () {
        const newEntry = {
          day_rating: 2,
          deep_hours: 5,
          journal_entry: 'test journal entry text',
          user_id: userid,
        };
        return supertest(app)
          .post(`/api/entries/${userid}`)
          .send(newEntry)
          .expect(201)
          .expect((res) => {
            expect(res.body.day_rating).to.eql(newEntry.day_rating);
            expect(res.body.deep_hours).to.eql(newEntry.deep_hours);
            expect(res.body.journal_entry).to.eql(
              newEntry.journal_entry
            );
            expect(res.body.user_id).to.eql(userid);
            expect(res.body).to.have.property('id');
          });
      });
    });
    describe('POST /api/observations/:userId', () => {
      it('creates observation and responds with 201 and new observation', function () {
        const newObservation = {
          observation: 'this is a test observation',
          user_id: userid,
        };

        return supertest(app)
          .post(`/api/observations/${userid}`)
          .send(newObservation)
          .expect(201)
          .expect((res) => {
            expect(res.body.observation).to.eql(
              newObservation.observation
            );
            expect(res.body.user_id).to.eql(userid);
            expect(res.body).to.have.property('id');
          });
      });
    });
  });
});
