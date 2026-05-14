require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;

app.use(cors());

connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/states', require('./routes/states'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.all("/{*splat}", (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  }else if (req.accepts('json')) {
    res.join({"error": "404 Not Found"});
  } else {
    res.type('txt').send("404 Not Found");
  }
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});