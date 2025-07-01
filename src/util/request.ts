/**
 * 请求工具类
 */
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
  InternalAxiosRequestConfig,
} from 'axios';
import {BASE_URLS, TIMEOUT} from './config';

// 扩展axios配置类型，添加metadata和requestId
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

// 接口响应数据类型
interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 请求配置类型
interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean;
  showError?: boolean;
  timeout?: number; // 自定义超时时间
  retry?: number; // 重试次数
  retryDelay?: number; // 重试延迟时间(ms)
  requestId?: string; // 请求ID，用于取消请求
}

// 请求类型枚举
enum RequestType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  UPLOAD = 'UPLOAD',
  DOWNLOAD = 'DOWNLOAD',
}

class Request {
  private instance: AxiosInstance;
  private cancelTokens: Map<string, CancelTokenSource> = new Map();

  constructor(baseURL?: string) {
    // 创建axios实例，可以指定基础URL
    this.instance = axios.create({
      baseURL: baseURL || BASE_URLS.API,
      timeout: TIMEOUT.DEFAULT,
    });

    // 设置拦截器
    this.setInterceptors();
  }

  /**
   * 创建使用指定基础URL的请求实例
   */
  static createWithBaseURL(baseURL: string): Request {
    return new Request(baseURL);
  }

  /**
   * 获取请求类型对应的超时时间
   */
  private getTimeoutByType(type: RequestType, customTimeout?: number): number {
    if (customTimeout && customTimeout > 0) {
      return customTimeout;
    }

    switch (type) {
      case RequestType.UPLOAD:
        return TIMEOUT.UPLOAD;
      case RequestType.DOWNLOAD:
        return TIMEOUT.DOWNLOAD;
      default:
        return TIMEOUT.DEFAULT;
    }
  }

  /**
   * 创建取消令牌
   */
  private createCancelToken(requestId?: string): CancelTokenSource {
    const source = axios.CancelToken.source();

    if (requestId) {
      // 如果存在相同的请求ID，先取消之前的请求
      if (this.cancelTokens.has(requestId)) {
        this.cancelTokens.get(requestId)?.cancel('请求被新请求取消');
      }
      this.cancelTokens.set(requestId, source);
    }

    return source;
  }

