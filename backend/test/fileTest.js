0

import chai from 'chai'
import chaiHttp from 'chai-http'
import app from "../app.js"
import { TOKEN } from "../apiKeys.js"

chai.use(chaiHttp)
chai.should();

describe('File API', () => {
  describe('/GET /files/data', () => {
    it('It should get a error of 401 for missing token', (done) => {
      chai.request(app)
        .get('/files/data')
        .end((err, response) => {
          response.should.have.status(401);
          done();
        });
    });

    it('It should get a success response', (done) => {
      chai.request(app)
        .get('/files/data')
        .set({ authorization: `Bearer ${TOKEN}` })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          done();
        });
    });

    it('It should get a 404 error not found', (done) => {
      chai.request(app)
        .get('/files/data1')
        .set({ authorization: `Bearer ${TOKEN}` })
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });

  });
});


