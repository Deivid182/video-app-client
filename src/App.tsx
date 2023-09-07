import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthLayout from './layout/auth-layout'
import Login from './pages/site/login'
import Register from './pages/site/register'
import ToasterProvider from './components/ui/toaster-provider'
import About from './pages/site/about'
import Testimonials from './pages/site/testimonials'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='about' element={<About />} />
          <Route path='testimonials' element={<Testimonials />} />
        </Route>
      </Routes>
      <ToasterProvider />
    </BrowserRouter>
  )
}

export default App