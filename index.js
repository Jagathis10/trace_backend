const express = require('express');
const cors = require('cors');
const connectDB = require('./src/db/index.js');
const routes = require('./src/routes/route.js');
const toolsRoutes = require('./src/routes/tools.js');

const app = express();
const apiPort = 3000;
connectDB();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  console.log("request", req.method, req.url);
  next();
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cors("*"));

app.use ("/api", routes)
app.listen(apiPort, () => {
  console.log(`Server running at:${apiPort}`);
});

//tools routes
app.use("/api/tools", toolsRoutes);


module.exports = app;