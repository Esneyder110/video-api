import { Router } from 'express'

import { getAllLikesByVideo, createLike, deleteLike, getLikesCountByVideo } from '../controllers/likesController'
import { auth } from '../middleware/authMiddleware'

const likeRouter = Router()

// Enpoints protected with auth middleware
likeRouter.use(auth(true))

/**
* @openapi
* /api/v1/likes:
*   get:
*     summary: Get all likes
*     tags:
*       - Likes
*
*     parameters:
*       - in: query
*         name: videoId
*         schema:
*           type: string
*         required: false
*         description: Video id
*
*     responses:
*       200:
*         description: OK
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: array
*                   items:
*                     $ref: "#/components/schemas/Like"
*       5XX:
*        description: Internal server error
*
*/
likeRouter.route('/').get(getAllLikesByVideo) // likes from a video or all videos

/**
* @openapi
* /api/v1/likes/{videoId}/count:
*   get:
*     summary: Get count of likes
*     tags:
*       - Likes
*
*     parameters:
*       - in: patha
*         name: videoId
*         schema:
*           type: string
*         required: true
*         description: Video id
*
*     responses:
*       200:
*         description: OK
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: array
*                   items:
*                     $ref: "#/components/schemas/Like"
*       5XX:
*        description: Internal server error
*
*/
likeRouter.route('/:videoId/count').get(getLikesCountByVideo) // count of likes by specific video id = videoId

likeRouter.use(auth())

/**
 * @openapi
 * /api/v1/likes/{videoId}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a like
 *     tags:
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Video id
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateLikeDTO'
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
 *                   $ref: "#/components/schemas/Like"
 *       400:
 *         description: Bad Request
 *       5XX:
 *        description: Internal server error
 *
 */
likeRouter.route('/:videoId').post(createLike)

/**
 * @openapi
 * /api/v1/likes/{videoId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a like
 *     tags:
 *       - Likes
 *
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Video id
 *
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
 *                   $ref: "#/components/schemas/Like"
 *       400:
 *         description: Bad Request
 *       5XX:
 *        description: Internal server error
 *
 */
likeRouter.route('/:videoId').delete(deleteLike)

export default likeRouter
