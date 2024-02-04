import { type Express } from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

// Basic Meta Informations about our API
const options = {
  definition: {
    openapi: '3.0.3',
    info: { title: 'Video App API', version: '1.0.0' },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          value: 'Bearer <JWT token here>'
        }
      }
    }
  },
  apis: ['./src/app/routes/*', './src/app/models/*']
}
// Docs in JSON format
const swaggerSpec = swaggerJSDoc(options)

// Function to setup our docs
export const swaggerDocs = (app: Express, port: number): void => {
  // Route-Handler to visit our docs
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  // Make our docs in JSON format available
  app.get('/api/v1/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
  console.log(
      `[server]: Version 1 Docs are available on http://localhost:${port}/api/v1/docs`
  )
}
