import { ZodSchema } from 'zod'

export function validateBody<T>(
  schema: ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data)

  if (!result.success) {
    const errors = result.error.issues.map((issue) => issue.message)
    return { success: false, errors }
  }

  return { success: true, data: result.data }
}
