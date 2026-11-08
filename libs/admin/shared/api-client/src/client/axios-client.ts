import axios from 'axios';

import { installAxiosInterceptors } from '../interceptors/axios-interceptors';

export const axiosClient = axios.create({
  adapter: 'fetch',
  withCredentials: true,
  // ASP.NET binds `ids=1&ids=2`; the axios default `ids[]=1` reaches the backend as an empty list (400).
  paramsSerializer: { indexes: null },
});

installAxiosInterceptors(axiosClient);
