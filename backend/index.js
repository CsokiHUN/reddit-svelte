require('dotenv').config();
const PORT = process.env.PORT || 4000;

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: false, limit: '25mb' }));

mongoose.connect(process.env.MONGODB_URL, { dbName: 'reddit-svelte' }, (err) => {
  if (!err) return console.log('MongoDB connected successfully.');

  throw new Error(err);
});

const { auth } = require('./auth.js');

// Routers
const messageRoute = require('./routes/message');
app.use('/message', messageRoute);

const userRoute = require('./routes/user');
app.use('/user', userRoute);

app.get('/validatetoken', auth, (req, res) => {
  res.json({ result: true, token: req.token, user: req.user });
});

app.listen(PORT);
console.log(`App started port: ${PORT}`);
