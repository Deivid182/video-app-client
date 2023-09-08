import { Link, Navigate, Outlet } from 'react-router-dom';
import Container from './ui/container';
import { Heart, Menu, Plus, User, Video } from 'lucide-react';
import { Button, buttonVariants } from './ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import useNewModal from '@/hooks/use-new-modal';
import useEditModal from '@/hooks/use-edit-modal';

interface PrivateRouteProps {
  isAllowed: boolean;
}

const items = [
  {
    label: 'Profile',
    href: '/home/profile',
  },
  {
    label: 'Favorites',
    href: '/home/favorites',
  },
];
// https://www.youtube.com/embed/HOlvoOdIm-k
const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAllowed }) => {
  const newModal = useNewModal()
  const editModal = useEditModal()

  if (!isAllowed) return <Navigate to='/' />;

  return (
    <>
      <div className='fixed w-full z-20 bg-white shadow-sm'>
        <div className='py-4 border-[1px] border-gray-200'>
          <Container>
            <nav className='flex justify-between items-center'>
              <Link 
                to={'/home'}
                className='flex items-center gap-x-4 cursor-pointer'>
                <Video className='w-12 h-12 text-indigo-500' />
                <span className='font-bold text-indigo-500 text-2xl'>WV</span>
              </Link>
              <div className='flex gap-x-4 items-center max-lg:hidden'>
                <Button 
                  onClick={() => newModal.onOpen()}
                  variant='ghost'>
                  <Plus className='w-6 h-6 mr-2' />
                  New
                </Button>
                <Link
                  to={'/home/favorites'}
                  className={buttonVariants({ variant: 'ghost' })}
                >
                  <Heart className='w-6 h-6' />
                </Link>
                <Link
                  to={'/home/profile'}
                  className={buttonVariants({ variant: 'ghost' })}
                >
                  <User />
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
                            className={buttonVariants({ variant: 'ghost', className: 'text-start' })}
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      ))}
                      <Button 
                        onClick={() => newModal.onOpen()}
                        className='w-full' variant={'ghost'}>
                        New
                        <Plus className='w-6 h-6 ml-auto' />
                      </Button>
                    </div>
                    <SheetFooter>
                      <p className='text-slate-700 font-medium pt-8 mr-auto'>
                        WV, All rights reserved, 2023
                      </p>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </nav>
          </Container>
        </div>
      </div>
      <main className='pt-32'>
        <Container>
          <div className='px-4 sm:px-6 lg:px-8'>
            <Outlet />
          </div>
        </Container>
      </main>
    </>
  );
};

export default PrivateRoute;
