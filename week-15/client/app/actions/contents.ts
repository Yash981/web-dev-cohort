"use server"

export const getAllContents = async () => {
    try {
        const response = await fetch(`http://localhost:9000/api/v1/content`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':''
                }
            }
        )
        // 
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