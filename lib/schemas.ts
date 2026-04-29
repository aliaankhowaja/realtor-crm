import { z } from 'zod'

export const CreateLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  propertyInterest: z.enum(['House', 'Plot', 'Apartment', 'Commercial', 'Other']),
  budget: z.number().positive('Budget must be a positive number'),
  notes: z.string().optional().default('')
})

export const UpdateLeadSchema = z.object({
  status: z.enum(['New', 'Contacted', 'In Progress', 'Closed']).optional(),
  notes: z.string().optional(),
  followUpDate: z.string().optional(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  propertyInterest: z.enum(['House', 'Plot', 'Apartment', 'Commercial', 'Other']).optional(),
  budget: z.number().positive().optional()
})

export type CreateLeadInput = z.infer<typeof CreateLeadSchema>
export type UpdateLeadInput = z.infer<typeof UpdateLeadSchema>
