import { type NextFunction, type Request, type Response } from 'express'
import Boom from '@hapi/boom'

import { prisma } from '../services/db/prisma'
import {
  CreateLikeSchema,
  DeleteLikeSchema,
  GetAllLikeSchema,
  GetCountLikeSchema
} from '../models/likesModel'

export const getAllLikesByVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const isAuth: string | undefined = req.user
    const { videoId } = GetAllLikeSchema.parse({ videoId: req.query.videoId })
    const isPublic = isAuth ? undefined : true

    const likes = await prisma.like.findMany({
      where: {
        video: {
          AND: {
            isPublic,
            id: videoId
          }
        },
        videoId
      }
    })

    res.json({ data: likes })
  } catch (error) {
    next(error)
  }
}

export const getLikesCountByVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const isAuth: string | undefined = req.user
    const { videoId } = GetCountLikeSchema.parse({ videoId: req.params.videoId })
    const isPublic = isAuth ? undefined : true

    const likesQuantity = await prisma.like.count({
      where: {
        video: {
          AND: {
            isPublic,
            id: videoId
          }
        },
        videoId
      }
    })

    res.json({ data: likesQuantity })
  } catch (error) {
    next(error)
  }
}

export const createLike = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = req.user.id
    const { videoId } = CreateLikeSchema.parse({ videoId: req.params.videoId })

    const likeExist = await prisma.like.findFirst({
      where: {
        userId,
        videoId
      }
    })

    if (likeExist) throw Boom.badRequest('User already like the video')

    const like = await prisma.like.create({
      data: {
        userId,
        videoId
      }
    })

    res.status(201).json({ data: like })
  } catch (error) {
    next(error)
  }
}

export const deleteLike = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = req.user.id
    const { videoId } = DeleteLikeSchema.parse({ videoId: req.params.videoId })

    const likeExist = await prisma.like.findFirst({
      where: {
        userId,
        videoId
      }
    })

    if (!likeExist) throw Boom.notFound('User dont like the video')

    const like = await prisma.like.delete({
      where: {
        id: likeExist.id
      }
    })

    res.json({ data: like })
  } catch (error) {
    next(error)
  }
}
