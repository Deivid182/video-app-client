import { deleteVideo } from '@/api/videos-client'
import { VideoWithId } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const useDelete = () => {
  const queryClient = useQueryClient()
  const { mutate: mutateDeleteVideo, isLoading: isLoadingDelete } = useMutation(deleteVideo, {
    onMutate: async (id) => {
      await queryClient.cancelQueries(['videos', id])

      const previousVideos = queryClient.getQueryData(['videos'])

      queryClient.setQueryData(['videos'], (old?: VideoWithId[]): VideoWithId[] => {
        if (old == null) return []
        return old.filter((video: VideoWithId) => video._id !== id)
      })

      return { previousVideos }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousVideos != null) {
        queryClient.setQueryData(['videos'], context.previousVideos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['videos'])
    }
  })

  return {
    mutateDeleteVideo,
    isLoadingDelete,
  }
}

export default useDelete