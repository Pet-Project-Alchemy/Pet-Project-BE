require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

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
        password: '1234',
        firstName: 'baby',
        lastName: 'yoda',
        timeNeeded: '6am-noon',
        timeAvailable: 'noon-6pm',
        image: 'blah',
        address: {
          street: '1234',
          city: 'Portland',
          state: 'OR',
          zipcode: '97201'
        },
        dog: [
          {
            name: 'corgi',
            size: 'toy',
            breed: 'corgi',
            bio: 'Im chubby',
            img: '1234'
          }
        ]
      })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'corgi@corgi.com',
          firstName: 'baby',
          lastName: 'yoda',
          timeNeeded: '6am-noon',
          timeAvailable: 'noon-6pm',
          image: 'blah',
          address:
          {
            _id: expect.any(String),
            street: '1234',
            city: 'Portland',
            state: 'OR',
            zipcode: '97201'
          },
          dog: [
            {
              _id: expect.any(String),
              name: 'corgi',
              size: 'toy',
              breed: 'corgi',
              bio: 'Im chubby',
              img: '1234'
            }
          ],
          __v: 0
        });
      });
  });
  it('can login a user ', async() => {
    await User.create({
      email: 'corgi@corgi.com',
      password: '1234',
      firstName: 'baby',
      lastName: 'yoda',
      timeNeeded: '6am-noon',
      timeAvailable: 'noon-6pm',
      image: 'blah',
      address: {
        street: '1234',
        city: 'Portland',
        state: 'OR',
        zipcode: '97201'
      },
      dog: [
        {
          name: 'corgi',
          size: 'toy',
          breed: 'corgi',
          bio: 'Im chubby',
          img: '1234'
        }
      ]
    });
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'corgi@corgi.com',
        password: '1234'
      })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'corgi@corgi.com',
          firstName: 'baby',
          lastName: 'yoda',
          timeNeeded: '6am-noon',
          timeAvailable: 'noon-6pm',
          image: 'blah',
          address:
          {
            _id: expect.any(String),
            street: '1234',
            city: 'Portland',
            state: 'OR',
            zipcode: '97201'
          },
          dog: [
            {
              _id: expect.any(String),
              name: 'corgi',
              size: 'toy',
              breed: 'corgi',
              bio: 'Im chubby',
              img: '1234'
            }
          ],
          __v: 0
        });
      });
  });

  it('fails to login a user with a bad email', async() => {
    await User.create({
      email: 'corgi@corgi.com',
      password: '1234',
      firstName: 'baby',
      lastName: 'yoda',
      timeNeeded: '6am-noon',
      timeAvailable: 'noon-6pm',
      image: 'blah',
      address: {
        street: '1234',
        city: 'Portland',
        state: 'OR',
        zipcode: '97201'
      },
      dog: [
        {
          name: 'corgi',
          size: 'toy',
          breed: 'corgi',
          bio: 'Im chubby',
          img: '1234'
        }
      ]
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
      email: 'corgi@corgi.com',
      password: '1234',
      firstName: 'baby',
      lastName: 'yoda',
      timeNeeded: '6am-noon',
      timeAvailable: 'noon-6pm',
      image: 'blah',
      address: {
        street: '1234',
        city: 'Portland',
        state: 'OR',
        zipcode: '97201'
      },
      dog: [
        {
          name: 'corgi',
          size: 'toy',
          breed: 'corgi',
          bio: 'Im chubby',
          img: '1234'
        }
      ]
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
      email: 'corgi@corgi.com',
      password: '1234',
      firstName: 'baby',
      lastName: 'yoda',
      timeNeeded: '6am-noon',
      timeAvailable: 'noon-6pm',
      image: 'blah',
      address: {
        street: '1234',
        city: 'Portland',
        state: 'OR',
        zipcode: '97201'
      },
      dog: [
        {
          name: 'corgi',
          size: 'toy',
          breed: 'corgi',
          bio: 'Im chubby',
          img: '1234'
        }
      ]
    });

    const baby = request.agent(app);

    return baby
      .post('/api/v1/auth/login')
      .send({ email: 'corgi@corgi.com', password: '1234' })
      .then(()=>{
        return baby
          .get('/api/v1/auth/verify');
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: user._id.toString(),
          email: 'corgi@corgi.com',
          firstName: 'baby',
          lastName: 'yoda',
          timeNeeded: '6am-noon',
          timeAvailable: 'noon-6pm',
          image: 'blah',
          exp: expect.any(Number),
          iat: expect.any(Number),
          address:
          {
            _id: expect.any(String),
            street: '1234',
            city: 'Portland',
            state: 'OR',
            zipcode: '97201'
          },
          dog: [
            {
              _id: expect.any(String),
              name: 'corgi',
              size: 'toy',
              breed: 'corgi',
              bio: 'Im chubby',
              img: '1234'
            }
          ],
          __v: 0
        });
      });
  });
});
