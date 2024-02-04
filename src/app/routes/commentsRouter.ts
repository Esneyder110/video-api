import { Router } from 'express'

import { auth } from '../middleware/authMiddleware'
import { createComment, deleteComment, getAllComments, getOneComment, updateComment } from '../controllers/commentsController'

const commentRouter = Router()

// Enpoints protected with auth middleware
commentRouter.use(auth(true))

/**
* @openapi
* /api/v1/comments:
*   get:
*     summary: Get all comments
*     tags:
*       - Comments
*     parameters:
*       - in: query
*         name: videoId
*         schema:
*           type: string
*         required: false
*         description: Video id
*
*       - in: query
*         name: userId
*         schema:
*           type: string
*         required: false
*         description: User id of the comment
*
*       - in: query
*         name: text
*         schema:
*           type: string
*         required: false
*         description: Text that can contain the comment
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
*                     $ref: "#/components/schemas/Comment"
*       5XX:
*        description: Internal server error
*
*/
commentRouter.route('/').get(getAllComments)

/**
* @openapi
* /api/v1/comments/{id}:
*   get:
*     summary: Get one comment
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: Comment id
*     tags:
*       - Comments
*     responses:
*       200:
*         description: OK
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   $ref: "#/components/schemas/Comment"
*       400:
*         description: Bad Request
*       403:
*         description: Comment can only viewed by auth users
*       404:
*         description: Comment not found
*       5XX:
*        description: Internal server error
*
*/
commentRouter.route('/:id').get(getOneComment)
commentRouter.use(auth())

/**
 * @openapi
 * /api/v1/comments/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a comment
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment id
 *     tags:
 *       - Comments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/UpdateCommentDTO'
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
 *                   $ref: "#/components/schemas/Comment"
 *       400:
 *         description: Bad Request
 *       403:
 *         description: Comment can only be updated by owner user
 *       404:
 *         description: Comment not found
 *       5XX:
 *        description: Internal server error
 *
 */
commentRouter.route('/:id').patch(updateComment)

/**
 * @openapi
 * /api/v1/comments:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a comment
 *     tags:
 *       - Comments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateCommentDTO'
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
 *                   $ref: "#/components/schemas/Comment"
 *       400:
 *         description: Bad Request
 *       5XX:
 *        description: Internal server error
 *
 */
commentRouter.route('/').post(createComment)

/**
 * @openapi
 * /api/v1/comments/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a comment
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment id
 *     tags:
 *       - Comments
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
 *                   $ref: "#/components/schemas/Comment"
 *       400:
 *         description: Bad Request
 *       403:
 *         description: Comment can only be deleted by owner user
 *       404:
 *         description: Comment not found
 *       5XX:
 *        description: Internal server error
 *
 */
commentRouter.route('/:id').delete(deleteComment)

export default commentRouter
