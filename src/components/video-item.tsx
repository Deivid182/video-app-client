import { VideoWithId } from '@/store/use-videos';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { useMemo } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { getVideoId } from '@/lib/get-video-id';
import useAuth from '@/store/use-auth';
import { Pencil, ThumbsUp, UserPlus, UserMinus, Trash } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useEditModal from '@/hooks/use-edit-modal';

interface VideoItemProps {
  video: VideoWithId;
  onClick: () => void;
  setId: React.Dispatch<React.SetStateAction<string>>;
}

const VideoItem: React.FC<VideoItemProps> = ({ video, onClick, setId }) => {
  const user = useAuth((state) => state.profile);
  const editModal = useEditModal();

  const createdAt = useMemo(() => {
    if (!video?.createdAt) return;

    return formatDistanceToNowStrict(new Date(video.createdAt));
  }, [video.createdAt]);

  return (
    <Card key={video._id} className='rounded-lg'>
      <CardHeader>
        <iframe
          src={`https://www.youtube.com/embed/${getVideoId(video.url)}`}
          title='YouTube video player'
          allowFullScreen
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          className='rounded-t-lg object-cover w-full h-56'
        ></iframe>
      </CardHeader>
      <CardContent className='space-y-2'>
        <h3 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center'>
          {video.title}
          <span className='ml-auto text-sm text-muted-foreground'>
            {createdAt}
          </span>
        </h3>
      </CardContent>
      <CardFooter className='w-full justify-end'>
        {
          user?._id === video.userId ? (
            <div className='flex items-center gap-x-2'>
              <Button
                variant={'ghost'}
                className='flex items-center justify-center'
                size={'icon'}
                onClick={() => {
                  setId(video._id);
                  onClick();
                }}
              >
                <Trash />
              </Button>
              <Button
                variant={'ghost'}
                onClick={() => {
                  editModal.setData(video);
                  editModal.onOpen();
                }}
                className='flex items-center justify-center'
                size={'icon'}>
                <Pencil />
              </Button>
              <Button variant={'secondary'}>See details</Button>
            </div>
          ) : (
            <div className='flex items-center gap-x-2'>
              <Button variant={'secondary'}>See details</Button>
              <Button 
                variant={'ghost'}
                className='flex items-center justify-center'
                size={'icon'}>
                <UserPlus />
              </Button>
              <Button 
                variant={'ghost'}
                className='flex items-center justify-center'
                size={'icon'}>
                <ThumbsUp />
              </Button>
            </div>
          )
        }
      </CardFooter>
    </Card>
  );
};

export default VideoItem;
