import { useQuery } from '@tanstack/react-query';
import { getVideos } from '@/api/videos-client';
import { VideoWithId } from '@/types';
import VideoItem from '@/components/video-item';
import Loader from '@/components/ui/loader';
import Heading from '@/components/ui/heading';
import DeleteModal from '@/components/delete-modal';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useDelete from '@/hooks/use-delete-video';

const Home = () => {
  const {
    data: videos,
    isLoading,
    error,
  } = useQuery<VideoWithId[]>(['videos'], getVideos);
  const [open, setOpen] = useState(false)
  const [id, setId] = useState('')

  const { isLoadingDelete, mutateDeleteVideo } = useDelete()

  const onOpen = () => setOpen(true)

  const onDelete = () => {
    if(isLoadingDelete) return
    mutateDeleteVideo(id)
    setOpen(false)
    toast.success('Video deleted')
  }

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
        title='Nothing to show'
        description='Try to share some videos with the community'
      />
    );
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
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {videos?.map((video) => (
          <VideoItem key={video._id} video={video} onClick={onOpen} setId={setId}/>
        ))}
      </div>
    </>
  );
};

export default Home;
