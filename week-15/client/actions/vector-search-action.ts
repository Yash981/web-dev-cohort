"use server"
import { cookies } from 'next/headers';

export const getVectorEmbedResults = async (query:string) => {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get('token')?.value;
        const response = await fetch(`${process.env.NEXT_BACKEND_URL}/api/v1/vectorSearch?query=${query}`,
            {
                method:"GET",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": token ? `token=${token}` : '',
                },
            }
        )
        if(!response.ok){
            console.log(response,'error')
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to generate Vector embed Results', error);
        throw new Error('Failed to generate Vector embed Results');
    }
}