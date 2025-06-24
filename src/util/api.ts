/**
 * API路径定义
 */
import { API_PREFIX } from './config';


// 动漫相关API
export const ANIME_API = {
  // 获取动漫列表
  GET_LIST: `${API_PREFIX.ANIME}/list`,
  // 获取动漫详情
  GET_DETAIL: (id: number) => `${API_PREFIX.ANIME}/subjects/${id}`,
  // 搜索动漫
  SEARCH: `${API_PREFIX.ANIME}/search`,
  // 获取推荐动漫
  GET_RECOMMEND: `${API_PREFIX.ANIME}/recommend`,
  // 获取排行榜
  GET_RANKING: `${API_PREFIX.ANIME}/ranking`,
  // 获取新番时间表
  GET_SCHEDULE: `${API_PREFIX.COMMON}/calendar`,
  // 获取分类
  GET_CATEGORIES: `${API_PREFIX.ANIME}/categories`,
} as const;