  /**
   * 清理取消令牌
   */
  private cleanupCancelToken(requestId?: string): void {
    if (requestId && this.cancelTokens.has(requestId)) {
      this.cancelTokens.delete(requestId);
    }
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 重试请求
   */
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retryCount: number = 0,
    maxRetries: number = 3,
    retryDelay: number = 1000,
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      // 如果是取消请求，不重试
      if (axios.isCancel(error)) {
        throw error;
      }

      // 如果重试次数用完，抛出错误
      if (retryCount >= maxRetries) {
        throw error;
      }

      console.log(
        `🔄 请求失败，${retryDelay}ms后进行第${retryCount + 1}次重试...`,
      );

      // 延迟后重试
      await this.delay(retryDelay);
      return this.retryRequest(
        requestFn,
        retryCount + 1,
        maxRetries,
        retryDelay,
      );
    }
  }

  /**
   * 设置请求和响应拦截器
   */
  private setInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const startTime = Date.now();
        config.metadata = {startTime};

        // 构建完整的请求路径
        const baseURL = config.baseURL || '';
        const fullUrl = config.url?.startsWith('http') ? config.url : `${baseURL}${config.url}`;
        console.log(
          `🚀 发送请求: ${config.method?.toUpperCase()} ${fullUrl}`,
        );

        // 设置User-Agent，避免Bangumi API的403错误
        if (config.headers) {
          config.headers['User-Agent'] = 'ReactNative-Anime/1.0.0 (https://github.com/LiggMax/ReactNative-Ainme)';
        }

        // 在这里可以添加token
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      error => {
        console.error('❌ 请求错误:', error);
        return Promise.reject(error);
      },
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      error => {
        const endTime = Date.now();
        const duration =
          endTime - (error.config?.metadata?.startTime || endTime);

        // 处理超时错误
        if (
          error.code === 'ECONNABORTED' &&
          error.message.includes('timeout')
        ) {
          console.error(
            `⏰ 请求超时: ${error.config?.method?.toUpperCase()} ${
              error.config?.url
            }`,
          );
          console.error(`⏱️  超时时间: ${error.config?.timeout}ms`);
          return Promise.reject(new Error(`请求超时，请检查网络连接`));
        }

        // 处理取消请求
        if (axios.isCancel(error)) {
          console.log('🚫 请求被取消:', error.message);
          return Promise.reject(error);
        }

        // 处理网络错误
        if (error.response) {
          // 服务器响应错误
          const status = error.response.status;
          const data = error.response.data;

          console.error(
            `❌ HTTP ${status}: ${error.config?.method?.toUpperCase()} ${
              error.config?.url
            }`,
          );
          console.error(`📊 响应数据:`, data);
          console.error(`⏱️  请求耗时: ${duration}ms`);

          // 根据状态码返回相应错误信息
          switch (status) {
            case 404:
              return Promise.reject(new Error('请求的资源不存在'));
            default:
              return Promise.reject(new Error(`请求失败: HTTP ${status}`));
          }
        } else if (error.request) {
          // 网络连接错误
          console.error(
            `🌐 网络连接错误: ${error.config?.method?.toUpperCase()} ${
              error.config?.url
            }`,
          );
          console.error(`📱 请求详情:`, {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL,
            timeout: error.config?.timeout,
            headers: error.config?.headers,
          });
          console.error(`⏱️  请求耗时: ${duration}ms`);
          console.error(`🔍 错误详情:`, error.message);

          return Promise.reject(
            new Error('网络连接失败，请检查网络设置或稍后重试'),
          );
        } else {
          // 其他错误
          console.error(`💥 请求配置错误:`, error.message);
          return Promise.reject(new Error(`请求配置错误: ${error.message}`));
        }
      },
    );
  }

  /**
   * 获取token
   */
  private getToken(): string | null {
    // 这里可以从AsyncStorage或其他存储中获取token
    // return await AsyncStorage.getItem('token');
    return null;
  }
  /**
   * 通用请求方法
   */
  private async request<T = any>(
    method: RequestType,
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    const {
      timeout,
      retry = 0,
      retryDelay = 1000,
      requestId,
      ...restConfig
    } = config || {};

    // 设置超时时间
    const requestTimeout = this.getTimeoutByType(method, timeout);

    // 创建取消令牌
    const cancelSource = this.createCancelToken(requestId);

    const requestConfig: AxiosRequestConfig = {
      ...restConfig,
      timeout: requestTimeout,
      cancelToken: cancelSource.token,
    };

    const requestFn = async (): Promise<T> => {
      try {
        let response: any;

        switch (method) {
          case RequestType.GET:
            response = await this.instance.get(url, requestConfig);
            break;
          case RequestType.POST:
            response = await this.instance.post(url, data, requestConfig);
            break;
          case RequestType.PUT:
            response = await this.instance.put(url, data, requestConfig);
            break;
          case RequestType.DELETE:
            response = await this.instance.delete(url, requestConfig);
            break;
          case RequestType.PATCH:
            response = await this.instance.patch(url, data, requestConfig);
            break;
          default:
            throw new Error(`不支持的请求方法: ${method}`);
        }
        return response as T;
      } finally {
        // 清理取消令牌
        this.cleanupCancelToken(requestId);
      }
    };

    // 如果设置了重试，使用重试机制
    if (retry > 0) {
      return this.retryRequest(requestFn, 0, retry, retryDelay);
    }

    return requestFn();
  }

  /**
   * GET请求
   */
  get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(RequestType.GET, url, undefined, config);
  }

  /**
   * POST请求
   */
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(RequestType.POST, url, data, config);
  }

  /**
   * PUT请求
   */
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(RequestType.PUT, url, data, config);
  }

  /**
   * DELETE请求
   */
  delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(RequestType.DELETE, url, undefined, config);
  }

  /**
   * PATCH请求
   */
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(RequestType.PATCH, url, data, config);
  }
  /**
   * 取消请求
   */
  cancelRequest(requestId: string): void {
    if (this.cancelTokens.has(requestId)) {
      const cancelSource = this.cancelTokens.get(requestId);
      cancelSource?.cancel(`用户取消请求: ${requestId}`);
      this.cancelTokens.delete(requestId);
      console.log(`🚫 已取消请求: ${requestId}`);
    } else {
      console.warn(`⚠️  未找到请求ID: ${requestId}`);
    }
  }
}

// 创建请求实例
const request = new Request();

// 导出请求实例、类和类型
export default request;
export {Request};
export type {ApiResponse, RequestConfig};
