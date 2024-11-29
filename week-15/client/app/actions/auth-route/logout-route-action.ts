"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  try {
    // Clear the token cookie on the server-side
    (await cookies()).delete('token');

    // Optional: Call backend to invalidate the token
    await fetch('http://localhost:9000/api/v1/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    // Redirect to login page
    redirect('/signup');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}