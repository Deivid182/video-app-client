import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getVideos } from '@/api/videos-client';
import { VideoWithId } from '@/store/use-videos';
import VideoItem from '@/components/video-item';
import Loader from '@/components/ui/loader';
import Heading from '@/components/ui/heading';
import DeleteModal from '@/components/delete-modal';
import { useState } from 'react';
import { deleteVideo } from '@/api/videos-client';
import { toast } from 'react-hot-toast';

const Home = () => {
  const {
    data: videos,
    isLoading,
    error,
  } = useQuery<VideoWithId[]>(['videos'], getVideos);
  const [open, setOpen] = useState(false)
  const [id, setId] = useState('')
  const queryClient = useQueryClient()

  const { mutate: mutateDeleteVideo, isLoading: isLoadingDelete } = useMutation(deleteVideo, {
    onMutate: async (id) => {
      await queryClient.cancelQueries(['videos', id])

      const previousVideos = queryClient.getQueryData(['videos'])

      queryClient.setQueryData(['videos'], (old?: VideoWithId[]): VideoWithId[] => {
        if(old == null) return []
        return old.filter((video: VideoWithId) => video._id !== id)
      })

      return { previousVideos }
    },
    onError: (error, variables, context) => {
      if(context?.previousVideos != null) {
        queryClient.setQueryData(['videos'], context.previousVideos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['videos'])
    }
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen text-indigo-500'>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-2xl font-bold text-center'>Something went wrong</p>
      </div>
    );
  }

  if (!videos?.length) {
    return (
      <Heading
        title='No videos'
        description='Try to add some with the community'
      />
    );
  }

  const onOpen = () => setOpen(true)

  const onDelete = () => {
    if(isLoadingDelete) return
    mutateDeleteVideo(id)
    setOpen(false)
    toast.success('Video deleted')
  }

  return (
    <>
      <DeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        isLoading={isLoading}
        idProp={id}
      />
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {videos?.map((video) => (
          <VideoItem key={video._id} video={video} onClick={onOpen} setId={setId}/>
        ))}
      </div>
    </>
  );
};

export default Home;
