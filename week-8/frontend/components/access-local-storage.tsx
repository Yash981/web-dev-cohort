"use client"
export const  GetCourseSellingToken=()=>{
    return typeof window !== "undefined" ? localStorage.getItem('course_selling_token') : null;
};