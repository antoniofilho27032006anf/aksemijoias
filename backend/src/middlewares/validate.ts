import { Request, Response, NextFunction } from 'express'
import { ZodType } from 'zod'

export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.body)

    if (!parseResult.success) {
      console.log('Validation error:', JSON.stringify(parseResult.error.issues))
      return res.status(400).json({
        error: parseResult.error.issues.map((issue: any) => issue.message).join(', ')
      })
    }

    req.body = parseResult.data
    next()
  }
}
