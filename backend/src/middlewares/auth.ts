import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthPayload {
  id: string
  email: string
  role: string
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Token de autenticação não encontrado'
    })
  }

  const token = authorization.split(' ')[1]

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthPayload

    ;(req as any).user = payload
    next()
  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido ou expirado'
    })
  }
}
