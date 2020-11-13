'use strict';

const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const testHelpers = require('./test-helpers');
const helpers = require('./test-helpers');

describe('Auth Endpoints', function () {
  let db;

  const testUsers = testHelpers.makeUsers();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });
  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /api/auth/login', () => {
    beforeEach('insert data', () =>
      helpers.seedTables(
        db,
        testUsers,
        helpers.makeEntries(),
        helpers.makeObservations()
      )
    );
    const requiredFields = ['username', 'password'];

    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password,
      };
      console.log('login attempt body from test', loginAttemptBody);
      it(`responds with 400 required error when ${field} is missing`, () => {
        delete loginAttemptBody[field];
        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, { error: `missing ${field} in request body` });
      });
    });
  });
  it(`responds 400 'invalid username or password' when bad username`, () => {
    const userInvalid = { username: 'user-not', password: 'exists' };
    return supertest(app)
      .post('/api/auth/login')
      .send(userInvalid)
      .expect(400, { error: 'incorrect username or password' });
  });
  it(`responds 400 'invalid username or password' when bad password`, () => {
    const userInvalidPassword = { username: testUser.username, password: 'incorrect' };
    return supertest(app)
      .post('/api/auth/login')
      .send(userInvalidPassword)
      .expect(400, { error: 'incorrect username or password' });
  });
});
