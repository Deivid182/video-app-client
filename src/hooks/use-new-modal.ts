import { create } from "zustand"

interface NewModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const useNewModal = create<NewModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export default useNewModal