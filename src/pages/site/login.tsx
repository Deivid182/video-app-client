import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '@/store/use-auth';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import Heading from '@/components/ui/heading';
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
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

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
  const { setToken, setProfile, isAuth } = useAuth();
  const navigate = useNavigate();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isAuth) navigate('/home');
  }, [isAuth, navigate]);

  const onSubmit = async (values: LoginFormData) => {
    console.log(values);
    try {
      const responseLogin = await axiosClient.post('/auth/login', values);
      console.log(responseLogin.data);
      setToken(responseLogin.data.token);

      const responseProfile = await axiosClient.get('/auth/profile');
      console.log(responseProfile);
      setProfile(responseProfile.data);
      toast.success('Success');

      setTimeout(() => {
        navigate('/home');
      }, 1000);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
        toast.error(error.response?.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-md mx-auto xl:px-20 md:px-10 sm:px-2 px-4'>
      <Card className='flex flex-col gap-y-6 p-4'>
        <CardHeader>
          <Heading
            title='Welcome back to WebVideos'
            description='Login to your account'
          />
        </CardHeader>
        <CardContent>
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
              <Button
                disabled={isLoading}
                type='submit'
                className='w-full justify-center'
              >
                Continue
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
