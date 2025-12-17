'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials.' };
        default:
          return { error: 'Something went wrong.' };
      }
    }
    throw error;
  }
}

export async function register(formData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'organizer';
}) {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, formData);

    if (response.data.success) {
      // Automatically sign in after registration
      await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      return { success: true, data: response.data };
    }

    return { success: false, error: 'Registration failed' };
  } catch (error: any) {
    if (error.response?.data?.error) {
      return { success: false, error: error.response.data.error };
    }
    return { success: false, error: 'Registration failed' };
  }
}

export async function logout() {
  await signOut({ redirect: true, redirectTo: '/' });
}
