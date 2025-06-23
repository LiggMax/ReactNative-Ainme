/**
 * API路径定义
 */
import { API_PREFIX } from './config';

// 用户相关API
export const USER_API = {
  // 获取用户信息
  GET_INFO: `${API_PREFIX.USER}/info`,
  // 更新用户信息
  UPDATE_INFO: `${API_PREFIX.USER}/update`,
  // 获取用户收藏
  GET_FAVORITES: `${API_PREFIX.USER}/favorites`,
  // 添加收藏
  ADD_FAVORITE: `${API_PREFIX.USER}/favorites`,
  // 删除收藏
  DELETE_FAVORITE: (id: string) => `${API_PREFIX.USER}/favorites/${id}`,
} as const;

// 认证相关API
export const AUTH_API = {
  // 登录
  LOGIN: `${API_PREFIX.AUTH}/login`,
  // 注册
  REGISTER: `${API_PREFIX.AUTH}/register`,
  // 刷新token
  REFRESH_TOKEN: `${API_PREFIX.AUTH}/refresh`,
  // 登出
  LOGOUT: `${API_PREFIX.AUTH}/logout`,
  // 重置密码
  RESET_PASSWORD: `${API_PREFIX.AUTH}/reset-password`,
} as const;

// 动漫相关API
export const ANIME_API = {
  // 获取动漫列表
  GET_LIST: `${API_PREFIX.ANIME}/list`,
  // 获取动漫详情
  GET_DETAIL: (id: string) => `${API_PREFIX.ANIME}/${id}`,
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

// 文件上传API
export const UPLOAD_API = {
  // 上传图片
  IMAGE: `${API_PREFIX.UPLOAD}/image`,
  // 上传视频
  VIDEO: `${API_PREFIX.UPLOAD}/video`,
  // 上传头像
  AVATAR: `${API_PREFIX.UPLOAD}/avatar`,
} as const;

// 评论相关API
export const COMMENT_API = {
  // 获取评论列表
  GET_LIST: `${API_PREFIX.COMMENT}/list`,
  // 添加评论
  ADD: `${API_PREFIX.COMMENT}/add`,
  // 删除评论
  DELETE: (id: string) => `${API_PREFIX.COMMENT}/${id}`,
  // 点赞评论
  LIKE: (id: string) => `${API_PREFIX.COMMENT}/${id}/like`,
} as const;
