const express = require('express');

const app = express();
const port = process.env.BACKEND_PORT || 6000;

app.get('/', (req, res) => {
  res.status(200).send({success: true});
});

app.listen(port, function () {
  console.log(`Start listening server at port: ${port}.`)
});