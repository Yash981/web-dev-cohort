import { create } from "zustand";
interface Course {
    courseId: string;
    title: string;
    description: string;
    price: number;
  }
  
type GlobalStateManagement = {

    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;

    SignInDialogToshow: boolean;
    onSignInDialogToshow: (value: boolean) => void;

    userNickName: string;
    onUserNickName: (value: string) => void;

    isLoginOpen: boolean;
    onLoginOpen: () => void;
    onLoginClose: () => void;

    loginAsUser: boolean;
    onLoginAsUser: (value: boolean) => void;

    isAddCourseOpen: boolean;
    onAddCourseOpen: () => void;
    onAddCourseClose: () => void;

    shouldRefetchCourses: boolean, 
    setShouldRefetchCourses: (value: boolean) => void,

    isAdminRole:boolean,
    onAdminRole: (value: boolean) => void,

    currentCourse: Course | null;
    setCurrentCourse: (course: Course | null) => void;
};



const getUserNickNameFromStorage = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("userNickName") || "";
    }
    return "";
};



export const useGlobalStateManagement = create<GlobalStateManagement>((set) => ({
    currentCourse: null ,
    setCurrentCourse: (course: Course | null) => set({ currentCourse: course }),
    

    isAdminRole:false,
    onAdminRole: (value: boolean) => set({ isAdminRole: value }),
    shouldRefetchCourses: false, 
    setShouldRefetchCourses: (value: boolean) => set({ shouldRefetchCourses: value }),

    isAddCourseOpen: false,
    onAddCourseOpen: () => set({ isAddCourseOpen: true }),
    onAddCourseClose: () => set({ isAddCourseOpen: false }),

    loginAsUser: false,
    onLoginAsUser: (value: boolean) => set({ loginAsUser: value }),

    isLoginOpen: false,
    onLoginOpen: () => set({ isLoginOpen: true }),
    onLoginClose: () => set({ isLoginOpen: false }),

    userNickName: getUserNickNameFromStorage(),
    onUserNickName: (value: string) => {
        set({ userNickName: value })
        localStorage.setItem("userNickName", value);
    },

    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false, SignInDialogToshow: false }),
    
    SignInDialogToshow: false,
    onSignInDialogToshow: (value: boolean) => set({ SignInDialogToshow: value }),

}))