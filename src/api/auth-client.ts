import axios from 'axios';

export const loginRequest = async (email: string, password: string) => {
  const { data } = await axios.post('http://localhost:3000/api/auth/login', { email, password });
  return data;
}

export const profileRequest = async () => {
  const { data } = await axios.get('http://localhost:3000/api/auth/profile');
  return data;
}