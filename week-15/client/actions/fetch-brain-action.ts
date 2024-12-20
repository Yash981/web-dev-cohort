"use server"

export const fetchShareBrainLink = async (sharelink:string) =>{
    try {
       
        const response = await fetch(`${process.env.NEXT_BACKEND_URL}/api/v1/brain/${sharelink}`,{
            method:"GET",
            headers:{
                'Content-Type': 'application/json',

            },
            credentials:"include",

        })
        if(!response.ok){
            throw new Error(`${response.status} ${response.statusText}`)
        }
        const allContents = await response.json()
        // console.log(allContents,'allContents')
        return allContents
    } catch (error) {
        console.log("Error Fetching content",error)
    }
}