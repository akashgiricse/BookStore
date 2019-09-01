const chai = require('chai');
const expect = chai.expect;

const app = require('../server');

//chai-http used to send async requests to our app
const http = require('chai-http');
chai.use(http);

//import User model
const User = require('../models/User');

describe('Users basic tests', () => {
  before(done => {
    //delete all users
    User.find()
      .deleteMany()
      .then(res => {
        console.log('Users removed');
        done();
      })
      .catch(err => {
        console.log(err.message);
      });
  });

  it('Should exists', () => {
    expect(app).to.be.a('function');
  });
});

describe('User registration', () => {
  it('/api/users/register should return 201', done => {
    //mock valid user input
    let user_input = {
      name: 'Test User',
      email: 'testuser@gmail.com',
      password: 'password1234'
    };
    //send /POST request to /api/users/register
    chai
      .request(app)
      .post('/api/users/register')
      .set('admin-signup-key', 'AdminRocks1234')
      .send(user_input)
      .then(res => {
        //validate
        expect(res).to.have.status(201);
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });

  it('/api/users/register should return 401 for invalid input', done => {
    //mock invalid user input
    let user_invalid_input = {
      name: 'Test User',
      email: '',
      password: 'password1234'
    };
    //send /POST request to /register
    chai
      .request(app)
      .post('/api/users/register')
      .send(user_invalid_input)
      .then(res => {
        //validate
        expect(res).to.have.status(401);
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });
});

describe('User login', () => {
  it('should return 200 and token for valid credentials', done => {
    //mock invalid user input
    const valid_input = {
      email: 'testuser@gmail.com',
      password: 'password1234'
    };
    //send request to the app
    chai
      .request(app)
      .post('/api/users/login')
      .send(valid_input)
      .then(res => {
        //assertions
        expect(res).to.have.status(200);
        expect(res.body.token).to.exist;
        done();
      })
      .catch(err => {
        console.log(err.message);
      });
  });

  after(done => {
    //stop app server
    console.log('All tests completed, stopping server....');
    process.exit();
    done();
  });
});
