import { AddAndEditCourseForm } from "./add-edit-course-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useGlobalStateManagement } from "../state-management/use-global-state";

const AddCourseDialog = () => {
    const { isAddCourseOpen, onAddCourseClose,currentCourse } = useGlobalStateManagement();
    return (
        <Dialog open={isAddCourseOpen} onOpenChange={onAddCourseClose}>
            <DialogContent className="bg-black" >
                <DialogHeader>
                    <DialogTitle className="text-white text-center">
                    {currentCourse ? "Edit Course" : "Add Course"}
                    </DialogTitle>
                </DialogHeader>
                <AddAndEditCourseForm currentCourse={currentCourse}/>
            </DialogContent>
        </Dialog>
    );
}

export default AddCourseDialog;