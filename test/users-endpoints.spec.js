'use strict';

const { expect } = require('chai');
const { NotBeforeError } = require('jsonwebtoken');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users endpoints', function () {
  let db;

  const { testUsers } = helpers.makeUsers();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });
  after('disconnect db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /api/users', () => {
    context('User validation', () => {
      //   beforeEach('insert users', () => {
      //     helpers.seedUsers(db, testUsers);
      //   });
      const requiredFields = [
        'username',
        'password',
        'email',
        'first_name',
      ];

      requiredFields.forEach((field) => {
        const registerAttemptBody = {
          username: 'testUser',
          password: 'testpassword',
          email: 'email',
          first_name: 'name',
        };
        it(`responds with 400 required error when ${field} is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: `missing ${field} in request body`,
            });
        });
      });
      it('responds 400 password too short with password under 8 characters', () => {
        const userShortPass = {
          username: 'usernametest',
          password: 'shorty',
          email: 'email address',
          first_name: 'testname',
        };
        return supertest(app)
          .post('/api/users')
          .send(userShortPass)
          .expect(400, {
            error: 'password must be at least 8 characters',
          });
      });
      it('res 400 when password longer than 72 chars', () => {
        const userLongPass = {
          username: 'testuser',
          password: '*'.repeat(73),
          email: 'email',
          first_name: 'name',
        };

        return supertest(app)
          .post('/api/users')
          .send(userLongPass)
          .expect(400, {
            error: 'password must be less than 72 characters',
          });
      });
    });
    context('Happy Path', () => {
      it('responds 201, serialized user, storing bcrypt password', () => {
        const newUser = {
          username: 'testuser',
          password: '12345678',
          email: 'email',
          first_name: 'john',
        };
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect((res) => {
            expect(res.body).to.have.property('id');
            expect(res.body.username).to.eql(newUser.username);
            expect(res.body.email).to.eql(newUser.email);
            expect(res.body.first_name).to.eql(newUser.first_name);
            expect(res.body).to.not.have.property('password');
          })
          .expect((res) =>
            db
              .from('users')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then((row) => {
                expect(row.username).to.eql(newUser.username);
                expect(row.first_name).to.eql(newUser.first_name);
              })
          );
      });
    });
  });
});
