/**
 * 动漫相关API服务
 */
import request from '../../util/request.ts';
import {ANIME_API} from '../../util/api.ts';

// 动漫数据类型定义
export interface AnimeItem {
  id: string;
  title: string;
  cover: string;
  description: string;
  rating: number;
  year: number;
  status: string;
  genres: string[];
}

export interface AnimeListParams {
  page?: number;
  size?: number;
  category?: string;
  status?: string;
  year?: number;
}

export interface SearchParams {
  keyword: string;
  page?: number;
  size?: number;
}

/**
 * 动漫服务类
 */
class AnimeService {
  /**
   * 获取动漫列表
   */
  async getAnimeList(params: AnimeListParams = {}): Promise<{
    list: AnimeItem[];
    total: number;
    page: number;
  }> {
    return request.get(ANIME_API.GET_LIST, {params});
  }

  /**
   * 获取动漫详情
   */
  async getAnimeDetail(id: string): Promise<AnimeItem> {
    return request.get(ANIME_API.GET_DETAIL(id));
  }

  /**
   * 搜索动漫
   */
  async searchAnime(params: SearchParams): Promise<{
    list: AnimeItem[];
    total: number;
  }> {
    return request.get(ANIME_API.SEARCH, {params});
  }

  /**
   * 获取推荐动漫
   */
  async getRecommendAnime(limit: number = 10): Promise<AnimeItem[]> {
    return request.get(ANIME_API.GET_RECOMMEND, {
      params: {limit},
    });
  }

  /**
   * 获取排行榜
   */
  async getRanking(
    type: 'hot' | 'rating' | 'new' = 'hot',
  ): Promise<AnimeItem[]> {
    return request.get(ANIME_API.GET_RANKING, {
      params: {type},
    });
  }

  /**
   * 获取新番时间表
   */
  async getSchedule(): Promise<{
    [key: string]: AnimeItem[];
  }> {
    return request.get(ANIME_API.GET_SCHEDULE);
  }

  /**
   * 获取分类列表
   */
  async getCategories(): Promise<
    {
      id: string;
      name: string;
      count: number;
    }[]
  > {
    return request.get(ANIME_API.GET_CATEGORIES);
  }
}

// 导出服务实例
export default new AnimeService();
