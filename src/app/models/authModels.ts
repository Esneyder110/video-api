/**
 * @openapi
 * components:
 *   schemas:
 *     Authentication:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           $ref: "#/components/schemas/User"
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2M1YjEwOWRkMjUzY2M3YTUxODA4MCIsImVtYWlsIjoidGhvckBnbWFpbC5jb20iLCJpYXQiOjE3MDMwMTIwMTQsImV4cCI6MTcwNTYwNDAxNH0.Sg698_1zNj3BqKJddGP5_sr1inZE01z1d6CbvwJUR1w
 *
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthenticationLoginDTO:
 *       type: object
 *       properties:
 *         email:
 *           description: User email
 *           type: string
 *           example: homer@simpson.com
 *         pass:
 *           description: User password
 *           type: string
 *           example: doh!doh!doh!
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthenticationRegisterDTO:
 *       type: object
 *       properties:
 *         email:
 *           description: User email
 *           type: string
 *           example: homer@simpson.com
 *         pass:
 *           description: User password
 *           type: string
 *           example: doh!doh!doh!
 *         name:
 *           description: User name
 *           type: string
 *           example: Homer
 */

import { z } from 'zod'

export const Credentials = z.object({
  email: z.string().email(),
  pass: z.string().min(10)
})

export const CredentialsSignUp = Credentials.extend({
  name: z.string().min(1)
})
