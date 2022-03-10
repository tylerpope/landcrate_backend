require('dotenv').config();
const express = require('express');

const jsonErrorHandler = async (err, req, res, next) => {
  res.status(500).send({ error: 'Something went wrong. An error has been logged.' });
  console.error(err);
};

const app = express();
const port = 3001;
const bodyParser = require('body-parser');

const auth = require('./api/routes/auth');
const user = require('./api/routes/user');
const collection = require('./api/routes/collection');
const card = require('./api/routes/card');
require('./services/auth');

app.use(bodyParser.json());
app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/collections', collection);
app.use('/api/cards', card);
app.use(jsonErrorHandler);

app.listen(port, () => console.log(`App is running on ${port}`));
