import { toggleFollow } from '@/api/users-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import useAuth from '@/store/use-auth';

const useFollow = () => {
  const queryClient = useQueryClient()
  const user = useAuth(state => state.profile);
  const { mutate: followMutation, isLoading: isLoadingFollow, data: dataFollow } = useMutation({
    mutationFn: (userToFollowId: string) => toggleFollow(userToFollowId),
    onSuccess: async(newUser) => {
      queryClient.setQueryData(['user'], newUser)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['user'])
    }
  })

  const isFollowing = useMemo(() => {
    if(!dataFollow) return
    return dataFollow.userToFollowSaved?.followers?.includes(user._id)
  }, [user._id, dataFollow])

  return {
    followMutation,
    isLoadingFollow,
    isFollowing,
    dataFollow
  }
}

export default useFollow