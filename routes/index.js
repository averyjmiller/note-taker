const express = require('express');

// Import files containing routes
const notesRouter = require('./notes');

// Create an instance of express so we can apply the middleware and routing
const app = express();

app.use('/notes', notesRouter);

module.exports = app;