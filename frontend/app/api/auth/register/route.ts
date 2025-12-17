import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await axios.post(`${API_URL}/auth/register`, body);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json(
        error.response.data,
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}
