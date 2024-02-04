import { Router } from 'express'

import { createVideo, deleteVideo, getAllVideos, getOneVideo, getRandomVideo, updateVideo } from '../controllers/videosController'
import { auth } from '../middleware/authMiddleware'

const videoRouter = Router()

videoRouter.use(auth(true))
/**
* @openapi
* /api/v1/videos:
*   get:
*     summary: Get all videos
*     tags:
*       - Videos
*     parameters:
*       - in: query
*         name: userId
*         schema:
*           type: string
*         required: false
*         description: User id of videos
*
*       - in: query
*         name: isPublic
*         schema:
*           type: boolean
*         required: false
*         description: Videos public or private
*
*       - in: query
*         name: mostLiked
*         schema:
*           type: boolean
*         required: false
*         description: Sort videos by popularity
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
*                     $ref: "#/components/schemas/Video"
*       5XX:
*        description: Internal server error
*
*/
videoRouter.route('/').get(getAllVideos)

/**
* @openapi
* /api/v1/videos/random:
*   get:
*     summary: Get random video
*     tags:
*       - Videos
*     responses:
*       200:
*         description: OK
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   $ref: "#/components/schemas/Video"
*       400:
*         description: Bad Request
*       404:
*         description: Video not found
*       5XX:
*        description: Internal server error
*
*/
videoRouter.route('/random').get(getRandomVideo)

/**
* @openapi
* /api/v1/videos/{id}:
*   get:
*     summary: Get one video
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: Video id
*     tags:
*       - Videos
*     responses:
*       200:
*         description: OK
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   $ref: "#/components/schemas/Video"
*       400:
*         description: Bad Request
*       403:
*         description: Video can only viewed by auth users
*       404:
*         description: Video not found
*       5XX:
*        description: Internal server error
*
*/
videoRouter.route('/:id').get(getOneVideo)

// Enpoints protected with auth middleware

videoRouter.use(auth())

/**
 * @openapi
 * /api/v1/videos:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a video
 *     tags:
 *       - Videos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateVideoDTO'
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
 *                   $ref: "#/components/schemas/Video"
 *       400:
 *         description: Bad Request
 *       5XX:
 *        description: Internal server error
 *
 */
videoRouter.route('/').post(createVideo)

/**
 * @openapi
 * /api/v1/videos/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a video
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Video id
 *     tags:
 *       - Videos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/UpdateVideoDTO'
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
 *                   $ref: "#/components/schemas/Video"
 *       400:
 *         description: Bad Request
 *       403:
 *         description: Video can only be updated by owner user
 *       404:
 *         description: Video not found
 *       5XX:
 *        description: Internal server error
 *
 */
videoRouter.route('/:id').patch(updateVideo)

/**
 * @openapi
 * /api/v1/videos/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a video
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Video id
 *     tags:
 *       - Videos
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
 *                   $ref: "#/components/schemas/Video"
 *       400:
 *         description: Bad Request
 *       403:
 *         description: Video can only be deleted by owner user
 *       404:
 *         description: Video not found
 *       5XX:
 *        description: Internal server error
 *
 */
videoRouter.route('/:id').delete(deleteVideo)

export default videoRouter
