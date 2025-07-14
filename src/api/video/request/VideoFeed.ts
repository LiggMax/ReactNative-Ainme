/**
 * @Author Ligg
 * @Time 2025/7/14
 *
 * 视频源
 */
import axios from 'axios';
import {parse} from '../parse.ts';

/**
 * 搜索海贼王相关内容
 * @param keyword 搜索关键词
 * @returns Promise<any> 解析后的搜索结果列表
 */
export const searchOnePiece = async (keyword: string): Promise<any> => {
  try {
    //网站url
    const baseURL = 'https://www.ciyuancheng.net';
    // 请求url
    const url = `https://www.ciyuancheng.net/search.html?wd=${keyword}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
      },
    });
    console.log('搜索地址',url);
    // 使用parse函数解析HTML数据
    const request = parse(response.data);
    console.log('搜索结果',request);
    return request;

  } catch (error) {
    console.error('搜索失败:', error);
    throw error;
  }
};

