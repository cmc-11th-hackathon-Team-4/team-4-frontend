import axios from 'axios';
import { getDeviceId } from './device';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 모든 요청에 기기 식별값을 붙인다 (서버 명세: X-Device-Id 헤더)
instance.interceptors.request.use((config) => {
  config.headers.set('X-Device-Id', getDeviceId());
  return config;
});
