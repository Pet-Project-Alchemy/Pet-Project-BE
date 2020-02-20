require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
// const User = require('../lib/models/User');

describe('user routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can sign up a user ', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'corgi@corgi.com',
        passwordHash: 'secure'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'corgi@corgi.com',
          passwordHash: 'secure',
          __v: 0
        });
      });
  });
});
