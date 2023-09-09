import { toggleLike } from '@/api/videos-client';
import { VideoWithId } from '@/store/use-videos';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import useAuth from '@/store/use-auth';

export const useLike = () => {
  const queryClient = useQueryClient()
  const user = useAuth(state => state.profile);
  const { mutate: likeMutation, isLoading: isLoadingLike, data: dataLike } = useMutation({
    mutationFn: (videoId: string) => toggleLike(videoId),
    onMutate: async (videoId) => {
      await queryClient.cancelQueries(['videos'])
      const previousVideosData = queryClient.getQueryData<VideoWithId[]>(['videos']);
      queryClient.setQueryData(['videos'], (old?: VideoWithId[]): VideoWithId[] => {
        return old?.filter((video: VideoWithId) => video._id !== videoId) ?? []
      })

      return { previousVideosData }
    },
    onError: (error, variables, context) => {
      if(context?.previousVideosData != null) {
        queryClient.setQueryData(['videos'], context.previousVideosData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['videos'])
    }
  })
  /* const isLiked = useMemo(() => {
    const 
  }, []) */

  return {
    likeMutation,
    isLoadingLike,
    dataLike
  }
}