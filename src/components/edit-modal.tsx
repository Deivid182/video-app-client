import { Input } from './ui/input';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateVideo } from '@/api/videos-client';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
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
import { toast } from 'react-hot-toast';
import useEditModal from '@/hooks/use-edit-modal';
import { useEffect } from 'react';

const videoSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters'),
  description: z.string().min(3),
  isPublished: z.boolean().default(false),
  url: z.string({ required_error: 'Url is required' })
  .url('Url must be a valid url'),
  userId: z.string(),
  _id: z.string(),
  createdAt: z.string(),
});

type VideoFormData = z.infer<typeof videoSchema>;

const EditModal = () => {
  const editModal = useEditModal()

  const userId = useAuth((state) => state.profile._id);
  const queryClient = useQueryClient()

  const form = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      isPublished: false,
      userId,
      url: '',
      title: '',
      description: '',
      _id: ''
    }
  })

  useEffect(() => {
    if(editModal.data) {
      form.setValue('title', editModal.data.title)
      form.setValue('description', editModal.data.description)
      form.setValue('isPublished', editModal.data.isPublished)
      form.setValue('url', editModal.data.url)
      form.setValue('_id', editModal.data._id)
      form.setValue('createdAt', editModal.data.createdAt)
    }
  }, [editModal.data, form])

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: updateVideo,
    // When mutate is called:
    onMutate: async (newVideo) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['videos', newVideo._id] })
  
      // Snapshot the previous value
      const previousVideos = queryClient.getQueryData(['videos', newVideo._id])
  
      // Optimistically update to the new value
      queryClient.setQueryData(['videos', newVideo._id], newVideo)
  
      // Return a context with the previous and new todo
      return { previousVideos, newVideo }
    },
    // If the mutation fails, use the context we returned above
    onError: (err, newVideo, context) => {
      if(context?.previousVideos != null) {
        queryClient.setQueryData(['videos'], context.previousVideos)
      }
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['videos'],
      })
    }
  })
  const onSubmit = (values: VideoFormData) => {
    mutate(values)
    editModal.onClose()
    toast.success('Video updated successfully')
  };

  return (
    <Dialog open={editModal.isOpen} onOpenChange={editModal.onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Update</DialogTitle>
          <DialogDescription className='flex flex-col gap-y-2'>
            Share the most recent video
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
                      disabled={form.formState.isSubmitting}
                      {...field}
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
                      disabled={form.formState.isSubmitting}
                      {...field}
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
                      disabled={form.formState.isSubmitting}
                      {...field}
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
              disabled={form.formState.isSubmitting}
              className='w-full justify-center' type='submit'>Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
