"use server"
import { cookies } from 'next/headers';

export const getAllContents = async () => {
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;
    try {
        const response = await fetch(`${process.env.NEXT_BACKEND_URL}/api/v1/content`,
            {
                method:"GET",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": token ? `token=${token}` : ''
                }
            }
        )
        if(!response.ok){
            console.log(response,'error')
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch contents:', error);
        throw new Error('Failed to fetch contents');
    }
}