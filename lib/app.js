const express = require('express');
const app = express();
const cookieparser = require('cookie-parser');
const cors = require('cors');

app.use(express.json());
app.use(cookieparser());
app.use(cors());
app.use('/api/v1/auth', require('./routes/user'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
