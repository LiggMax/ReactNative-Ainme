/**
 * 动漫详情api
 */
import request, {Request} from '../../../util/request.ts';
import {AnimeItem} from './anime.ts';

// 创建不同基础URL的请求实例
const apiRequest = request; // 默认使用 API 基础URL

class AnimeDate{

  /**
   * 获取动漫详情
   */
  async getAnimeDetailService(id: number): Promise<AnimeItem> {
    return apiRequest.get(`/v0/subjects/${id}`);
  }

  /**
   * 获取番剧角色信息
   */
  async getCharactersService(id: number) {
    return apiRequest.get(`/v0/subjects/${id}/characters`);
  }

  /**
   * 番剧相关条目
   */
  async getRelatedService(id: number) {
    return apiRequest.get(`/v0/subjects/${id}/subjects`)
  }
}


export default new AnimeDate();
