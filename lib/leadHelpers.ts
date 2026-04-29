import { ILead } from '@/types/index'
import { UpdateLeadInput } from './schemas'

function parseDateOnly(value?: string | Date | null): Date | null {
  if (!value) return null

  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate())
  }

  const parts = value.split('-').map(Number)

  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    return null
  }

  const [year, month, day] = parts
  return new Date(year, month - 1, day)
}

export function formatFollowUpDate(value: string | Date | null | undefined): string {
  const parsed = parseDateOnly(value ?? null)

  if (!parsed) {
    return ''
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function describeChanges(oldLead: ILead, updates: UpdateLeadInput): string {
  const changes: string[] = []
  const oldFollowUpDate = parseDateOnly(oldLead.followUpDate)
  const nextFollowUpDate = parseDateOnly(updates.followUpDate)

  if (updates.status && updates.status !== oldLead.status) {
    changes.push(`Status changed from ${oldLead.status} to ${updates.status}`)
  }

  if (updates.notes && updates.notes !== oldLead.notes) {
    changes.push('Notes updated')
  }

  if (
    nextFollowUpDate &&
    (!oldFollowUpDate || oldFollowUpDate.getTime() !== nextFollowUpDate.getTime())
  ) {
    changes.push(`Follow-up date set to ${formatFollowUpDate(updates.followUpDate)}`)
  }

  if (updates.name && updates.name !== oldLead.name) {
    changes.push(`Name updated to ${updates.name}`)
  }

  if (updates.email && updates.email !== oldLead.email) {
    changes.push(`Email updated to ${updates.email}`)
  }

  if (updates.phone && updates.phone !== oldLead.phone) {
    changes.push(`Phone updated to ${updates.phone}`)
  }

  if (updates.propertyInterest && updates.propertyInterest !== oldLead.propertyInterest) {
    changes.push(`Property interest updated to ${updates.propertyInterest}`)
  }

  if (updates.budget && updates.budget !== oldLead.budget) {
    changes.push(`Budget updated to PKR ${updates.budget.toLocaleString('en-PK')}`)
  }

  if (changes.length === 0) {
    return 'Lead updated'
  }

  return changes.join('; ')
}
