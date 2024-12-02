"use server"
import { cookies } from 'next/headers';

export const getAllContents = async () => {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get('token')?.value;
        console.log((await cookieStore),'tokennnnn')
        const response = await fetch(`http://localhost:9000/api/v1/content`,
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