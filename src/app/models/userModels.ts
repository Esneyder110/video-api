/**
 * @openapi
 * components:
 *   schemas:
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         email:
 *           type: string
 *           example: homer@simpson.com
 *         name:
 *           type: string
 *           example: Homer
 *         createdAt:
 *           type: string
 *           example: "2024-02-03T17:35:12.953Z"
 *         updatedAt:
 *           type: string
 *           example: "2024-02-03T17:35:12.953Z"
 */

import { z } from 'zod'
import { Credentials } from './authModels'
import { mongoId } from './utilsModels'

export interface User {
  id: string
  email: string
  password: string
  name: string
}

export type SecureUser = Pick<User, 'id' | 'email' | 'name' >

export const SecureUserSchema = z.object({
  id: mongoId,
  email: z.string().email(),
  name: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date()
})

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateUserDTO:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: homer@simpson.com
 *           description: User email
 *           required: false
 *         name:
 *           type: string
 *           example: Homer
 *           description: User name
 *           required: false
 *         pass:
 *           type: string
 *           example: doh!doh!doh!
 *           description: User password
*/
export const SecureUserUpdateSchema = Credentials.extend({ name: z.string().min(1) }).partial()
