const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');
const gptRouter = require('./routes/gpt');
const compilerRouter = require('./routes/compiler');

require('dotenv').config();

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/ai', gptRouter);
app.use('/compiler', compilerRouter);

module.exports = app;
