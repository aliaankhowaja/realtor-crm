/**
 * Rate Limiting Pattern for API Routes
 * 
 * This file demonstrates the pattern for integrating rate limiting into API routes.
 * Copy this pattern to the top of your API route handlers.
 * 
 * Example usage in an API route:
 * 
 * ```typescript
 * import { getSessionUser } from '@/lib/getSessionUser'
 * import { agentRateLimit, adminRateLimit } from '@/middleware/rateLimit'
 * 
 * export async function POST(request: Request) {
 *   // Rate limiting
 *   const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
 *   const user = await getSessionUser(request)
 *   const allowed = user?.role === 'admin' ? adminRateLimit(ip) : agentRateLimit(ip)
 *   
 *   if (!allowed) {
 *     return Response.json(
 *       { error: 'Too many requests' },
 *       { status: 429 }
 *     )
 *   }
 *   
 *   // Session check (optional - middleware will redirect, but you can add here too)
 *   if (!user) {
 *     return Response.json(
 *       { error: 'Unauthorized' },
 *       { status: 401 }
 *     )
 *   }
 *   
 *   // Your API logic here
 * }
 * ```
 * 
 * Rate Limits:
 * - Agents: 50 requests per minute
 * - Admins: 500 requests per minute
 * - Unauthenticated users: Apply agent limit (50/min)
 * 
 * Note: Rate limiting is stored in-memory and resets when the server restarts.
 */
