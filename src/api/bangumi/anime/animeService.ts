/**
 * 动漫相关API服务
 */
import request, {Request} from '../../../util/request.ts';
import {BASE_URLS} from '../../../util/config.ts';

// 创建不同基础URL的请求实例
const apiRequest = request; // 默认使用 API 基础URL
const bgmRequest = Request.createWithBaseURL(BASE_URLS.BGM);

// API路径常量
const API_PATHS = {
  GET_DETAIL: (id: number) => `/v0/subjects/${id}`,
  GET_RECOMMEND: '/v0/recommend',
  GET_CATEGORIES: '/v0/categories',
  SEARCH: '/search/subject/anime',
  GET_RANKING: '/search/subject/anime',
  GET_SCHEDULE: '/calendar',
} as const;

// 动漫数据类型定义 - BGM格式
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

// 搜索参数类型
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
   * 获取动漫详情 (使用 api.bgm.tv)
   */
  async getAnimeDetail(id: number): Promise<AnimeItem> {
    return apiRequest.get(API_PATHS.GET_DETAIL(id));
  }

  /**
   * 获取动漫详情 - 兼容旧方法名
   */
  async getAnimeDetailService(id: number): Promise<AnimeItem> {
    return this.getAnimeDetail(id);
  }

  /**
   * 搜索动漫 (使用 bgm.tv)
   */
  async searchAnime(params: SearchParams): Promise<{
    list: AnimeItem[];
    total: number;
  }> {
    return bgmRequest.get(API_PATHS.SEARCH, {params});
  }

  /**
   * 获取推荐动漫 (使用 api.bgm.tv)
   */
  async getRecommendAnime(limit: number = 10): Promise<AnimeItem[]> {
    return apiRequest.get(API_PATHS.GET_RECOMMEND, {
      params: {limit},
    });
  }

  /**
   * 获取排行榜 (使用 bgm.tv)
   */
  async getRanking(): Promise<RankingResponse> {
    return bgmRequest.get(API_PATHS.GET_RANKING);
  }

  /**
   * 获取排行榜 - 兼容旧方法名
   */
  async getRankingService(): Promise<RankingResponse> {
    return this.getRanking();
  }

  /**
   * 获取新番时间表 (使用 bgm.tv)
   */
  async getSchedule(): Promise<ScheduleItem[]> {
    return bgmRequest.get(API_PATHS.GET_SCHEDULE);
  }

  /**
   * 获取分类列表 (使用 api.bgm.tv)
   */
  async getCategories(): Promise<
    {
      id: string;
      name: string;
      count: number;
    }[]
  > {
    return apiRequest.get(API_PATHS.GET_CATEGORIES);
  }
}

// 导出服务实例
export default new AnimeService();
