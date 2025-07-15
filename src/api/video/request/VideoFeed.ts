/**
 * @Author Ligg
 * @Time 2025/7/14
 *
 * 视频源
 */
import axios from 'axios';
import {parseEpisodes, parseSearch, parseVideoUrl} from '../parse/parse.ts';

/**
 * 获取搜索列表
 */
export const getSearchOnePieceService = async (keyword: string): Promise<any> => {
  try {
    // 请求url
    const url = `https://dm1.xfdm.pro/search.html?wd=${keyword}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
      },
    });
    // 使用parse函数解析HTML数据
    return parseSearch(response.data);
  } catch (error) {
    console.error('搜索失败:', error);
    throw error;
  }
};

/**
 * 获取条目资源列表
 */
export const getEpisodesService = async (url: string,ep:number): Promise<any> => {
  //网站url
  const baseURL = 'https://dm1.xfdm.pro';
  const response = await axios.get(baseURL+url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
    },
  });
  return parseEpisodes(response.data, ep);
}

/**
 * 获取视频播放链接
 */
export const getVideoUrlService = async (url: string): Promise<any> => {
  const baseURL = 'https://dm1.xfdm.pro';
  const response = await axios.get(baseURL+url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
    },
  });
  return parseVideoUrl(response.data);
}
