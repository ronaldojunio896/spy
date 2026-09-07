import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { investigators } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const [user] = await db.select().from(investigators).where(eq(investigators.email, email));

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ message: 'Senha incorreta' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set('session_token', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Erro no servidor' }, { status: 500 });
  }
}