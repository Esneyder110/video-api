import { Router } from 'express'

import { deleteMyUser, getMyUser, getUser, updateMyUser } from '../controllers/usersController'
import { auth } from '../middleware/authMiddleware'

const userRouter = Router()

// Enpoints protected with auth middleware

userRouter.use(auth(true))

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by id
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User id
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
 *                   $ref: "#/components/schemas/User"
 *       400:
 *         description: Bad Request
 *       5XX:
 *        description: Internal server error
 *
 */
userRouter.route('/:id').get(getUser)

userRouter.use(auth())
/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get my user
 *     tags:
 *       - User
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
 *                   $ref: "#/components/schemas/User"
 *       400:
 *         description: Bad Request
 *       5XX:
 *        description: Internal server error
 *
 */
userRouter.route('/').get(getMyUser)

/**
 * @openapi
 * /api/v1/users:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Update my user
 *     tags:
 *       - User
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/UpdateUserDTO'
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
 *                   $ref: "#/components/schemas/User"
 *       400:
 *         description: Bad Request
 *       5XX:
 *        description: Internal server error
 *
 */
userRouter.route('/').patch(updateMyUser)

/**
 * @openapi
 * /api/v1/videos:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete my user
 *     tags:
 *       - User
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
 *                   $ref: "#/components/schemas/User"
 *       400:
 *         description: Bad Request
 *       5XX:
 *        description: Internal server error
 *
 */
userRouter.route('/').delete(deleteMyUser)

export default userRouter
