import { z } from 'zod';
import connectDB from '@/lib/db';
import { getSessionUser } from '@/lib/getSessionUser';
import User from '@/models/User';
import { adminRateLimit, agentRateLimit } from '@/middleware/rateLimit';
import { validateBody } from '@/middleware/validate';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

type SignupInput = z.infer<typeof signupSchema>;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const user = await getSessionUser(request);
    const allowed = user?.role === 'admin' ? adminRateLimit(ip) : agentRateLimit(ip);

    if (!allowed) {
      return Response.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    
    const validation = validateBody<SignupInput>(signupSchema, body);
    
    if (!validation.success) {
      return Response.json(
        { error: validation.errors.join('; ') },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return Response.json({ error: 'Email already registered' }, { status: 409 });
    }

    await User.create({
      name,
      email,
      password,
      role: 'agent',
    });

    return Response.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);

    return Response.json({ error: 'Unable to create account' }, { status: 500 });
  }
}