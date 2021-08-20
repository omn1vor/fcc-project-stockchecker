'use strict';

require('dotenv').config();
const mongoose = require('mongoose');

let Stock;

mongoose.set('useFindAndModify', false);
mongoose.connect(process.env['DB'], { useNewUrlParser: true, useUnifiedTopology: true });


const { Schema } = mongoose;
const stockSchema = new Schema({
  stock: { type: String, required: true },
  likes: Number
});

Stock = mongoose.model('Stock', stockSchema);


async function getLikes(stock, done) {
  let data;
  let result = { likes: 0 };
  const filter = { stock: stock };

  try {
    data = await Stock.findOne(filter).exec();
  } catch(err) {
    result.error = 'could not get likes from DB';
    return result;
  }
  if (data) {
    result.likes = data.likes;  
  }
  
  return result;
}

async function setLikes(stock, done) {  
  let result = { likes: 0 };
  const fieldsToUpdate = { $inc: { likes: 1 } };
  
  let data = await Stock.findOne( { stock: stock } ).exec();
  
  if (!data) {
    let err = await addStock(stock);
    if (err) {
      result.error = `could not add new stock: ${err}`;
      return result;
    }
    result.likes = 1;
    return result;
  }

  try {
    data = await Stock.findOneAndUpdate(
      { stock: stock },
      fieldsToUpdate,
      { new: true }).exec();    
  }
  catch(err) {
    result.error = err;    
  }
  
  result.likes = data.likes;
  return result;
}

async function addStock(stock) {  
  let data;
  const newStock = new Stock({
      stock: stock,
      likes: 1
    });

  try {  
    data = await newStock.save();
  } catch(err) {
    console.log(err);
    return err;
  }
  
  return '';
}

async function getUpdateLikes(stock, likes) {  
  let result;
  
  if (likes === true || String(likes).toLowerCase() === 'true') {
    result = await setLikes(stock);    
  }
  else {
    result = await getLikes(stock);
  }
  
  return result;
}


module.exports = {
  getUpdateLikes
}