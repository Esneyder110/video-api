import { type NextFunction, type Request, type Response } from 'express'
import Boom from '@hapi/boom'
import bcrypt from 'bcrypt'

import { prisma } from '../services/db/prisma'

import { SecureUserSchema, SecureUserUpdateSchema } from '../models/userModels'

export const getMyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.user.id

    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) throw Boom.notFound('User not found')
    const data = SecureUserSchema.parse(user)
    res.json({ data })
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id
    console.log(req.params)

    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) throw Boom.notFound('User not found')
    const data = SecureUserSchema.parse(user)
    res.json({ data })
  } catch (error) {
    next(error)
  }
}

export const updateMyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { pass, ...rest } = SecureUserUpdateSchema.parse(req.body)
    const id = req.user.id

    let hashedPass

    if (pass) {
      const salt = await bcrypt.genSalt(10)
      hashedPass = await bcrypt.hash(pass, salt)
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...rest,
        password: hashedPass
      }
    })

    const updatedUser = SecureUserSchema.parse(user)

    res.json({ data: updatedUser })
  } catch (error) {
    next(error)
  }
}

export const deleteMyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user.id

    await prisma.like.deleteMany({ where: { userId } })
    await prisma.comment.deleteMany({ where: { userId } })
    await prisma.video.deleteMany({ where: { userId } })
    const user = await prisma.user.delete({
      where: { id: userId }
    })

    res.json({ data: SecureUserSchema.parse(user) })
  } catch (error) {
    next(error)
  }
}
