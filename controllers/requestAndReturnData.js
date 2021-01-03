const axios = require('axios')

class requestAndReturnData{
  async requestData(stock,symbol,price){
    await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`)
      .then(function (response){
        console.log(response.data.symbol)
        symbol= response.data.symbol;
        price = response.data.latestPrice;
      })
      .catch(function (error){
        console.log(error)
      })
    return {symbol,price};
  }
}

module.exports = requestAndReturnData;