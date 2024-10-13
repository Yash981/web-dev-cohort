export const FetchCoursessss = async ()=>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/course/bulk`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
    // console.log(response,'response')
    const result = await response.json()
    if(!response.ok) return result
    return result
}
