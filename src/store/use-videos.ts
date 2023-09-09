import { create } from 'zustand';
import { axiosClient } from '@/lib/utils';

export interface Video {
  title: string
  description: string
  isPublished: boolean
  userId: string
  url: string
  likes?: string[]
}

export interface VideoWithId extends Video {
  _id: string
  createdAt: string
}

interface VideosStore {
  videos: VideoWithId[]
  getVideos: () => Promise<void>
}

const useVideos = create<VideosStore>((set) => ({
  videos: [],
  getVideos: async () => {
    const res = await axiosClient.get<VideoWithId[]>('/videos');
    set({ videos: res.data });
  }
}))

export default useVideos