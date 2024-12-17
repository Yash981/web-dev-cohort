"use server"

import { cookies } from "next/headers";

export const ShareBrainLink = async (share: boolean) => {
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;
  try {
    const response = await fetch(`${process.env.NEXT_BACKEND_URL}/api/v1/brain/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": token ? `token=${token}` : ''
      },
      credentials:"include",
      body: JSON.stringify({ share: share }),
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const res = await response.json();
    return res;
  } catch (error) {
    console.log("Error Creating a link", error);
  }
};
