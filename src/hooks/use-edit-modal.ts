import { VideoWithId } from '@/store/use-videos'
import { create } from 'zustand'

interface EditModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  data: VideoWithId
  setData: (data: VideoWithId) => void
}

const useEditModal = create<EditModalStore>((set) => ({
  isOpen: false,
  data: {} as VideoWithId,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setData: (data: VideoWithId) => set({ data })
}))

export default useEditModal