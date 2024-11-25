"use server"

export const AddContents = async (contentData: any) =>{
    console.log(contentData,JSON.stringify(contentData),'adatat')
    try {
        const response = await fetch(`http://localhost:9000/api/v1/content`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':''
                },
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