import { create } from 'zustand';
type DialogState = {
    isOpen: boolean;
    onOpen :()=>void;
    onClose:()=>void;
}
export const useDialogStore = create<DialogState>((set)=>({
    isOpen: false,
    onOpen:() => set({ isOpen: true }),
    onClose: () => set({ isOpen:false })
}))