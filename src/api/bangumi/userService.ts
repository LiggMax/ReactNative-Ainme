/**
 * 用户相关API服务
 */
import request from '../../util/request.ts';
import { AUTH_API, USER_API } from '../../util/api.ts';

// 用户数据类型定义
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  avatar: string;
  nickname: string;
  createdAt: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * 用户服务类
 */
class UserService {
  /**
   * 用户登录
   */
  async login(params: LoginParams): Promise<{
    token: string;
    refreshToken: string;
    userInfo: UserInfo;
  }> {
    return request.post(AUTH_API.LOGIN, params);
  }

  /**
   * 用户注册
   */
  async register(params: RegisterParams): Promise<{
    message: string;
  }> {
    return request.post(AUTH_API.REGISTER, params);
  }

  /**
   * 刷新Token
   */
  async refreshToken(refreshToken: string): Promise<{
    token: string;
    refreshToken: string;
  }> {
    return request.post(AUTH_API.REFRESH_TOKEN, { refreshToken });
  }

  /**
   * 用户登出
   */
  async logout(): Promise<void> {
    return request.post(AUTH_API.LOGOUT);
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(): Promise<UserInfo> {
    return request.get(USER_API.GET_INFO);
  }

  /**
   * 更新用户信息
   */
  async updateUserInfo(userInfo: Partial<UserInfo>): Promise<UserInfo> {
    return request.put(USER_API.UPDATE_INFO, userInfo);
  }

  /**
   * 获取用户收藏列表
   */
  async getFavorites(page: number = 1, size: number = 20): Promise<{
    list: any[];
    total: number;
    page: number;
  }> {
    return request.get(USER_API.GET_FAVORITES, {
      params: { page, size }
    });
  }

  /**
   * 添加收藏
   */
  async addFavorite(animeId: string): Promise<void> {
    return request.post(USER_API.ADD_FAVORITE, { animeId });
  }

  /**
   * 删除收藏
   */
  async deleteFavorite(favoriteId: string): Promise<void> {
    return request.delete(USER_API.DELETE_FAVORITE(favoriteId));
  }

  /**
   * 重置密码
   */
  async resetPassword(email: string): Promise<{
    message: string;
  }> {
    return request.post(AUTH_API.RESET_PASSWORD, { email });
  }
}

// 导出服务实例
export default new UserService();
