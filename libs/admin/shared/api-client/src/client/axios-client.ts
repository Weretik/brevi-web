import axios from 'axios';

import { installAxiosInterceptors } from '../interceptors/axios-interceptors';

export const axiosClient = axios.create({
  adapter: 'fetch',
  withCredentials: true,
});

installAxiosInterceptors(axiosClient);
