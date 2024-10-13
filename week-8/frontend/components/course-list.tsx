'use client';

import React from 'react';
import CourseCard from "@/components/course-card";
import { Button } from "@/components/ui/button";
import { useGlobalStateManagement } from "@/state-management/use-global-state";
import { Plus } from "lucide-react";

interface Course {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  _id: string;
  // Add other course properties as needed
}

interface CoursesListProps {
  courses: Course[] | null;
}

const CoursesList: React.FC<CoursesListProps> = ({ courses }) => {
  const { onAddCourseOpen,isAdminRole } = useGlobalStateManagement();
  if (!courses) {
    return (
      <>
       {isAdminRole && <Button
          onClick={onAddCourseOpen}
          className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none h-16 w-16"
          aria-label="Add Course"
          variant="secondary"
        >
          <Plus className="w-6 h-6" />
        </Button>}
        <p>No courses found.</p>
      </>
    );
  }

  if (!Array.isArray(courses)) {
    console.error('Courses is not an array:', courses);
    return <div>Error: Unable to display courses</div>;
  }
  // console.log(isAdminRole,'isAdminRole')
  return (
    <section className="relative ">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {courses.map((course,index) => (
          <div key={index}>
            <CourseCard title={course.title} courseId={course._id} description={course.description} imageUrl={course.imageUrl} price={course.price} />
          </div>
        ))}
        {isAdminRole && <Button
          onClick={onAddCourseOpen}
          className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none h-16 w-16"
          aria-label="Add Course"
          variant="secondary"
        >
          <Plus className="w-6 h-6" />
        </Button>}
      </div>
    </section>
  );
}

export default CoursesList;