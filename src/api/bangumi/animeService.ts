/**
 * 动漫相关API服务
 */
import request from '../../util/request.ts';
import {ANIME_API} from '../../util/api.ts';

// 动漫数据类型定义 - 更新为BGM格式
export interface AnimeItem {
  id: number;
  url: string;
  type: number;
  name: string;
  name_cn: string;
  summary: string;
  air_date: string;
  air_weekday: number;
  rating?: {
    total: number;
    count: {
      [key: string]: number;
    };
    score: number;
  };
  rank?: number;
  images: {
    large: string;
    common: string;
    medium: string;
    small: string;
    grid: string;
  };
  collection?: {
    doing: number;
  };
}

// 星期信息类型
export interface WeekdayInfo {
  en: string;
  cn: string;
  ja: string;
  id: number;
}

// 新番时间表项目类型
export interface ScheduleItem {
  weekday: WeekdayInfo;
  items: AnimeItem[];
}

// 排行榜响应类型
export interface RankingResponse {
  results: number;
  list: AnimeItem[];
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
   * 获取动漫详情
   */
  async getAnimeDetailService(id: number): Promise<AnimeItem> {
    return request.get(ANIME_API.GET_DETAIL(id));
  }

  /**
   * 搜索动漫
   */
  async searchAnimeService(params: SearchParams): Promise<{
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
  async getRankingService(): Promise<RankingResponse> {
    return request.get(ANIME_API.GET_RANKING);
  }

  /**
   * 获取新番时间表 - 更新返回类型
   */
  async getSchedule(): Promise<ScheduleItem[]> {
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
