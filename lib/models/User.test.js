const mongoose = require('mongoose');

const User = require('./User');

describe('user model', () => {
  it('has a first name', () => {
    const user = new User();
    const { errors } = user.validateSync();

    expect(errors.firstName.message).toEqual('please enter name');
  });

  it('has a last name', () => {
    const user = new User();
    const { errors } = user.validateSync();

    expect(errors.lastName.message).toEqual('please enter name');
  });

  it('has email', () => {
    const user = new User();
    const { errors } = user.validateSync();

    expect(errors.email.message).toEqual('Path `email` is required.');
  });

  it('has passwordHash', () => {
    const user = new User();
    const { errors } = user.validateSync();

    expect(errors.passwordHash.message).toEqual(
      'Path `passwordHash` is required.'
    );
  });

  it('has timeNeeded', () => {
    const user = new User();
    const { errors } = user.validateSync();

    expect(errors.timeNeeded.message).toEqual('enter a time frame');
  });

  it('has timeAvailable', () => {
    const user = new User();
    const { errors } = user.validateSync();

    expect(errors.timeAvailable.message).toEqual('enter a time frame');
  });

  it('User model', () => {
    const user = new User({
      email: 'corgi@corgi.com',
      passwordhash: '1234',
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
    expect(user.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      email: 'corgi@corgi.com',
      firstName: 'baby',
      lastName: 'yoda',
      timeNeeded: '6am-noon',
      timeAvailable: 'noon-6pm',
      image: 'blah',
      address: 
      {
        _id: expect.any(mongoose.Types.ObjectId),
        street: '1234',
        city: 'Portland',
        state: 'OR',
        zipcode: '97201'
      },
      dog: [
        {
          _id: expect.any(mongoose.Types.ObjectId),
          name: 'corgi',
          size: 'toy',
          breed: 'corgi',
          bio: 'Im chubby',
          img: '1234'
        }
      ]
    });
  });
});

describe('user has an address', () => {
  it('address', () => {
    const user = new User({
      address: {
        street: '1234',
        city: 'Portland',
        state: 'OR',
        zipcode: '97201'
      },
      dog: []
    });
    expect(user.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      address: {
        _id: expect.any(mongoose.Types.ObjectId),
        street: '1234',
        city: 'Portland',
        state: 'OR',
        zipcode: '97201'
      },
      dog: []
    });
  });
});
