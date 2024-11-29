"use server"
import { cookies } from 'next/headers';

export const AddContents = async (contentData: any) =>{
    console.log(contentData,JSON.stringify(contentData),'adatat')
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get('token')?.value;
        const response = await fetch(`http://localhost:9000/api/v1/content`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Cookie": token ? `token=${token}` : ''
                },
                credentials:"include",
                body: JSON.stringify(contentData)
            }
        )
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to Add Content')
        }
        return await response.json()
        
    } catch (error:any) {
        console.log("Error in AddContents:",error);
        throw new Error(error.message)
    }
}