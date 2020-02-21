require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

  it('can sign up a user ', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'corgi@corgi.com',
        password: 'secure'
      })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'corgi@corgi.com',
          __v: 0
        });
      });
  });
  it('can login a user ', async() => {
    const user = await User.create({
      email:'corgi@corgi.com',
      password: 'secure'
    });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ 
        email:'corgi@corgi.com',
        password: 'secure'
      })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: user.id,
          email: 'corgi@corgi.com',
          __v: 0
        });
      });
  });

  it('fails to login a user with a bad email', async() => {
    await User.create({
      email: 'test@test.com',
      password: 'password'
    });

    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'badEmail@notgood.io', password: 'password' })
      .then(res => {
        expect(res.status).toEqual(401);
        expect(res.body).toEqual({
          status: 401,
          message: 'Invalid Email or Password'
        });
      });
  });

  it('fails to login a user with a bad password', async() => {
    await User.create({
      email: 'test@test.com',
      password: 'password'
    });

    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: 'notright' })
      .then(res => {
        expect(res.status).toEqual(401);
        expect(res.body).toEqual({
          status: 401,
          message: 'Invalid Email or Password'
        });
      });
  });

  it('can verify if a user is logged in', async() => {
    const user = await User.create({
      email: 'test@test.com',
      password: 'password'
    });

    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: 'password' });

    return agent
      .get('/api/v1/auth/verify')
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          email: 'test@test.com',
          __v: 0
        });
      }) ;
  });
});
