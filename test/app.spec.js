'use strict';
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');
const entriesService = require('../src/journalEntries/entries-service');

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
  } = helpers;

  before('make knex instance', () => {
    db = knex({ client: 'pg', connection: process.env.TEST_DB_URL });
    app.set('db', db);
  });
  after('disconnect db', () => db.destroy());

  before('cleanup', () => cleanTables(db));
  afterEach('cleanup', () => cleanTables(db));

  context('given there is data in db', () => {
    beforeEach('insert users, entries, and observations', () => {
      seedTables(db, makeUsers(), makeEntries(), makeObservations());
    });

    describe('GET /api/entries/:userid', () => {
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
  });
});
