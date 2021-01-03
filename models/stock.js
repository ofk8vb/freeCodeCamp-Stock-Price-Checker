const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const stockSchema = new Schema(
  {
    stockName:{
      type: String,
    },
    likes:{
      type: Number
    },
    ipAdresses:[{
      type: String
    }
    ]

  }
);

//middleware for mongoose that will create or update Date properties


const Stock = mongoose.model('Stock',stockSchema) 

module.exports = {Stock};