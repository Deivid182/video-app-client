import { VideoWithId } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { useMemo, useCallback } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { getVideoId } from '@/lib/get-video-id';
import useAuth from '@/store/use-auth';
import { Pencil, ThumbsUp, Trash } from 'lucide-react';
import useEditModal from '@/hooks/use-edit-modal';
import { useLike } from '@/hooks/use-like';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage } from './ui/avatar';
import { useLocation, useNavigate } from 'react-router-dom';

interface VideoItemProps {
  video: VideoWithId;
  onClick?: () => void;
  setId?: React.Dispatch<React.SetStateAction<string>>;
}

const VideoItem: React.FC<VideoItemProps> = ({ video, onClick, setId }) => {
  const user = useAuth((state) => state.profile);
  const editModal = useEditModal();
  const navigate = useNavigate();
  const location = useLocation()

  const { likeMutation } = useLike();

  const isLiked = useMemo(() => {
    const list = video.likes;
    return list?.includes(user._id);
  }, [user._id, video.likes]);

  const createdAt = useMemo(() => {
    if (!video?.createdAt) return;

    return formatDistanceToNowStrict(new Date(video.createdAt));
  }, [video.createdAt]);

  const handleToggleLike = (videoId: string) => {
    likeMutation(videoId);
  };

  const handleClick = useCallback(() => {
    if (!onClick || !setId) return;
    onClick();
    setId(video._id);
  }, [onClick, setId, video._id]);

  return (
    <Card key={video._id} className='rounded-lg'>
      <CardHeader>
        <CardTitle>
          <div className='flex gap-x-4'>
            <Avatar
              onClick={() => navigate(`/home/profile/${video.userId}`)}
              className='w-8 h-8 cursor-pointer'
            >
              <AvatarImage src='/placeholder.jpg' className='w-full h-full' />
            </Avatar>
            <h3 className='text-xl leading-none font-semibold text-neutral-800  flex flex-col gap-y-2'>
              {video.title}
              <span className='text-sm '>
                {createdAt}
              </span>
            </h3>
          </div>
        </CardTitle>
        <div className='p-2 rounded-lg'>
          <iframe
            src={`https://www.youtube.com/embed/${getVideoId(video.url)}`}
            title='YouTube video player'
            allowFullScreen
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            className='rounded-lg object-cover w-full h-56'
          ></iframe>
        </div>
      </CardHeader>
      <CardContent className='space-y-2'>
        <CardDescription className='text-lg text-neutral-600 '>
        {video.description}
        </CardDescription>
      </CardContent>
      <CardFooter className='w-full'>
        {user?._id === video.userId ? (
          <div className='flex items-center gap-x-2 border-t-2 border-b-2 w-full py-1'>
            <Button
              variant={'ghost'}
              className='flex items-center justify-center'
              size={'icon'}
              onClick={handleClick}
            >
              <Trash className='text-neutral-600'/>
            </Button>
            <Button
              variant={'ghost'}
              onClick={() => {
                editModal.setData(video);
                editModal.onOpen();
              }}
              className='flex items-center justify-center'
              size={'icon'}
            >
              <Pencil className='text-neutral-600'/>
            </Button>
            <Button
              variant={'ghost'}
              onClick={() => handleToggleLike(video._id)}
              className='flex items-center justify-center relative'
              size={'icon'}
            >
              <ThumbsUp className={cn(isLiked ? 'text-indigo-600' : 'text-neutral-600')} />
              <span
                className={cn(
                  isLiked ? 'text-indigo-600' : 'text-neutral-600',
                  'absolute top-0 right-0'
                )}
              >
                {video.likes?.length ?? 0}
              </span>
            </Button>
            {location.pathname !== `/home/video-details/${video._id}` && (
              <Button
                onClick={() => navigate(`/home/video-details/${video._id}`)}
                variant={'secondary'}
              >
                See details
              </Button>
            )}
          </div>
        ) : (
          <div className='flex items-center gap-x-2 border-t-2 border-b-2 w-full py-1'>
            {location.pathname !== `/home/video-details/${video._id}` && (
              <Button
                onClick={() => navigate(`/home/video-details/${video._id}`)}
                variant={'secondary'}
              >
                See details
              </Button>
            )}
            <Button
              variant={'ghost'}
              onClick={() => handleToggleLike(video._id)}
              className='flex items-center justify-center relative text-neutral-600'
              size={'icon'}
            >
              <ThumbsUp className={cn(isLiked ? 'text-sky-600' : '')} />
              <span
                className={cn(
                  isLiked ? 'text-sky-600' : '',
                  'absolute top-0 right-0'
                )}
              >
                {video.likes?.length ?? 0}
              </span>
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default VideoItem;
