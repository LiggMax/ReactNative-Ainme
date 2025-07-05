/**
 * @Author Ligg
 * @Time 2025/7/5
 *
 * 播放器配置
 **/

// 视频播放器默认配置
export const DEFAULT_VIDEO_CONFIG = {
  // 控制条显示
  controls: false,
  // 自动播放（true为暂停，false为播放）
  paused: false,
  // 视频调整模式
  resizeMode: 'contain' as const,
  // 重复播放
  repeat: false,
  // 静音
  muted: false,
  // 音量（0-1）
  volume: 1.0,
  // 播放速率
  rate: 1.0,
  // 忽略静音开关
  ignoreSilentSwitch: 'ignore' as const,
  // 混音类别
  mixWithOthers: 'inherit' as const,
  // 进度更新间隔（毫秒）- 确保onProgress事件正常触发
  progressUpdateInterval: 250,
};


// 播放器事件配置
export const VIDEO_EVENTS_CONFIG = {
  // 缓冲超时时间（毫秒）
  bufferTimeout: 5000,
  // 错误重试次数
  maxRetryCount: 3,
  // 重试间隔（毫秒）
  retryInterval: 1000,
};
