// src/lib/axios.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://your-api-url.com',
});
