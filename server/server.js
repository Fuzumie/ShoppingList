require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const shoppingListRoutes = require('./routes/shoppingListRoutes');
const { errorHandler } = require("./middleware/errorHandler");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
});


app.use('/user', userRoutes);
app.use('/list', shoppingListRoutes);

app.use(errorHandler);
mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {
    console.log("Connected to database.");
    app.listen(8000, () => {
      console.log("Server is running on port 8000");
    });
  })
  .catch(() => {
    console.log("Connection failed.");
  });  