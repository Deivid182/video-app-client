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
}

type Actions = {
  setToken: (token: string) => void
  setProfile: (profile: Profile) => void
}

const useAuth = create(persist<AuthStore & Actions>(
  (set) => ({
    token: '',
    profile: {
      username: '',
      email: '',
      _id: ''
    },
    setToken: (token: string) => set({ token }),
    setProfile: (profile: Profile) => set({ profile })
  }),
  {
    name: 'auth'
  }
))

export default useAuth