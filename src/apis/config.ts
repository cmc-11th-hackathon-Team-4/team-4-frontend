/** 서버 연동 전까지 목데이터 사용. .env에 VITE_USE_MOCK=false 넣으면 실서버 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
