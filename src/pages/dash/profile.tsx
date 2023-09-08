import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import useAuth from '@/store/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoItem from '@/components/video-item';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { getVideosByUserId } from '@/api/videos-client';
import { VideoWithId } from '@/store/use-videos';

enum Tab {
  Published = 'published',
  All = 'all',
}

const Profile = () => {
  const user = useAuth((state) => state.profile);
  const [filterVideos, setFilterVideos] = useState(Tab.All)

  const {
    data: videos,
    isLoading,
    error,
  } = useQuery<VideoWithId[]>(['videos'], () => getVideosByUserId(user._id));

  console.log(filterVideos)

  const filteredVideos = useMemo(() => {
    if(filterVideos === Tab.All) {
      return videos
    } 
    if(videos?.length) {
      return videos.filter(video => video.isPublished)
    }
  }, [filterVideos, videos])

  console.log(filteredVideos)

  return (
    <>
      <div className='max-w-lg mx-auto'>
        <div className='flex flex-col space-y-4 items-center w-full'>
          <img
            src='https://i.pinimg.com/280x280_RS/20/70/cd/2070cd61e0ad03772fd883a939d4c62a.jpg'
            className='w-24 h-24 mb-3 rounded-full shadow-lg'
            alt='profile'
          />
          <h5 className='text-xl font-medium text-gray-900'>{user.username}</h5>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            {user.email}
          </span>
          <div className='flex justify-center items-center '>
            <Button>Edit Profile</Button>
          </div>
        </div>
      </div>
      <div className='py-12'>
        <div className='flex items-center justify-center'>
          <Tabs 
            onValueChange={(value) => setFilterVideos(value as Tab)}
            defaultValue={Tab.All}
            className='w-full max-w-2xl flex flex-col gap-y-4 justify-center'
          >
            <TabsList
              className='max-w-lg mx-auto'
              >
              <TabsTrigger value={Tab.Published}>Published</TabsTrigger>
              <TabsTrigger value={Tab.All}>All</TabsTrigger>
            </TabsList>
            <TabsContent value={filterVideos}>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {filteredVideos?.map((video) => (
                  <VideoItem key={video._id} video={video} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Profile;
