let chai = require('chai');
const expect = chai.expect;
const app = require('../server');
//chai-http used to send async requests to our app
const http = require('chai-http');
chai.use(http);

// import User and Book model
const Book = require('../models/Book');

describe('Books basic tests', () => {
  before(done => {
    Book.find()
      .deleteMany()
      .then(res => {
        console.log('Books removed');
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

describe('Add a book', () => {
  it('/api/books should return 200 if everything is correct', done => {
    //mock login to get token
    const valid_input = {
      email: 'testuser@gmail.com',
      password: 'password1234'
    };
    //send login request to the app to receive token
    chai
      .request(app)
      .post('/api/users/login')
      .send(valid_input)
      .then(login_response => {
        //add token to next request Authorization headers as adw3R£$4wF43F3waf4G34fwf3wc232!w1C"3F3VR
        const token = login_response.body.token;
        const book_detail = {
          title: 'Malgudi days',
          description: 'Malgudi days is an awesome book',
          price: 500,
          stock: 100
        };
        chai
          .request(app)
          .post('/api/books')
          .set('x-auth-token', token)
          .send(book_detail)
          .then(book_response => {
            //assertions
            expect(book_response).to.have.status(200);

            done();
          })
          .catch(err => {
            console.log(err.message);
          });
      })
      .catch(err => {
        console.log(err.message);
      });
  });

  it('/api/books should return 401 if for invalid book details', done => {
    //mock login to get token
    const valid_input = {
      email: 'testuser@gmail.com',
      password: 'password1234'
    };
    //send login request to the app to receive token
    chai
      .request(app)
      .post('/api/users/login')
      .send(valid_input)
      .then(login_response => {
        //add token to next request Authorization headers as adw3R£$4wF43F3waf4G34fwf3wc232!w1C"3F3VR
        const token = login_response.body.token;
        const book_detail = {
          title: '',
          description: 'Malgudi days is an awesome book',
          price: 500,
          stock: 100
        };
        chai
          .request(app)
          .post('/api/books')
          .set('x-auth-token', token)
          .send(book_detail)
          .then(book_response => {
            //assertions
            expect(book_response).to.have.status(401);

            done();
          })
          .catch(err => {
            console.log(err.message);
          });
      })
      .catch(err => {
        console.log(err.message);
      });
  });

  after(done => {
    //stop app server
    done();
  });
});

describe('Delete a book', () => {
  before(done => {
    Book.find()
      .deleteMany()
      .then(res => {
        console.log('Books removed');
        done();
      })
      .catch(err => {
        console.log(err.message);
      });
  });
  it('/api/books should return 200 if book is deleted', done => {
    //mock login to get token
    const valid_input = {
      email: 'testuser@gmail.com',
      password: 'password1234'
    };
    //send login request to the app to receive token
    chai
      .request(app)
      .post('/api/users/login')
      .send(valid_input)
      .then(login_response => {
        //add token to next request Authorization headers as adw3R£$4wF43F3waf4G34fwf3wc232!w1C"3F3VR
        const token = login_response.body.token;
        const book_detail = {
          title: 'Malgudi days',
          description: 'Malgudi days is an awesome book',
          price: 500,
          stock: 100
        };
        chai
          .request(app)
          .post('/api/books')
          .set('x-auth-token', token)
          .send(book_detail)
          .then(book_response => {
            // get book id
            const bookId = book_response.body.newBook._id;
            chai
              .request(app)
              .delete(`/api/books/${bookId}`)
              .set('x-auth-token', token)
              .then(res => {
                expect(res).to.have.status(200);
                done();
              });
          })
          .catch(err => {
            console.log(err.message);
          });
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
