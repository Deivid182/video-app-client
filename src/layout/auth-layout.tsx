import { Link, Outlet } from 'react-router-dom';
import Container from '../components/ui/container';
import { Video } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { buttonVariants } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const items = [
  {
    title: 'Login',
    href: '/',
  },
  {
    title: 'Sign up',
    href: '/register',
  },
];

const AuthLayout = () => {
  return (
    <>
      <div className='fixed w-full z-20 bg-white shadow-sm'>
        <div className='py-4 border-[1px] border-gray-200'>
          <Container>
            <nav className='flex justify-between items-center'>
              <div className='flex items-center gap-x-4'>
              <Link 
                to={'/'}
                className='flex items-center gap-x-4 cursor-pointer'>
                <Video className='w-12 h-12 text-indigo-500' />
                <span className='font-bold text-indigo-500 text-2xl'>WV</span>
              </Link>
              </div>
              <div className='flex gap-x-4 items-center max-lg:hidden'>
                <Link
                  to={'/'}
                  className={buttonVariants({ variant: 'ghost' })}
                >
                  Login
                </Link>
                <Link
                  to={'/register'}
                  className={buttonVariants({ variant: 'default' })}
                >
                  Sign up
                </Link>
              </div>
              <div className='max-lg:flex hidden'>
                <Sheet>
                  <SheetTrigger asChild>
                    <Menu className='w-8 h-8 hover:text-indigo-500 transition-colors cursor-pointer' />
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle className='flex items-center gap-x-4'>
                        <Video className='w-12 h-12 text-indigo-500' />
                        <span className='font-bold text-indigo-500 text-2xl'>
                          WV
                        </span>
                      </SheetTitle>
                    </SheetHeader>
                    <div className='flex flex-col gap-y-4 py-4'>
                      {items.map((item) => (
                        <SheetClose asChild key={item.href}>
                          <Link
                            to={item.href}
                            className='text-muted-foreground hover:text-indigo-500 font-light text-lg rounded-full hover:bg-neutral-100 p-2'
                          >
                            {item.title}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                    <SheetFooter>
                      <p className='text-slate-700 font-medium pt-8'>WV, All rights reserved, 2023</p>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </nav>
          </Container>
        </div>
      </div>
      <main className='pt-32'>
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;
