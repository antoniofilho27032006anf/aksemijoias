import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.body)

    if (!parseResult.success) {
      return res.status(400).json({
        error: parseResult.error.errors.map((issue) => issue.message).join(', ')
      })
    }

    req.body = parseResult.data
    next()
  }
}
