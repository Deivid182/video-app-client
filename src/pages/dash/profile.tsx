import { Button } from '@/components/ui/button';
import useAuth from '@/store/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoItem from '@/components/video-item';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { getVideosByUserId } from '@/api/videos-client';
import { VideoWithId } from '@/store/use-videos';
import { LogOut } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import useFollow from '@/hooks/use-follow';
import { toast } from 'react-hot-toast';
import { getUserById } from '@/api/users-client';
import Loader from '@/components/ui/loader';

enum Tab {
  Published = 'published',
  All = 'all',
}

const Profile = () => {
  const { profile, logout } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [filterVideos, setFilterVideos] = useState(Tab.All);
  const { followMutation } = useFollow()

  const { data: videos, isLoading, error} = useQuery<VideoWithId[]>({
    queryKey: ['videos', params.userId],
    queryFn: () => getVideosByUserId(params.userId!),
  })

  const { data: user, isLoading: isLoadingUser, error: errorUser } = useQuery({
    queryKey: ['user', params.userId],
    queryFn: () => getUserById(params.userId!),
  }); 


  const isOwner = useMemo(() => {
    return profile._id === user?._id;
  }, [profile._id, user?._id]);

  const filteredVideos = useMemo(() => {
    if (filterVideos === Tab.All) {
      return videos;
    }
    if (videos?.length) {
      return videos.filter((video) => video.isPublished);
    }
  }, [filterVideos, videos]);

  const isFollowing = useMemo(() => {
    if(!user) return
    const list = user.followers
    return list?.includes(profile._id)
  }, [profile._id, user])

  const handleToggleFollow = () => {
    if(user?._id == undefined) return
    followMutation(user?._id)
    toast.success('Success')
  }
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if(isLoading || isLoadingUser) {
    return (
      <div className='flex items-center justify-center h-screen text-indigo-500'>
        <Loader />
      </div>
    );
  }

  if(error || errorUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-2xl font-bold text-center'>Something went wrong</p>
      </div>
    );
  }

  return (
    <>
      <div className='max-w-lg mx-auto'>
        <div className='flex flex-col space-y-4 items-center w-full'>
          <Avatar className='w-24 h-24'>
            <AvatarImage
              src='/placeholder.jpg'
              className='w-full h-full object-contain'
            />
          </Avatar>
          <h5 className='text-xl font-medium text-gray-900'>
            {user?.username}
          </h5>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            {user?.email}
          </span>
          <div className='flex justify-center items-center gap-x-2 '>
            {isOwner ? (
              <>
                <Button>Edit Profile</Button>
                <Button variant='outline' onClick={handleLogout}>
                  <LogOut />
                </Button>
              </>
            ) : (
              <Button
                onClick={handleToggleFollow}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className='py-12'>
        <div className='flex items-center justify-center'>
          {isOwner ? (
            <Tabs
              onValueChange={(value) => setFilterVideos(value as Tab)}
              defaultValue={Tab.All}
              className='w-full max-w-2xl flex flex-col gap-y-4 justify-center'
            >
              <TabsList className='max-w-lg mx-auto'>
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
          ) : (
            <div className='flex items-center flex-col gap-y-4'>
              <h3 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-x-2'>
                Videos
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {filteredVideos?.map((video) => (
                  <VideoItem key={video._id} video={video} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
