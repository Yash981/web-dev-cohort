import CourseCard from "./course-card";
export interface CourseProps {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
}
type Props = {
    purchasesData: CourseProps[];
}
const PurchasedCourses = ({purchasesData}:Props) => {
    return ( 
        <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {purchasesData && 
            purchasesData.map((purchasedCourse: CourseProps) => {
                return (
                    <div key={purchasedCourse._id} >
                        <CourseCard title={purchasedCourse.title} courseId={purchasedCourse._id} description={purchasedCourse.description} imageUrl={purchasedCourse.imageUrl} price={purchasedCourse.price} purchases={true} />
                    </div>
                )
            })
        }
        
        </main>
     );
}
 
export default PurchasedCourses;