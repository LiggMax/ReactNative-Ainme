/**
 * @Author Ligg
 * @Time 2025/7/14
 *
 * 视频源
 */
import request, {Request} from '../../../util/request.ts';
import axios from 'axios';
import {parse} from '../parse.ts';

/**
 * 搜索海贼王相关内容
 * @param keyword 搜索关键词
 * @returns Promise<any> 解析后的搜索结果列表
 */
export const searchOnePiece = async (keyword: string): Promise<any> => {
  try {
    // 发送HTTP请求获取HTML数据
    const response = await axios.get(
      `https://www.ciyuancheng.net/search.html?wd=${keyword}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
        },
      },
    );
    
    // 使用parse函数解析HTML数据
    const parsedData = await parse(response.data);
    return parsedData;
  } catch (error) {
    console.error('搜索失败:', error);
    throw error;
  }
};

// 导出默认请求实例
export default request;
