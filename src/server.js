const path = require("path");
const express = require("express");

const app = express();

app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
})

const port = process.env.PORT || 8000;

app.listen(port, ()=>console.log(`app is running on ${port}`))