import { z } from 'zod'

import { mongoId } from './utilsModels'

/**
 * @openapi
 * components:
 *   schemas:
 *     Like:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         userId:
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         videoId:
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *
 */

export const LikeSchema = z.object({
  id: mongoId,
  videoId: mongoId,
  userId: mongoId
})

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateLikeDTO:
 *       type: object
 *       properties:
 *         videoId:
 *           description: Video id
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *           required: true
 */
export const CreateLikeSchema = LikeSchema.pick({
  videoId: true
})

export const DeleteLikeSchema = CreateLikeSchema
export const GetAllLikeSchema = CreateLikeSchema.partial()
export const GetCountLikeSchema = LikeSchema.pick({ videoId: true })
