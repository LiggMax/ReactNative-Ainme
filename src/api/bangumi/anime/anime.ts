/**
 * 动漫相关API服务
 */
import request, {Request} from '../../../util/request.ts';

// 创建不同基础URL的请求实例
const apiRequest = request;

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

/**
 * 动漫服务类
 */
class Anime {
  /**
   * 获取动漫详情
   */
  async getAnimeDetailService(id: number): Promise<AnimeItem> {

    return apiRequest.get(`/v0/subjects/${id}`);
  }


  /**
   * 获取排行榜
   */
  async getRankingService(): Promise<RankingResponse> {
    return apiRequest.get('/search/subject/anime');
  }

  /**
   * 获取新番时间表
   */
  async getSchedule(): Promise<ScheduleItem[]> {
    return apiRequest.get('/calendar');
  }
}

// 导出服务实例
export default new Anime();
