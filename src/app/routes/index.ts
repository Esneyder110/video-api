import { type Express, Router } from 'express'

import authRouter from './authRouter'
import videoRouter from './videosRouter'
import likeRouter from './likesRouter'
import commentRouter from './commentsRouter'
import userRouter from './usersRouter'

export const apiRouter = (app: Express): void => {
  const apiv1 = Router()
  apiv1.use('/auth', authRouter)
  apiv1.use('/videos', videoRouter)
  apiv1.use('/comments', commentRouter)
  apiv1.use('/likes', likeRouter)
  apiv1.use('/users', userRouter)

  app.use('/api/v1', apiv1)
}
