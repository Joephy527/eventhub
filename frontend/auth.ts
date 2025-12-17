import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { authConfig } from './auth.config';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await axios.post(`${API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const { user, token } = response.data.data;

          if (user && token) {
            return {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              accessToken: token,
            };
          }

          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      async profile(profile) {
        // Map Google profile fields
        return {
          id: profile.sub,
          email: profile.email,
          firstName: profile.given_name || '',
          lastName: profile.family_name || '',
          role: 'user',
          accessToken: '',
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnCreateEvent = nextUrl.pathname.startsWith('/events/create');
      const isOnMyEvents = nextUrl.pathname.startsWith('/events/my-events');

      if (isOnDashboard || isOnCreateEvent || isOnMyEvents) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    async jwt({ token, user, trigger, session, account }) {
      if (user && account?.provider === 'credentials') {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }

      if (user && account?.provider === 'google') {
        try {
          const res = await axios.post(`${API_URL}/auth/oauth`, {
            idToken: account.id_token,
          });

          const { user: backendUser, token: backendToken } = res.data.data;

          token.id = backendUser.id;
          token.email = backendUser.email;
          token.firstName = backendUser.firstName;
          token.lastName = backendUser.lastName;
          token.role = backendUser.role;
          token.accessToken = backendToken;
        } catch (error) {
          console.error('OAuth sync failed:', error);
          return token;
        }
      }

      if (trigger === 'update' && session) {
        token = { ...token, ...session.user };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = (token.id as string) || '';
        session.user.email = (token.email as string) || '';
        session.user.firstName = (token.firstName as string) || '';
        session.user.lastName = (token.lastName as string) || '';
        session.user.role = (token.role as string) || 'user';
        session.user.accessToken = (token.accessToken as string) || '';
      }
      return session;
    },
  },
});
