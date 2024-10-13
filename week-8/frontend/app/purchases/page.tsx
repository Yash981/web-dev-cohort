"use client"
import PurchasedCourses from "@/components/purchased-courses";
import { getUserPurchases } from "@/services/user-purchases-service";
import { useEffect, useState } from "react";

const Purchases =  () => {
    const [purchasesData, setPurchasesData] = useState([])
    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const purchases = await getUserPurchases()
                setPurchasesData(purchases.coursesData)
            } catch (error) {
                console.log(error)
            }
        }

        fetchPurchases()
    },[])
    console.log(purchasesData, 'purchases')
    return ( 
        <>
           <PurchasedCourses purchasesData={purchasesData}/>
        </>
    );
}
 
export default Purchases;