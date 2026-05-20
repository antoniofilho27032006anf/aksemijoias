import jwt from 'jsonwebtoken'
import { AuthPayload } from '../middlewares/auth'

export function createAccessToken(payload: AuthPayload) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    {
      expiresIn: '7d'
    }
  )
}

export function createRefreshToken(payload: AuthPayload) {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: '30d'
    }
  )
}
