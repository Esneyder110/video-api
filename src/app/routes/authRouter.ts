import { Router } from 'express'

import { login, register } from '../controllers/authController'

const authRouter = Router()
/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Login with credentials
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/AuthenticationLoginDTO'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   $ref: "#/components/schemas/Authentication"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Incorrect password
 *       404:
 *         description: User not found not found
 *       5XX:
 *        description: Internal server error
 *
 */
authRouter.route('/login').post(login)

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Sign Up with credentials
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/AuthenticationRegisterDTO'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   $ref: "#/components/schemas/Authentication"
 *       400:
 *         description: Bad Request
 *       409:
 *         description: Email already in use with by a user
 *       5XX:
 *        description: Internal server error
 *
 */
authRouter.route('/register').post(register)

export default authRouter
