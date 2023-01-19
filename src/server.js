const dotenv = require('dotenv').config({debug: true})
const app = require('./app')

const PORT = process.env.PORT || 8081;

const server = app.listen(PORT, () => {
    console.log("---------------");
    console.log("BACKEND RUNNİNG PORT:", PORT);
    console.log("---------------");
  });