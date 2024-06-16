const mongoose = require("mongoose");

const connect = () => {
  return mongoose
    .connect(
      "mongodb+srv://bhanu:Su8Lr4piCCjynIQo@webscraper.qgpzbdg.mongodb.net/?retryWrites=true&w=majority&appName=webscraper"
    )
    .then(() => console.log("Connection successful"))
    .catch((err)=> console.log(err));
};
 
module.exports = connect;