"use server"
import { cookies } from 'next/headers';

export const AddContents = async (contentData: any) =>{
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get('token')?.value;
        const response = await fetch(`${process.env.NEXT_BACKEND_URL}/api/v1/content`,
            {
                method: "POST",
                headers: {
                    "Cookie": token ? `token=${token}` : ''
                },
                credentials:"include",
                body: contentData
            }
        )
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to Add Content')
        }
        const res = await response.json()
        return res
        
    } catch (error:any) {
        console.log("Error in AddContents:",error);
        throw new Error(error.message)
    }
}