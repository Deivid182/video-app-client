import { Link, Outlet } from 'react-router-dom'
import Container from '../components/ui/container'
import { Video } from 'lucide-react'

const links = [
  {
    label: 'About',
    href: '/about'
  },
  {
    label: 'Testimonials',
    href: '/testimonials'
  },
  {
    label: 'Log in',
    href: '/'
  },
  {
    label: 'Sign up',
    href: '/register'
  },
]

const AuthLayout = () => {
  return (
    <>
      <div className='fixed w-full z-20 bg-white shadow-sm'>
        <div className='py-4 border-[1px] border-gray-200'>
          <Container>
            <nav className='flex justify-between items-center'>
              <div className='flex items-center gap-x-4'>
                <Video className='w-12 h-12 text-indigo-500'/>
                <span className='font-bold text-indigo-500 text-2xl'>WV</span>
              </div>
              <div className='max-lg:hidden flex items-center gap-x-4'>
                {links.map((link) => (
                  <Link
                    to={link.href}
                    key={link.href}
                    className='text-muted-foreground hover:text-indigo-500 font-light text-lg'
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </Container>
        </div>
      </div>
      <main className='pt-32'>
        <Outlet />
      </main>
    </>
  )
}

export default AuthLayout