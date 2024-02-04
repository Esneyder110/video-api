import { type NextFunction, type Request, type Response } from 'express'
import Boom from '@hapi/boom'
import { type Prisma } from '@prisma/client'

import { prisma } from '../services/db/prisma'
import { getRandomInt } from '../utils/utils'
import {
  CreateVideoSchema,
  DeleteVideoSchema,
  GetOneVideoSchema,
  VideoQuerySchema,
  UpdateVideoSchema
} from '../models/videosModel'

export const getAllVideos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const isAuth: string | undefined = req.user

    const { userId, isPublic, mostLiked } = VideoQuerySchema.parse(req.query)

    const orderBy: Prisma.VideoOrderByWithRelationInput = {
      likes: {
        _count: 'desc'
      }
    }

    const videos = await prisma.video.findMany({
      where: {
        userId,
        isPublic: !isAuth ? true : isPublic
      },
      orderBy: mostLiked ? orderBy : undefined
    })

    res.json({ data: videos })
  } catch (error) {
    next(error)
  }
}

export const getOneVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const isAuth: string | undefined = req.user
    const { id } = GetOneVideoSchema.parse({ id: req.params.id })

    const video = await prisma.video.findUnique({
      where: { id }
    })

    if (!video) throw Boom.notFound('Video not found')

    if (!video.isPublic && !isAuth) {
      throw Boom.forbidden('Video only can viewed by auth users')
    }

    res.json({ data: video })
  } catch (error) {
    next(error)
  }
}

export const getRandomVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const videos = await prisma.video.findMany({ where: { isPublic: true }, take: 1000 })
    if (!videos.length) throw Boom.notFound('Videos not found')

    const index = getRandomInt(videos.length - 1)
    const video = videos[index]

    res.json({ data: video })
  } catch (error) {
    next(error)
  }
}

export const createVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user.id
    const data = CreateVideoSchema.parse(req.body)

    const video = await prisma.video.create({
      data: {
        ...data,
        userId,
        url: 'https://www.youtube.com/watch?v=uHKfrz65KSU'
      }
    })

    res.status(201).json({ data: video })
  } catch (error) {
    next(error)
  }
}

export const updateVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, ...data } = UpdateVideoSchema.parse({
      id: req.params.id,
      ...req.body
    })
    const userId = req.user.id

    const videoBefore = await prisma.video.findUnique({
      where: { id }
    })

    if (!videoBefore) throw Boom.notFound('Video not found')

    if (videoBefore.userId !== userId) throw Boom.forbidden('Video can only be update by the author')

    const video = await prisma.video.update({
      where: { id },
      data
    })

    res.json({ data: video })
  } catch (error) {
    next(error)
  }
}

export const deleteVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user.id
    const { id: videoId } = DeleteVideoSchema.parse({ id: req.params.id })

    const videoBefore = await prisma.video.findUnique({
      where: { id: videoId }
    })

    if (!videoBefore) throw Boom.notFound('Video not found')

    if (videoBefore.userId !== userId) throw Boom.forbidden('Video can only be update by the author')

    await prisma.comment.deleteMany({ where: { videoId } })
    await prisma.like.deleteMany({ where: { videoId } })

    const video = await prisma.video.delete({
      where: { id: videoId }
    })

    res.json({ data: video })
  } catch (error) {
    next(error)
  }
}
