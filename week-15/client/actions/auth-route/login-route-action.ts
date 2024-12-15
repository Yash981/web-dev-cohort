"use server";

import { cookies } from "next/headers";

export const LoginRouteAction = async (data: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_BACKEND_URL}/api/v1/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials:"include",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        errors: errorData,
      };
    }
    const res =  await response.json();
    const setCookieHeader = response.headers.get('set-cookie');
    
    if (setCookieHeader) {
      (await cookies()).set({
        name: 'token',
        value: setCookieHeader.split(';')[0].split('=')[1],
        httpOnly: true,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 
      });
    }
    console.log(res,'in login')
    return {
        success: true,
        data: res
    }
  } catch (error) {
    console.error("Error Signin", error);
    return {
      success: false,
      errors: {
        message: ["An unexpected error occurred"],
      },
    };
  }
};
