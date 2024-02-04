import { type ErrorRequestHandler, type Express } from 'express'
import Boom from '@hapi/boom'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

export function appErrorHandler (app: Express): void {
  app.use(logErrors)
  app.use(prismaErrorHandlerfunction)
  app.use(zodErrorHandlerfunction)
  app.use(boomErrorHandlerfunction)
  app.use(genericErrorHandler)
}

const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.log('=====================================================================')
  console.log(err, null, 2)
  console.log('=====================================================================')
  next(err)
}

const prismaErrorHandlerfunction: ErrorRequestHandler = (err, req, res, next) => {
  try {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        throw Boom.notFound()
      }

      if (err.code === 'P2002') {
        throw Boom.conflict()
      }
    }
    next(err)
  } catch (error) {
    next(error)
  }
}

const zodErrorHandlerfunction: ErrorRequestHandler = (err, req, res, next) => {
  try {
    if (err instanceof ZodError) {
      const errors = err.flatten()
      const msg = JSON.stringify(errors.fieldErrors)
      throw Boom.badRequest(msg)
    } else {
      next(err)
    }
  } catch (error) {
    next(error)
  }
}

const boomErrorHandlerfunction: ErrorRequestHandler = (err, req, res, next) => {
  if (Boom.isBoom(err)) {
    const { output } = err
    res.status(output.statusCode).json(output.payload)
  } else {
    next(err)
  }
}

const genericErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    status: err.status
  })
}
