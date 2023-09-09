import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getVideo } from '@/api/videos-client';
import { VideoWithId } from '@/store/use-videos';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getVideoId } from '@/lib/get-video-id';
import { Button } from '@/components/ui/button';
import VideoItem from '@/components/video-item';

const VideoDetails = () => {
  const params = useParams();
  const { videoId } = params;
  const queryClient = useQueryClient();
  const {
    data: video,
    isLoading,
    error,
  } = useQuery<VideoWithId>({
    queryKey: ['video', videoId],
    queryFn: () => getVideo(videoId!),
  });

  if(!video) return null

  return (
    <div className='max-w-2xl mx-auto'>
      <VideoItem
        video={video}
  
      />
    </div>
  )
};

export default VideoDetails;
