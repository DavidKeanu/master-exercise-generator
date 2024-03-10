const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');
const gptRouter = require('./routes/gpt');
const compilerRouter = require('./routes/compiler');
const dbRouter = require('./routes/database');


require('dotenv').config();

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/ai', gptRouter);
app.use('/compiler', compilerRouter);
app.use('/db', dbRouter)

module.exports = app;
