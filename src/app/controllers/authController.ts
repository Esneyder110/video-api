import { type Response, type NextFunction, type Request } from 'express'
import Boom from '@hapi/boom'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { prisma } from '../services/db/prisma'
import { type SecureUser } from '../models/userModels'
import { Credentials, CredentialsSignUp } from '../models/authModels'

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, pass } = Credentials.parse(req.body)
    const user = await prisma.user.findUnique({
      where: { email }
    })
    if (!user) throw Boom.notFound('User not found')
    const { password, ...rest } = user
    if (!await bcrypt.compare(pass, password)) throw Boom.unauthorized('Incorrect password')

    const token = createUserJWT(rest)
    const payload: { user: SecureUser, token: string } = { user: rest, token }
    res.json({ data: payload })
  } catch (error) {
    next(error)
  }
}

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, pass, name } = CredentialsSignUp.parse(req.body)
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(pass, salt)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPass,
        name
      }
    })
    const { password, ...rest } = user
    const token = createUserJWT(rest)
    const payload: { user: SecureUser, token: string } = { user: rest, token }
    res.status(201).json({ data: payload })
  } catch (error) {
    next(error)
  }
}

const createUserJWT = (user: SecureUser): string => {
  if (!process.env.JWT_SECRET) throw Boom.internal('JWT secret not found')
  return jwt.sign({ ...user }, process.env.JWT_SECRET ?? 'secret', {
    expiresIn: process.env.JWT_LIFETIME
  })
}
