const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { LocalStorage } = require('node-localstorage');


const localStorage = new LocalStorage('./scratch');
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: ': Enhanced Authentication API',
      version: '1.0.0',
      description: 'API for user management operations By Himjyoti Talukdar',
    },
    servers: [
      {
        url: 'http://localhost:5000', // Replace with your actual server URL
      },
    ],
    securitySchemes: {
      bearerAuth: {
        type: 'key',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Optional, but recommended for JWT authentication
      }
    },
    security: [ // Apply Bearer token authentication globally (optional)
      { bearerAuth: [] },
    ],
  },
  apis: ['./routes/*.js'], // Adjust path to your API documentation files
  security: [ // Define security requirements per endpoint (optional)
    { getUserProfile: [{ bearerAuth: [] }],
      editUserProfile: [{ bearerAuth: [] }],
      getAllPublicProfiles: [], // Public endpoint, no security required
      getAllProfiles: [{ bearerAuth: [] }], // Admin-only endpoint
    },
  ],
};

const swaggerSpec = swaggerJsDoc(options);

function setupSwagger(app) {
  // Customize Swagger UI options (optional)
  const uiOptions = {
    customSiteTitle: 'Your API Documentation with JWT Authentication', // Set a custom title
    swaggerOptions: {
      authAction: {
        bearerAuth: {
          name: 'JWT Authentication', // Label for the authentication button
          // Provide a custom token retrieval function
          getToken: () => { 
            // Retrieve the token from node-localstorage
            return localStorage.getItem('token'); 
          },
        },
      },
    },
  };

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, uiOptions));
}

module.exports = setupSwagger;