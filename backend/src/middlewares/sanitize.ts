import { Request, Response, NextFunction } from 'express'

function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return value
      .replace(/<[^>]*>/g, '')
      .replace(/[{}$]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        sanitizeValue(val)
      ])
    )
  }

  return value
}

export function sanitizeMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body = sanitizeValue(req.body) as any
  next()
}
