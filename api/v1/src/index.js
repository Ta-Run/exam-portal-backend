const express = require('express');

const app = express();
const cors = require('cors');
const helmet = require('helmet');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDOC = require('swagger-jsdoc');
require('dotenv').config();
const mongo = require('mongoose')
const {DBConnection} =require("./config/index")
const path = require('path');
// DB Connection
DBConnection(mongo);


const { logger } = require('./middlewares');
// Error handlers
const errorHandler = require('./handlers/errorHandler');
// Routes
const routes = require('./routes');
const options = require('../docs/swagger/swagger-options');


app.use(express.static('public'));


app.use('/upload', express.static(path.join(__dirname, 'upload')));

// Middlewares
app.use(cors({
  origin: '*',
}));

// app.use(logger);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// application routes
app.use('/api/v1', routes);


// swagger docs config
const swaggerSpecs = swaggerJSDOC(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

app.get('/', (req, res) => {
  res.send("Successfully api working");
});
// Not found error handler
// app.use(errorHandler.notFoundErrorHandler);

// handler for production errors
if (process.env.NODE_ENV === 'production') {
  app.use(errorHandler.productionErrorsHandler);
}

// lets handle the development error
// app.use(errorHandler.developmentErrorsHandler);

// exporting the app
module.exports = app;
