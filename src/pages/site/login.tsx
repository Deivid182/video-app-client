import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '@/store/use-auth';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { axiosClient } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const loginSchema = z.object({
  email: z.string().email({ message: 'Email is invalid' }),
  password: z
    .string({
      invalid_type_error: 'Password must be a string',
      required_error: 'Password is required',
    })
    .min(6, 'Password is required'),
});
type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setToken, setProfile } = useAuth();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    console.log(values);
    try {
      const { data } = await axiosClient.post('/auth/login', values);
      console.log(data)
      setToken(data.token);
      setProfile(data.profile);
    } catch (error) {
      if(error instanceof AxiosError) {
        console.log(error)
        toast.error(error.response?.data.message)
      }
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className='max-w-md mx-auto xl:px-20 md:px-10 sm:px-2 px-4'>
      <div className='flex flex-col gap-y-6'>
      <Heading
          title='Welcome back to WebVideos'
          description='Login to your account'
        />
        <Separator className='text-muted-foreground' />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full space-y-4'
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      {...field}
                      placeholder='johndoe@example.com'
                      type='email'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      {...field}
                      placeholder='johndoe@example.com'
                      type='password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type='submit' className='w-full'>
              Continue
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
