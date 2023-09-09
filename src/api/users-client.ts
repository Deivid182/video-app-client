import { axiosClient } from '@/lib/utils';

export const toggleFollow = async (userToFollowId: string) => {
  const res = await axiosClient.put(`/users/follow/${userToFollowId}`);
  return res.data
}

export const getUserById = async (userId: string) => {
  const res = await axiosClient.get(`/users/${userId}`);
  return res.data
}