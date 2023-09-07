import { type ClassValue, clsx } from "clsx"
import axios from 'axios'
import { twMerge } from "tailwind-merge"
import useAuth from '@/store/use-auth'
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
})

axiosClient.interceptors.request.use((config) => {
  const token = useAuth.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export { axiosClient }