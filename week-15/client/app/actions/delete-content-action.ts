"use server"

import { cookies } from "next/headers";


export const deleteContent = async (contentId:string) => {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get('token')?.value;
        const response = await fetch(`http://localhost:9000/api/v1/content/${contentId}`,{
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
 