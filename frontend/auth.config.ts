import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const authConfig = {
  pages: {
    signIn: '/login',
    signOut: '/',
  },
  providers: [],
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
