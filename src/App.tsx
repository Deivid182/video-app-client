import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from './layout/auth-layout';
import Login from './pages/site/login';
import Register from './pages/site/register';
import ToasterProvider from './components/ui/toaster-provider';
import About from './pages/site/about';
import Testimonials from './pages/site/testimonials';
import PrivateRoute from './components/private-route';
import useAuth from './store/use-auth';
import Home from './pages/dash/home';
import Profile from './pages/dash/profile';
import VideoDetails from './pages/dash/video-details';
import NewModal from './components/new-modal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EditModal from './components/edit-modal';
const App = () => {
  const isAuth = useAuth((state) => state.isAuth);
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='about' element={<About />} />
            <Route path='testimonials' element={<Testimonials />} />
          </Route>
          <Route path='/home' element={<PrivateRoute isAllowed={isAuth} />}>
            <Route index element={<Home />} />
            <Route path='profile/:userId' element={<Profile />} />
            <Route path='video-details/:videoId' element={<VideoDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToasterProvider />
      <NewModal />
      <EditModal />
    </QueryClientProvider>
  );
};

export default App;
