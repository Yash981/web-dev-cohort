"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  try {
    (await cookies()).delete('token');

    await fetch(`${process.env.NEXT_BACKEND_URL}/api/v1/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
  redirect('/signup');
}