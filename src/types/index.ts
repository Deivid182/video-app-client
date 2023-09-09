import { Profile } from '@/store/use-auth';

export interface FullProfile extends Profile {
  followers: string[];
}