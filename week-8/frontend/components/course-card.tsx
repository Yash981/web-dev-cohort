"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"; // shadcn component
import Image from "next/image"; // for optimized image handling in Next.js
import { Button } from "@/components/ui/button"; // shadcn button component
import { Edit2Icon, InfoIcon } from "lucide-react";
import { useGlobalStateManagement } from "../state-management/use-global-state";
import { PurchasesCourse } from "@/services/courses-service";
import { toast } from "sonner";
type Props = {
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    courseId: string;
    purchases?: boolean;
}
const CourseCard = ({ title, description, imageUrl, price, courseId,purchases }: Props) => {  
    const { setCurrentCourse,onAddCourseOpen,isAdminRole } = useGlobalStateManagement()

    const handleEdit =  () => {
        setCurrentCourse({ courseId,title, description, price})
        onAddCourseOpen()
        return
    }
    const handlePurchase = async () => {
        if(purchases) return toast.info("Content Will be uploaded Soon", {
            cancel: {
              label: 'cancel',
              actionButtonStyle: {
                background: 'transparent',},
              onClick: () => console.log('Cancel!'),
            }
          });
        let toastId;
        toastId = toast.loading("Purchasing Course")
        try {
            const response = await PurchasesCourse({ courseId })
            if (response.message==='Unauthorized') {
                toast.dismiss(toastId)
                return toast.warning("You are not authorized to purchase this course please login to continue",{
                duration: 2000,
            })
        }
            if(response === "Course already purchased"){
                toast.dismiss(toastId)
                return toast.warning("Course already purchased",{ 
                    duration: 2000,
                });
            }
            toast.dismiss(toastId)
            toast.success("Course purchased successfully",{ 
                duration: 2000,
            })
            
        } catch (error:any) {
            console.log('si it')
            toast.dismiss(toastId)
            toast.error("Error purchasing course")
        } 
    }
    return (
        <>
            <Card className="max-w-sm shadow-lg rounded-lg  relative ">
                <div className="relative overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt="Course Image"
                        className="w-full h-48 object-cover"
                        width={200}
                        height={200}
                    />

                </div>
                    {isAdminRole && <div className="absolute -top-4 -right-2 z-50">
                        <Button className="bg-neutral-50 hover:bg-neutral-300 text-black font-bold py-2 px-2 rounded-full" onClick={handleEdit}>
                            <Edit2Icon className="w-6 h-6" />
                        </Button>
                    </div>}
                <CardHeader>
                    <CardTitle className="text-xl font-bold">{title}</CardTitle>
                    <CardDescription className="text-gray-500">
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!purchases && <p className="text-2xl font-semibold">₹{price}</p>}
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    {!isAdminRole && <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={handlePurchase}>
                       {purchases ? "View Content" : " Buy Now"}
                    </Button>}
                    <p className="text-gray-400 text-sm">Lifetime Access</p>
                </CardFooter>
            </Card>

        </>
    );
};

export default CourseCard;
