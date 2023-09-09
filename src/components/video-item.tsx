import { VideoWithId } from '@/store/use-videos';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { useMemo, useCallback } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { getVideoId } from '@/lib/get-video-id';
import useAuth from '@/store/use-auth';
import { Pencil, ThumbsUp, UserPlus, UserMinus, Trash } from 'lucide-react';
import useEditModal from '@/hooks/use-edit-modal';
import { toast } from 'react-hot-toast';
import useFollow from '@/hooks/use-follow';
import { useLike } from '@/hooks/use-like';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage } from './ui/avatar';
import { useNavigate, useLocation } from 'react-router-dom';

interface VideoItemProps {
  video: VideoWithId;
  onClick?: () => void;
  setId?: React.Dispatch<React.SetStateAction<string>>;
}

const VideoItem: React.FC<VideoItemProps> = ({ video, onClick, setId }) => {
  const user = useAuth((state) => state.profile);
  const editModal = useEditModal();
  const navigate = useNavigate()
  const location = useLocation()

  const { followMutation, dataFollow, isLoadingFollow, isFollowing  } = useFollow()
  const { likeMutation } = useLike()
  const isLiked = useMemo(() => {
    const list = video.likes
    return list?.includes(user._id)
  }, [user._id, video.likes])

  const createdAt = useMemo(() => {
    if (!video?.createdAt) return;

    return formatDistanceToNowStrict(new Date(video.createdAt));
  }, [video.createdAt]);

  
  const handleToggleLike = (videoId: string) => {
    likeMutation(videoId);
  };
  
  const handleToggleFollow = (userId: string) => {
    followMutation(userId)
    toast.success('Success')
  }

  const handleClick = useCallback(() => {
    if(!onClick || !setId) return
    onClick()
    setId(video._id)
    }, [onClick, setId, video._id])

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
        <h3 className='text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-x-2'>
          <Avatar 
            onClick={() => navigate(`/home/profile/${video.userId}`)}
            className='w-8 h-8 cursor-pointer'>
            <AvatarImage src='/placeholder.jpg' className='w-full h-full' />
          </Avatar>
          {video.title}
          <span className='ml-auto text-sm text-muted-foreground'>
            {createdAt}
          </span>
        </h3>
      </CardContent>
      <CardFooter className='w-full justify-end'>
        {user?._id === video.userId ? (
            <div className='flex items-center gap-x-2'>
              <Button
                variant={'ghost'}
                className='flex items-center justify-center'
                size={'icon'}
                onClick={handleClick}
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
              <Button 
                variant={'ghost'}
                className='flex items-center justify-center relative'
                size={'icon'}>
                <ThumbsUp />
                <span className='absolute top-0 right-0'>{video.likes?.length ?? 0}</span>
              </Button>
              <Button variant={'secondary'}>See details</Button>
            </div>
          ) : (
            <div className='flex items-center gap-x-2'>
              <Button variant={'secondary'}>See details</Button>
              {location.pathname === '/home' && (
                <Button
                  onClick={() => handleToggleFollow(video.userId)}
                  variant={'ghost'}
                  className='flex items-center justify-center'
                  size={'icon'}>
                  {isFollowing ? <UserMinus /> : <UserPlus />}
                </Button>
              )}
              <Button 
                variant={'ghost'}
                onClick={() => handleToggleLike(video._id)}
                className='flex items-center justify-center relative'
                size={'icon'}>
                  <ThumbsUp className={cn(isLiked ? 'text-sky-600' : '')}/>
                <span className={cn(isLiked ? 'text-sky-600' : '', 'absolute top-0 right-0')}>
                  {video.likes?.length ?? 0}
                </span>
              </Button>
            </div>
          )
        }
      </CardFooter>
    </Card>
  );
};

export default VideoItem;
