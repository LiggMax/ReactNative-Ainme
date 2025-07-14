/**
 * API配置文件
 */

// 基础URL配置
export const BASE_URLS = {
  // BGM API v0 接口
  API: 'https://api.bgm.tv',
  // BGM 主站接口
  BGM: 'https://bgm.tv',
} as const;

// 请求超时配置
export const TIMEOUT = {
  DEFAULT: 10000,      // 默认10秒
  UPLOAD: 30000,       // 上传30秒
  DOWNLOAD: 60000,     // 下载60秒
} as const;

