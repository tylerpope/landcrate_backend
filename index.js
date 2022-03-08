require('dotenv').config();
const express = require('express');

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

app.listen(port, () => console.log(`App is running on ${port}`));
