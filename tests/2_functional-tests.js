const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let api = require('../routes/api');

suite('Functional Tests', () => {
  test('Viewing one stock: GET request to /api/stock-prices/', done => {
    chai.request(server)
      .get('/api/stock-prices?stock=goog')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, "goog");
        done();
      });
  });

  test('Viewing one stock and liking it: GET request to /api/stock-prices/', done => {
    chai.request(server)
      .get('/api/stock-prices?stock=goog')
      .end((err, resOne) => {
        chai.request(server)
          .get('/api/stock-prices?stock=goog&like=true')
          .end((err, res) => {            
            assert.equal(res.status, 200);
            assert.equal(res.body.stockData.stock, "goog");
            assert.equal(res.body.stockData.likes, resOne.body.stockData.likes + 1);
            done();
          });      
      });
  });

  test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', done => {
    chai.request(server)
      .get('/api/stock-prices?stock=goog')
      .end((err, resOne) => {
        chai.request(server)
          .get('/api/stock-prices?stock=goog&like=true')
          .end((err, res) => {            
            assert.equal(res.status, 200);
            assert.equal(res.body.stockData.stock, "goog");
            assert.equal(res.body.stockData.likes, resOne.body.stockData.likes + 1);
            done();
          });      
      });
  });

  test('Viewing two stocks: GET request to /api/stock-prices/', done => {
    chai.request(server)
      .get('/api/stock-prices?stock=goog&stock=msft')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.property(res.body.stockData[0], 'rel_likes');
        done();
      });
  });

  test('Viewing two stocks and liking them: GET request to /api/stock-prices/', done => {
    chai.request(server)
      .get('/api/stock-prices?stock=goog')
      .end((err, resOne) => {
        chai.request(server)
          .get('/api/stock-prices?stock=goog&stock=msft&like=true')
          .end((err, res) => {            
            assert.equal(res.status, 200);
            assert.isArray(res.body.stockData);            
            assert.deepInclude(res.body.stockData.map(e => ({stock: e.stock})), {stock: 'goog'});
            let i = res.body.stockData.map(e => e.stock).indexOf('goog');            
            assert.property(res.body.stockData[i], 'rel_likes');
            done();
          });      
      });
  });

});

