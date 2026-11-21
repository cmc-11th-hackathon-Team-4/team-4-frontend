import axios from 'axios';
import { getDeviceId } from '@/utils/deviceId';
import { ApiError } from './error';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** 서버 공통 응답 { success, code, message, data } */
interface ApiEnvelope {
  success: boolean;
  code: string;
  message: string;
  data: unknown;
}

function isEnvelope(body: unknown): body is ApiEnvelope {
  return typeof body === 'object' && body !== null && 'success' in body && 'code' in body;
}

// 모든 요청에 기기 UUID (서버 사용자 구분)
instance.interceptors.request.use((config) => {
  config.headers.set('X-Device-Id', getDeviceId());
  return config;
});

// 응답에서 data만 꺼내 response.data에 넣음 → 기존처럼 const { data } = await instance.get(...)
// 실패 응답 · 네트워크 오류는 ApiError(code, message)로 바꿈
instance.interceptors.response.use(
  (response) => {
    const body: unknown = response.data;
    if (isEnvelope(body)) {
      if (!body.success) {
        return Promise.reject(new ApiError(body.code, body.message, response.status));
      }
      response.data = body.data;
    }
    return response;
  },
  (error) => {
    const body: unknown = error?.response?.data;
    if (isEnvelope(body)) {
      return Promise.reject(new ApiError(body.code, body.message, error.response.status));
    }
    return Promise.reject(
      new ApiError('NETWORK', '네트워크 연결을 확인해주세요', error?.response?.status),
    );
  },
);
