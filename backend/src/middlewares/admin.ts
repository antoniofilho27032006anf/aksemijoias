import { Request, Response, NextFunction } from 'express'

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as any).user

  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Acesso restrito a administradores'
    })
  }

  next()
}
