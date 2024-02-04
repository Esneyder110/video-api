import { z } from 'zod'

import { SecureUserSchema } from './userModels'
import { booleanParamSchema, mongoId } from './utilsModels'

/**
 * @openapi
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         createdAt:
 *           type: string
 *           example: 2024-02-03T17:35:12.953Z
 *         updatedAt:
 *           type: string
 *           example: 2024-02-03T17:35:12.953Z
 *         url:
 *           type: string
 *           example: 'https://www.youtube.com/watch?v=uHKfrz65KSU'
 *         title:
 *           type: string
 *           example: Cute Cats
 *         description:
 *           type: string
 *           example: Bla bla bla
 *         creditos:
 *           type: string
 *           example: Copycat Inc.
 *         isPublic:
 *           type: boolean
 *           example: true
 *         userId:
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 */

export const VideoSchema = z.object({
  id: mongoId,
  createdAt: z.date(),
  updatedAt: z.date(),
  url: z.string().url(),
  title: z.string().min(1),
  description: z.string().min(1),
  creditos: z.string().min(1),
  isPublic: z.boolean(),
  user: SecureUserSchema
})

export const GetOneVideoSchema = VideoSchema.pick({ id: true })
export const DeleteVideoSchema = GetOneVideoSchema

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateVideoDTO:
 *       type: object
 *       properties:
 *         title:
 *           description: Video title
 *           type: string
 *           example: Cute Cats
 *           required: true
 *         description:
 *           description: Video description
 *           type: string
 *           example: Miauu Miauu
 *           required: true
 *         creditos:
 *           description: Video credits
 *           type: string
 *           example: Michis
 *           required: true
 *         isPublic:
 *           description: Video privacity
 *           type: boolean
 *           example: true
 *           required: true
 */
export const CreateVideoSchema = VideoSchema.omit({ id: true, createdAt: true, updatedAt: true, url: true, user: true })

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateVideoDTO:
 *       type: object
 *       properties:
 *         title:
 *           description: Video title
 *           type: string
 *           example: Cute Cats
 *           required: false
 *         description:
 *           description: Video description
 *           type: string
 *           example: Miauu Miauu
 *           required: false
 *         creditos:
 *           description: Video credits
 *           type: string
 *           example: Michis
 *           required: false
 *         isPublic:
 *           description: Video privacity
 *           type: boolean
 *           example: true
 *           required: false
 */
export const UpdateVideoSchema = VideoSchema.omit({
  createdAt: true,
  updatedAt: true,
  user: true,
  url: true
}).partial({
  creditos: true,
  description: true,
  isPublic: true,
  title: true
})

export const VideoQuerySchema = VideoSchema.pick({ isPublic: true }).extend({
  userId: mongoId
}).extend({
  mostLiked: booleanParamSchema,
  isPublic: booleanParamSchema
}).partial()
