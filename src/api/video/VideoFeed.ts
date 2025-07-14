/**
 * @Author Ligg
 * @Time 2025/7/14
 *
 * 视频源
 */
import { Request } from '../../util/request.ts';

export const getVideoFeed = async (endpoint: string, customPrefix: string = '') => {
  try {
    // 使用自定义前缀创建请求实例
    const customRequest = Request.createWithBaseURL(customPrefix);
    
    // 发送 GET 请求
    const response = await customRequest.get(endpoint);
    
    return response;
  } catch (error) {
    console.error('获取视频源失败:', error);
    throw error;
  }
};

