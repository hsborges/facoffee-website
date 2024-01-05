import axios from 'axios';
import { getAccessToken } from 'supertokens-auth-react/recipe/session';

export const httpClient = axios.create({});

httpClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
