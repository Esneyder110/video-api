import type SecureUser from '../../models/userModels'

declare global {
  namespace Express {
    interface Request {
      user: SecureUser
    }
  }
}
