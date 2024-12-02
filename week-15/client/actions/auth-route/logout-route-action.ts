"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  try {
    (await cookies()).delete('token');

    await fetch('http://localhost:9000/api/v1/logout', {
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