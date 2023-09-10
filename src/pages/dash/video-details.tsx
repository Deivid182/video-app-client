import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getVideo } from '@/api/videos-client';
import { VideoWithId } from '@/types';
import VideoItem from '@/components/video-item';

const VideoDetails = () => {
  const params = useParams();
  const { videoId } = params;
  const {
    data: video,
  } = useQuery<VideoWithId>({
    queryKey: ['videos', videoId],
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
