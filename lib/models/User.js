const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipcode: {
    type: String,
    required: true
  }
});

const dogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your pups name']
  },
  size: {
    type: String,
    required: [true, 'is your dog toy, small, medium, large or extra-large?'],
    enum: ['toy', 'small', 'medium', 'large', 'extra-large']
  },
  breed: {
    type: String,
    required: [true, 'please add a breed']
  },
  weight: {
    type: Number,
    min: [1, 'must be number, dog must weigh between 1-200'],
    max: [200, 'must be number, dog must weigh between 1-200']
  },
  bio: {
    type: String,
    required: false
  },
  img: {
    type: String,
    required: [true, 'please upload a photo']
  }
});

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: [true, 'please enter name']
  },
  lastName: {
    type: String,
    required: [true, 'please enter name']
  },
  bio: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  timeNeeded: {
    type: String,
    enum: ['6am-noon', 'noon-6pm', '6pm-midnight'],
    required: [true, 'enter a time frame']
  },
  timeAvailable: {
    type: String,
    enum: ['6am-noon', 'noon-6pm', '6pm-midnight'],
    required: [true, 'enter a time frame']
  },
  address: [addressSchema],
  dog: [dogSchema]
});

module.exports = mongoose.model('User', schema);
