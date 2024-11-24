import { create } from 'zustand';
type DialogState = {
    isOpen: boolean;
    isShareBrainModel: boolean | null;
    onOpen :(isShareBrainModel:boolean)=>void;
    onClose:()=>void;
}
export const useDialogStore = create<DialogState>((set)=>({
    isOpen: false,
    isShareBrainModel: null,
    onOpen:(isShareBrainModel) => set({ isOpen: true,isShareBrainModel }),
    onClose: () => set({ isOpen:false })
}))