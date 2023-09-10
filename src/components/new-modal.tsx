import { Input } from './ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createVideo } from '@/api/videos-client';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import useNewModal from '@/hooks/use-new-modal';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from './ui/separator';
import useAuth from '@/store/use-auth';
import { Checkbox } from './ui/checkbox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Video } from '@/types';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';

const videoSchema = z.object({
  title: z.string(),
  description: z
    .string({ required_error: 'Description is required' })
    .min(3, 'Description must be at least 3 characters'),
  isPublished: z.boolean().default(false),
  url: z
    .string({ required_error: 'Url is required' })
    .url('Url must be a valid url'),
  userId: z.string(),
});

type VideoFormData = z.infer<typeof videoSchema>;

const NewModal = () => {
  const newModal = useNewModal();
  const userId = useAuth((state) => state.profile._id);
  const queryClient = useQueryClient()
  const [submittedData, setSubmittedData] = useState(false)


  const form = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      isPublished: false,
      userId,
      url: '',
      title: '',
      description: '',
    },
  });

  const { mutate, isLoading: isLoadingMutate } = useMutation({

    mutationFn: createVideo,
    onMutate: async (data) => {
      await queryClient.cancelQueries(['videos'])

      const prevVideos = queryClient.getQueryData(['videos'])

      queryClient.setQueryData(['videos'], (oldVideos?: Video[]): Video[] => {
        const newVideoToAdd = structuredClone(data)

        if(oldVideos == null) return [newVideoToAdd]
        return [...oldVideos, newVideoToAdd]
      })
      return { prevVideos }
    },
    onError: (error, variables, context) => {
      console.log(error)
      if(context?.prevVideos != null) {
        queryClient.setQueryData(['videos'], context.prevVideos)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['videos'],
      })
    }
  })

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset()
    }
  }, [form])

  const onSubmit = (values: VideoFormData) => {
    if(isLoadingMutate) return 
    mutate({...values, likes: []})
    newModal.onClose()
    toast.success('Video created')
    form.reset()
  };

  return (
    <Dialog open={newModal.isOpen} onOpenChange={newModal.onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Share what you like to see</DialogTitle>
          <DialogDescription className='flex flex-col gap-y-2'>
            Share a new video with the community.
            <Separator />
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full space-y-4'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting || isLoadingMutate}
                      {...field}
                      placeholder='My video'
                      type='text'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting || isLoadingMutate}
                      {...field}
                      placeholder='My favorite video ever'
                      type='text'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='url'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting || isLoadingMutate}
                      {...field}
                      placeholder='https://www.youtube.com/watch?v=HOlvoOdIm-k&t=1883s'
                      type='url'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isPublished'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Published</FormLabel>
                    <FormDescription>
                      This video will appear on the main page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button 
              disabled={form.formState.isSubmitting || isLoadingMutate}
              className='w-full justify-center' type='submit'>Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewModal;
