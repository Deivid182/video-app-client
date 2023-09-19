import { toggleLike } from '@/api/videos-client';
import useAuth from '@/store/use-auth';
import { VideoWithId } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useLike = () => {
  const queryClient = useQueryClient()
  const user = useAuth((state) => state.profile);
  const { mutate: likeMutation, isLoading: isLoadingLike, data: dataLike } = useMutation({
    mutationFn: (videoId: string) => toggleLike(videoId),
    onMutate: async (videoId) => {
      await queryClient.cancelQueries(['videos'])
      const previousVideos = queryClient.getQueryData(['videos'])

      queryClient.setQueryData(['videos'], (old?: VideoWithId[]): VideoWithId[] => {
        if(old == null) return []
        return old.map((video: VideoWithId) => {
          if(video._id === videoId) {
            if(video.likes.includes(user._id)) {
              return { ...video, likes: video.likes.filter((id: string) => id !== user._id) }
            } else {
              return { ...video, likes: [...video.likes, user._id] }
            }
          }
          return video
        })
      })

      return { previousVideos }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['videos'])
    }
  })

  return {
    likeMutation,
    isLoadingLike,
    dataLike
  }
}