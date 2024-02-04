import express, { type Request, type Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { apiRouter } from './routes'
import { appErrorHandler } from './error/errorHandler'
import { swaggerDocs } from './docs/videoApiV1'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

console.log(`[server]: Eviroment: ${process.env.NODE_ENV}`)
const port = process.env.PORT
if (!port) throw new Error('no hay puerto')

app.get('/', (req: Request, res: Response) => {
  res.send('Hello BeMaster! I\'am esneyder')
})

apiRouter(app)
swaggerDocs(app, +port)

// Not found route
app.use((req, res) => {
  res.status(404).send('<h1>Not found</h1>')
})

// error handler
appErrorHandler(app)

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})

export {
  app,
  server
}
