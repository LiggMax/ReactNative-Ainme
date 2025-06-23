/**
 * API配置文件
 */

// 环境配置
export const ENV = {
  DEV: 'development',
  PROD: 'production',
  TEST: 'test',
} as const;

// 当前环境
export const CURRENT_ENV = __DEV__ ? ENV.DEV : ENV.PROD;

// 基础URL配置
export const BASE_URLS = {
  [ENV.DEV]: 'https://api.bgm.tv',
  [ENV.TEST]: 'https://test-api.example.com',
  [ENV.PROD]: 'https://api.example.com',
};

// 获取当前环境的基础URL
export const BASE_URL = BASE_URLS[CURRENT_ENV];

// API前缀配置
export const API_PREFIX = {
  // 通用API前缀
  COMMON: '',
  // 用户相关API
  USER: '/api/v1/user',
  // 认证相关API
  AUTH: '/api/v1/auth',
  // 动漫相关API
  ANIME: '/v1/anime',
  // 文件上传API
  UPLOAD: '/api/v1/upload',
  // 评论相关API
  COMMENT: '/api/v1/comment',
} as const;

// 请求超时配置
export const TIMEOUT = {
  DEFAULT: 10000,      // 默认10秒
  UPLOAD: 30000,       // 上传30秒
  DOWNLOAD: 60000,     // 下载60秒
} as const;

// 请求头配置
export const HEADERS = {
  JSON: {
    'Content-Type': 'application/json',
  },
  FORM: {
    'Content-Type': 'multipart/form-data',
  },
  FORM_URLENCODED: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
} as const;
