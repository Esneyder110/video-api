import { type NextFunction, type Request, type Response } from 'express'
import Boom from '@hapi/boom'

import { prisma } from '../services/db/prisma'
import { CreateCommentSchema, DeleteCommentSchema, GetAllCommentSchema, GetOneCommentSchema, UpdateCommentSchema } from '../models/commentsModel'

export const getAllComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const isAuth: string | undefined = req.user
    const { videoId, userId, text } = GetAllCommentSchema.parse(req.query)

    const isPublic = isAuth ? undefined : true

    const comments = await prisma.comment.findMany({
      where: {
        video: {
          AND: {
            isPublic,
            id: videoId
          }
        },
        videoId,
        userId,
        text: {
          contains: text,
          mode: 'insensitive'
        }
      }
    })

    res.json({ data: comments })
  } catch (error) {
    next(error)
  }
}

export const getOneComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const isAuth: string | undefined = req.user
    const { id } = GetOneCommentSchema.parse(req.params)

    const comment = await prisma.comment.findUnique({
      where: {
        id
      },
      include: {
        video: true
      }
    })

    if (!comment) throw Boom.notFound('Comment not found')

    if (!comment.video.isPublic && !isAuth) throw Boom.forbidden('Comment only can viewed by auth users')

    const { video, ...payload } = comment

    res.json({ data: payload })
  } catch (error) {
    next(error)
  }
}

export const createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = req.user.id
    const { videoId, text } = CreateCommentSchema.parse({ videoId: req.body.videoId, text: req.body.text })

    const comment = await prisma.comment.create({
      data: {
        text,
        userId,
        videoId
      }
    })

    res.status(201).json({ data: comment })
  } catch (error) {
    next(error)
  }
}

export const updateComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, text } = UpdateCommentSchema.parse({
      id: req.params.id,
      ...req.body
    })
    const userId = req.user.id

    const commentBefore = await prisma.comment.findUnique({
      where: { id }
    })

    if (!commentBefore) throw Boom.notFound('Comment not found')

    if (commentBefore.userId !== userId) throw Boom.forbidden('Comment can only be update by the author')

    const comment = await prisma.comment.update({
      where: { id },
      data: {
        text
      }
    })

    res.json({ data: comment })
  } catch (error) {
    next(error)
  }
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = req.user.id
    const { id } = DeleteCommentSchema.parse(req.params)

    const commentExist = await prisma.comment.findUnique({
      where: {
        id
      }
    })

    if (!commentExist) throw Boom.notFound('Comment dont exist')

    if (commentExist.userId !== userId) throw Boom.forbidden('User can not delete this comment, only the author')

    const comment = await prisma.comment.delete({
      where: {
        id
      }
    })

    res.json({ data: comment })
  } catch (error) {
    next(error)
  }
}
