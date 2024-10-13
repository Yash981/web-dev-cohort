export const AllPreviewCourse = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/courses/preview`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    if(!response.ok) return "Error fetching Courses"
    const result = await response.json()
    return result
}

export const PurchasesCourse = async ({courseId}:{courseId:string}) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/courses/purchase`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({courseId})
    })
    if(response.status === 409) return "Course already purchased"
    if(!response.ok) return response.json()
    const result = await response.json()
    console.log(result,'okayyy')
    return result
}