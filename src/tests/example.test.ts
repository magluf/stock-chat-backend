/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

process.env.NODE_ENV = 'test';
const should = chai.should();

chai.use(chaiHttp);

describe('Messages', () => {
  describe('/POST message', () => {
    it('it should not POST a new user named StockBot', (done) => {
      const user = {
        username: 'StockBot',
        email: 'email@email.com',
        password: '123',
      };
      chai
        .request(server)
        .post('/api/v1/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.equal(
            `Username 'StockBot' already in use.`,
          );
          done();
        });
    });
  });
});
