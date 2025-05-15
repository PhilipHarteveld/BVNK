import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://api.sandbox.bvnk.com/api/v1',
});