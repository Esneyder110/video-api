import { z } from 'zod'

import { mongoId } from './utilsModels'

/**
 * @openapi
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         text:
 *           type: string
 *           example: bla bla bla
 *         userId:
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         videoId:
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *
 */

export const CommentSchema = z.object({
  id: mongoId,
  text: z.string().min(1),
  userId: mongoId,
  videoId: mongoId
})

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateCommentDTO:
 *       type: object
 *       properties:
 *         videoId:
 *           description: Video id
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *           required: true
 *         text:
 *           description: Comment text
 *           type: string
 *           example: Miauu Miauu
 *           required: true
 */
export const CreateCommentSchema = CommentSchema.pick({
  videoId: true,
  text: true
})

export const DeleteCommentSchema = CommentSchema.pick({ id: true })
export const GetAllCommentSchema = CommentSchema.omit({ id: true }).partial()
export const GetOneCommentSchema = CommentSchema.pick({ id: true })

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateCommentDTO:
 *       type: object
 *       properties:
 *         text:
 *           description: Comment text
 *           type: string
 *           example: Bla bla cla
 *           required: false
 */
export const UpdateCommentSchema = CommentSchema.pick({ id: true, text: true }).partial({ text: true })
