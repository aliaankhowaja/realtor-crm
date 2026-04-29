import { ILead } from '@/types/index'

// Helper function to format budget in PKR
function formatBudget(budget: number): string {
  return `PKR ${budget.toLocaleString('en-US')}`
}

export function newLeadTemplate(lead: ILead): { subject: string; html: string } {
  const subject = 'New Lead Created - Property CRM'

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <!-- Header -->
        <div style="background-color: #003d82; color: white; padding: 20px; text-align: center; border-radius: 4px 4px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">New Lead Created</h1>
        </div>

        <!-- Content -->
        <div style="background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 4px 4px;">
          <p style="margin-top: 0;">A new lead has been created in the system. Please review the details below:</p>

          <!-- Details Table -->
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 12px; background-color: #f0f0f0; font-weight: bold; width: 40%; border: 1px solid #ddd;">Lead Name</td>
              <td style="padding: 12px; background-color: #ffffff; border: 1px solid #ddd;">${lead.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f0f0f0; font-weight: bold; width: 40%; border: 1px solid #ddd;">Email</td>
              <td style="padding: 12px; background-color: #ffffff; border: 1px solid #ddd;"><a href="mailto:${lead.email}" style="color: #003d82; text-decoration: none;">${lead.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f0f0f0; font-weight: bold; width: 40%; border: 1px solid #ddd;">Phone</td>
              <td style="padding: 12px; background-color: #ffffff; border: 1px solid #ddd;"><a href="tel:${lead.phone}" style="color: #003d82; text-decoration: none;">${lead.phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f0f0f0; font-weight: bold; width: 40%; border: 1px solid #ddd;">Property Interest</td>
              <td style="padding: 12px; background-color: #ffffff; border: 1px solid #ddd;">${lead.propertyInterest}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f0f0f0; font-weight: bold; width: 40%; border: 1px solid #ddd;">Budget</td>
              <td style="padding: 12px; background-color: #ffffff; border: 1px solid #ddd;">${formatBudget(lead.budget)}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f0f0f0; font-weight: bold; width: 40%; border: 1px solid #ddd;">Priority Score</td>
              <td style="padding: 12px; background-color: #ffffff; border: 1px solid #ddd;">
                <span style="display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold;${
                  lead.score === 'High' ? ' background-color: #d4edda; color: #155724;' : lead.score === 'Medium' ? ' background-color: #fff3cd; color: #856404;' : ' background-color: #f8d7da; color: #721c24;'
                }">
                  ${lead.score}
                </span>
              </td>
            </tr>
          </table>

          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
            <p style="margin: 0;">This is an automated message from Property CRM</p>
          </div>
        </div>
      </body>
    </html>
  `

  return { subject, html }
}

export function leadAssignedTemplate(lead: ILead, agentName: string): { subject: string; html: string } {
  const subject = `Lead Assigned to You - ${lead.name}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <!-- Header -->
        <div style="background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 4px 4px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Lead Assigned to You</h1>
        </div>

        <!-- Content -->
        <div style="background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 4px 4px;">
          <p style="margin-top: 0; font-size: 16px;">Hello ${agentName},</p>
          
          <p style="margin: 15px 0;">You have been assigned a new lead. Please follow up as soon as possible.</p>

          <!-- Details Table -->
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 12px; background-color: #f0f0f0; font-weight: bold; width: 40%; border: 1px solid #ddd;">Lead Name</td>
              <td style="padding: 12px; background-color: #ffffff; border: 1px solid #ddd;">${lead.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f0f0f0; font-weight: bold; width: 40%; border: 1px solid #ddd;">Email</td>
              <td style="padding: 12px; background-color: #ffffff; border: 1px solid #ddd;"><a href="mailto:${lead.email}" style="color: #28a745; text-decoration: none;">${lead.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f0f0f0; font-weight: bold; width: 40%; border: 1px solid #ddd;">Phone</td>
              <td style="padding: 12px; background-color: #ffffff; border: 1px solid #ddd;"><a href="tel:${lead.phone}" style="color: #28a745; text-decoration: none;">${lead.phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f0f0f0; font-weight: bold; width: 40%; border: 1px solid #ddd;">Property Interest</td>
              <td style="padding: 12px; background-color: #ffffff; border: 1px solid #ddd;">${lead.propertyInterest}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f0f0f0; font-weight: bold; width: 40%; border: 1px solid #ddd;">Budget</td>
              <td style="padding: 12px; background-color: #ffffff; border: 1px solid #ddd;">${formatBudget(lead.budget)}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f0f0f0; font-weight: bold; width: 40%; border: 1px solid #ddd;">Priority Score</td>
              <td style="padding: 12px; background-color: #ffffff; border: 1px solid #ddd;">
                <span style="display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold;${
                  lead.score === 'High' ? ' background-color: #d4edda; color: #155724;' : lead.score === 'Medium' ? ' background-color: #fff3cd; color: #856404;' : ' background-color: #f8d7da; color: #721c24;'
                }">
                  ${lead.score}
                </span>
              </td>
            </tr>
          </table>

          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
            <p style="margin: 0;">This is an automated message from Property CRM</p>
          </div>
        </div>
      </body>
    </html>
  `

  return { subject, html }
}
