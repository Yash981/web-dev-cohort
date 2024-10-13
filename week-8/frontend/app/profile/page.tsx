"use client"
import { UserProfile } from "@/components/user-profile";
import { getUserProfile } from "@/services/user-profile-service";
import { useEffect, useState } from "react";
interface UserProfileProps {
    firstName: string
    lastName: string
    email: string
}
const Profile = () => {
    const [profileData, setProfileData] = useState<UserProfileProps>({
        firstName: '',
        lastName: '',
        email: ''
    })
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userProfile = await getUserProfile()
                // console.log(userProfile)
                setProfileData(userProfile.profile)
            } catch (error) {
                console.log(error)
            }
        }
        fetchUserProfile()
    },[])
    // console.log(profileData,'userrrrprofile')
    return ( 
        <>
           <UserProfile UserfirstName={profileData?.firstName || ''} UserlastName={profileData?.lastName || ''} Useremail={profileData?.email || ''}/>
        </>
     );
}
 
export default Profile;