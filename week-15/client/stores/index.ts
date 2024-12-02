import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
type DialogState = {
  isOpen: boolean;
  isShareBrainModel: boolean | null;
  onOpen: (isShareBrainModel: boolean) => void;
  onClose: () => void;
};
export const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  isShareBrainModel: null,
  onOpen: (isShareBrainModel) => set({ isOpen: true, isShareBrainModel }),
  onClose: () => set({ isOpen: false }),
}));

interface UserState {
  username: string | null;
  setUsername: (username: string) => void;
  clearUserData: () => void; // New method to clear data
}
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      username: null,
      setUsername: (username) => set({ username }),
      clearUserData: () =>{
        set({ username: null});
        localStorage.removeItem('user-storage')

      }
    }),
    {
      name: "user-storage",
      storage:createJSONStorage(()=>localStorage)
    }
  )
);
