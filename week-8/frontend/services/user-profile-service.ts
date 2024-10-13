export const getUserProfile = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/profile`,{
            method: 'GET',
            credentials: 'include',
    
        })
        if(!response.ok) return "User not found"
        const result = await response.json()
        return result
    } catch (error) {
        console.log(error)
    }

}