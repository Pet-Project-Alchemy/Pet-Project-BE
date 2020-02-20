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

  it('User model', () => {
    const user = new User({
      firstName: 'baby',
      lastName: 'yoda',
      timeNeeded: '6am-noon',
      timeAvailable: 'noon-6pm',
      image: 'blah',
      address: [
        { street: '1234', city: 'Portland', state: 'OR', zipcode: '97201' }
      ],
      dog: [
        {
          name: 'corgi',
          size: 'toy',
          DOB: Date.now(),
          breed: 'corgi',
          weight: 50,
          bio: 'Im chubby',
          img: '1234'
        }
      ]
    });
  });
});
