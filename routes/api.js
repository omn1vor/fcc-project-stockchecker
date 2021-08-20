'use strict';

const stocks = require('../controllers/stocks');
const db = require('../controllers/db');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      const stock = req.query.stock;
    
      if (!stock) {
        return res.json({ error: 'stock query parameter is needed' });
      }
      let stockArr;
      if (typeof stock == 'string') {
        stockArr = [stock];
      } else {
        stockArr = stock.slice();
      }
      
      let result = {};
      let stocksData = [];

      await Promise.all(stockArr.map(async stock => {
        let stockData = { stock: stock };
        
        const priceData = await stocks.getPrice(stock);
        if (priceData.error) return res.json({ error: priceData.error });
        stockData.price = priceData.price;
        
        const likesData = await db.getUpdateLikes(stock, req.query.like);
        if (likesData.error) return res.json({ error: likesData.error });
        stockData.likes = likesData.likes;
      
        stocksData.push(stockData);
      }));

      // one stock
      if (stocksData.length == 1) {
        result.stockData = stocksData[0];
        return res.json(result);
      }

      // two stocks
      result.stockData = [];
      
      result.stockData.push({
        stock: stocksData[0].stock,
        price: stocksData[0].price,
        rel_likes: stocksData[0].likes - stocksData[1].likes
      });

      result.stockData.push({
        stock: stocksData[1].stock,
        price: stocksData[1].price,
        rel_likes: stocksData[1].likes - stocksData[0].likes
      });
      
      return res.json(result);
    });
    
};
