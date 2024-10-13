export const getUserPurchases = async () =>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/purchases`,{
        method: 'GET',
        credentials: 'include',
    })
    if(!response.ok) return "User not found"
    const result = await response.json()
    return result
}