'use strict';
const axios = require('axios');
const mongoose = require('mongoose');
const {Stock} = require('../models/stock');
const requestAndReturnData = require('../controllers/requestAndReturnData');
const requester = new requestAndReturnData();
module.exports = function (app) {

  

  app.route('/api/stock-prices')
    .get(async function (req, res){
      let requestersIp = req.ip;
      console.log(requestersIp)
      let {stock,like} = req.query;
      console.log(stock);
      console.log(like);

      if(Array.isArray(stock)){
          console.log(stock + ' stock when we send an array')
          let stock1 = stock[0];
          console.log(stock1 + ' stock 1 at beginning')
          let stock2 = stock[1];
          console.log(stock2 + ' at the beginning')
          let symbol1,price1;
          let symbol2,price2;
          let data1 = await requester.requestData(stock1);
          let data2 = await requester.requestData(stock2);
          symbol1 = data1.symbol;
          symbol2 = data2.symbol;
          price1 = data1.price;
          price2 = data2.price;

          let stock1FromDB = await Stock.findOne({stockName:symbol1}).exec();
          let stock2FromDB = await Stock.findOne({stockName:symbol2}).exec();


          // we check if we had stocks in our database before!
          if(!stock1FromDB){
            stock1FromDB = new Stock({
              stockName:symbol1,
              likes:0
            });
            stock1FromDB.ipAdresses.push(requestersIp);
            if(like=true){
              stock1FromDB.likes++;
            }
            await stock1FromDB.save(function (err){
              if(err) return console.log(err);
            });
          }

          if(!stock2FromDB){
            stock2FromDB = new Stock({
              stockName:symbol2,
              likes:0
            });
            stock2FromDB.ipAdresses.push(requestersIp);
            if(like=true){
              stock2FromDB.likes++;
            }
            await stock2FromDB.save(function (err){
              if(err) return console.log(err);
            });
          }


          // we check if we received a like with query!
          // if requestersIp is not associated with the stock, we increment likes property
          if(like){
            if(stock1FromDB.ipAdresses.includes(requestersIp)){
              console.log(`${requestersIp} ipAdress already liked this so blocked!!`);
            }else{
              stock1FromDB.likes++;
              await stock1FromDB.save(function (err){
              if(err) return console.log(err);
            });
            }

            if(stock2FromDB.ipAdresses.includes(requestersIp)){
              console.log(`${requestersIp} ipAdress already liked this so blocked!!`)
            }else{
                stock2FromDB.likes++;
                await stock2FromDB.save(function (err){
                if(err) return console.log(err);
              })
            }

            // return res.send({
            //   stockData:[
            //     {
            //       stock:symbol1,
            //       price: price1,
            //       rel_likes: stock1FromDB.likes-stock2FromDB.likes
            //     },
            //     {
            //       stock:symbol2,
            //       price: price2,
            //       rel_likes: stock2FromDB.likes-stock1FromDB.likes
            //     }
            //   ]
            // })
          }
    
          return res.send({
            stockData:[
              {
                stock:symbol1,
                price: price1,
                rel_likes: stock1FromDB.likes-stock2FromDB.likes
              },
              {
                stock:symbol2,
                price: price2,
                rel_likes: stock2FromDB.likes-stock1FromDB.likes
              }
            ]
          })


        }
      let symbol;
      let price;

      let data =await requester.requestData(stock,symbol,price);
      symbol = data.symbol;
      price = data.price;
      // we should receive stock symbols as url parameters, then send a fetch request to the proxy api server.
      // we will get the symbol, and latestPrice properties from the response data.
      // if multiple stock symbol sent in url parameters, we will send multiple fetch request!

      // proxy stock data provider api https://stock-price-checker-proxy.freecodecamp.rocks/
      // usage GET https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/[symbol]/quote
     
      // await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`)
      // .then(function (response){
      //   symbol= response.data.symbol;
      //   price = response.data.latestPrice;
      // })
      // .catch(function (error){
      //   console.log(error)
      // })


      console.log(symbol);
      console.log(price);
      // get the stock object from our mongoDB (create one if this is the first time calling this stock)
      let stockFromDB = await Stock.findOne({stockName:symbol}).exec();
      if(!stockFromDB){
        stockFromDB = new Stock({
          stockName:symbol,
          likes:0
        });
        stockFromDB.ipAdresses.push(requestersIp);
        if(like=true){
          stockFromDB.likes++;
        }
        await stockFromDB.save(function (err){
          if(err) return console.log(err);
        });
        return res.send({
          stockData:{
            stock: symbol,
            price: price,
            likes: stockFromDB.likes
        }
      })
      }

      console.log(stockFromDB.ipAdresses);

      if(like){
        if(stockFromDB.ipAdresses.includes(requestersIp)){
          console.log(`${requestersIp} ipAdress already liked this so blocked!!`);
        }else{
          stockFromDB.likes++;
          await stockFromDB.save(function (err){
          if(err) return console.log(err);
        });
        }
      }

      res.send({
        stockData:{
          stock:symbol,
          price: price,
          likes: stockFromDB.likes
        }
      })



      
      // if there is no like=true in url params, we will return an object called stockData
      // that has property of stock: req.params.symbol
      // that has property of price: req.params.price
      // that has property of likes: mongoStock.likes

      // if there are multiple stocks in urlparams we will return an array of objects inside
      // stockData object

      // if there is a like=true in url params,
      // we will check if the requester's ip is inside the ip array of mongo stock object
      // if ip is inside the ip array, do not increment likes
      // if ip is not inside the ip array, increment likes
      // we will do this check for multiple stock objects if there are multiple stock params 

      // we will return an object called stockData
      // that has property of stock: req.params.symbol
      // that has property of price: req.params.price
      // that has property of rel_likes: Math.abs(mongoStock1.likes - mongoStock1.likes)
      // if there are multiple stocks in urlparams we will return an array of objects inside
      // stockData object

    

      
    });
    
};
