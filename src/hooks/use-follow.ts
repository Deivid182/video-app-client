import { toggleFollow } from '@/api/users-client';
import { VideoWithId } from '@/store/use-videos';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import useAuth from '@/store/use-auth';

const useFollow = () => {
  const queryClient = useQueryClient()
  const user = useAuth(state => state.profile);
  const { mutate: followMutation, data: dataFollow, isLoading: isLoadingFollow } = useMutation({
    mutationFn: (userId: string) => toggleFollow(userId),
    onMutate: async (userId) => {
      await queryClient.cancelQueries(['users'])
      const previousUsersData = queryClient.getQueryData(['users']);
      queryClient.setQueryData(['users'], (old?: VideoWithId[]): VideoWithId[] => {
        return old?.filter((user: VideoWithId) => user._id !== userId) ?? []
      })
  
      return { previousUsersData }
    },
    onError: (error, variables, context) => {
      if(context?.previousUsersData != null) {
        queryClient.setQueryData(['users'], context.previousUsersData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['videos'])
    }
  })

  const isFollowing = useMemo(() => {
    const list = dataFollow?.userToFollowSaved?.followers
    return list?.includes(user._id)
  }, [user._id, dataFollow])

  return {
    followMutation,
    isLoadingFollow,
    dataFollow,
    isFollowing
  }
}

export default useFollow