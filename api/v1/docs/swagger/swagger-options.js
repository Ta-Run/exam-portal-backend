const options = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'API Documentation', // Name of your api.
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}/api/v1`,
        description: 'Development server',
      },
      {
        url: `http://192.168.1.23:${process.env.PORT || 4000}/api/v1`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        // bearerAuth: [],
      },
    ],
  },
  apis: ['./api/v1/src/**/*.js'],
};

module.exports = options;
