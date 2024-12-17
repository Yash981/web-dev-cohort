"use server"

import { cookies } from "next/headers";


export const deleteContent = async (contentId:string) => {
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;
    try {
        const response = await fetch(`${process.env.NEXT_BACKEND_URL}/api/v1/content/${contentId}`,{
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    "Cookie": token ? `token=${token}` : ''

                },
                credentials:"include",

        })
        if(!response.ok){
            throw new Error(`${response.status} ${response.statusText}`)
        }
        const res = await response.json()
        return res
    } catch (error:any) {
        console.log(error,'Error Deleting the content')
    }
}
 