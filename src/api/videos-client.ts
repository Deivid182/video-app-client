import { axiosClient } from '@/lib/utils';
import { Video, VideoWithId } from '@/store/use-videos';

export const getVideos = async () => {
  const res = await axiosClient.get<VideoWithId[]>('/videos');
  return res.data;
}

export const getVideosByUserId = async (userId: string) => {
  const res = await axiosClient.get<VideoWithId[]>(`/videos/profile/${userId}`);
  return res.data
}

export const createVideo = async (video: Video) => {
  const res = await axiosClient.post('/videos', video);
  return res.data;
}

export const deleteVideo = async (id: string) => {
  const { data } = await axiosClient.delete(`/videos/${id}`);
  return data
}

export const getVideo = async (id: string) => {
  const { data } = await axiosClient.get(`/videos/${id}`);
  return data;
}

export const updateVideo = async (video: VideoWithId) => {
  const { data } = await axiosClient.put(`/videos/${video._id}`, video);
  return data;
}
