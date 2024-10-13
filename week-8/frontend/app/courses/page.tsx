"use client"
import { GetCourseSellingToken } from "@/components/access-local-storage";
import CoursesList from "@/components/course-list";
import { useGlobalStateManagement } from "@/state-management/use-global-state";
import { FetchCoursessss } from "@/services/admin-course-service";
import { AllPreviewCourse } from "@/services/courses-service";
import Error from "next/error";
import { useEffect, useState } from "react";


const Courses = () => {
  const { setShouldRefetchCourses, shouldRefetchCourses, onAdminRole, isAdminRole } = useGlobalStateManagement();
  const token = GetCourseSellingToken();
  const [courses, setCourses] = useState([]);
  const [, setError] = useState<Error | null>(null);
  const [updatedCourses, setUpdatedCourses] = useState([]);
  useEffect(() => {
    if (isAdminRole) {
      const fetchCourses = async () => {
        try {
          const res = await FetchCoursessss();
          // console.log(res.courses, 'res');
          setCourses(res.courses);
          onAdminRole(res.isAdmin);
        } catch (error: unknown) {
          // console.log('error hello')
          //@ts-expect-error This is necessary because the FetchCoursessss function might not be properly typed or might have unexpected return types.
          setError(error instanceof Error ? error : new Error("An unexpected error occurred"));

        }
      };
      if (shouldRefetchCourses) {
        fetchCourses();
        setShouldRefetchCourses(false);
        return;
      }
      fetchCourses();
    } else {
      const PreviewAllCourses = async () => {
        try {
          const res = await AllPreviewCourse();
          // console.log(res, 'res');
          setCourses(res.allCourses);
        } catch (error: unknown) {
          //@ts-expect-error This is necessary because the FetchCoursessss function might not be properly typed or might have unexpected return types.
          setError(error instanceof Error ? error : new Error("An unexpected error occurred"));
        }
      }
      PreviewAllCourses()
    }

    // Fetch courses on component mount
  }, [shouldRefetchCourses, setShouldRefetchCourses, token, onAdminRole, isAdminRole]);
  // useEffect(()=>{
  //   if(courses.length > 0){
      
  //   }
  // },[courses])
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <CoursesList courses={courses} />
    </div>
  );
}

export default Courses