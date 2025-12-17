import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: 'user' | 'organizer' = 'user'
  ): Promise<{ user: any; token: string }> {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new AppError('User with this email already exists', 400);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    };

    const [createdUser] = await db.insert(users).values(newUser).returning();

    const token = generateToken({
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
    });

    const { password: _, ...userWithoutPassword } = createdUser;

    return { user: userWithoutPassword, token };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: any; token: string }> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getUserById(userId: string): Promise<any | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async oauthLogin(
    email: string,
    firstName: string,
    lastName: string
  ): Promise<{ user: any; token: string }> {
    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existing) {
      const token = generateToken({
        id: existing.id,
        email: existing.email,
        role: existing.role,
      });
      const { password: _, ...userWithoutPassword } = existing;
      return { user: userWithoutPassword, token };
    }

    const hashedPassword = await hashPassword(uuidv4());

    const [createdUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user',
    }).returning();

    const token = generateToken({
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
    });

    const { password: _, ...userWithoutPassword } = createdUser;
    return { user: userWithoutPassword, token };
  }
}

export const authService = new AuthService();
