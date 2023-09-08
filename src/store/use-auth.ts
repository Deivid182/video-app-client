import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export interface Profile {
  username: string
  email: string
  _id: string
}

type AuthStore = {
  token: string
  profile: Profile
  isAuth: boolean
}

type Actions = {
  setToken: (token: string) => void
  setProfile: (profile: Profile) => void
  logout: () => void
}

const useAuth = create(persist<AuthStore & Actions>(
  (set) => ({
    token: '',
    profile: {
      username: '',
      email: '',
      _id: '',
    },
    isAuth: false,
    setToken: (token: string) => set({ token, isAuth: true }),
    setProfile: (profile: Profile) => set({ profile }),
    logout: () => set({ token: '', profile: { username: '', email: '', _id: '' }, isAuth: false }),
  }),
  {
    name: 'auth'
  }
))

export default useAuth