import { ILead } from '@/types/index'
import { UpdateLeadInput } from './schemas'

export function describeChanges(oldLead: ILead, updates: UpdateLeadInput): string {
  const changes: string[] = []

  if (updates.status && updates.status !== oldLead.status) {
    changes.push(`Status changed from ${oldLead.status} to ${updates.status}`)
  }

  if (updates.notes && updates.notes !== oldLead.notes) {
    changes.push('Notes updated')
  }

  if (updates.followUpDate && updates.followUpDate !== oldLead.followUpDate?.toISOString()) {
    changes.push(`Follow-up date updated to ${updates.followUpDate}`)
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
