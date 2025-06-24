/**
 * 请求工具类
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource, InternalAxiosRequestConfig } from 'axios';
import { BASE_URL, TIMEOUT, HEADERS } from './config';

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
  private baseURL: string;
  private cancelTokens: Map<string, CancelTokenSource> = new Map();

  constructor() {
    // 使用配置文件中的基础URL
    this.baseURL = BASE_URL;

    // 创建axios实例
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: TIMEOUT.DEFAULT,
      headers: HEADERS.JSON,
    });

    // 设置拦截器
    this.setInterceptors();
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
    retryDelay: number = 1000
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

      console.log(`🔄 请求失败，${retryDelay}ms后进行第${retryCount + 1}次重试...`);
      
      // 延迟后重试
      await this.delay(retryDelay);
      return this.retryRequest(requestFn, retryCount + 1, maxRetries, retryDelay);
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
        config.metadata = { startTime };

        console.log(`🚀 发送请求: ${config.method?.toUpperCase()} ${config.url}`);
        console.log(`⏰ 超时时间: ${config.timeout}ms`);

        // 在这里可以添加token
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        console.error('❌ 请求错误:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const endTime = Date.now();
        const duration = endTime - (response.config.metadata?.startTime || endTime);
        
        console.log(`✅ 响应成功: ${response.config.method?.toUpperCase()} ${response.config.url}`);
        console.log(`⏱️  请求耗时: ${duration}ms`);

        // 直接返回响应数据，不进行业务状态码判断
        return response.data;
      },
      (error) => {
        const endTime = Date.now();
        const duration = endTime - (error.config?.metadata?.startTime || endTime);

        // 处理超时错误
        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
          console.error(`⏰ 请求超时: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
          console.error(`⏱️  超时时间: ${error.config?.timeout}ms`);
          return Promise.reject(new Error(`请求超时，请检查网络连接`));
        }

        // 处理取消请求
        if (axios.isCancel(error)) {
          console.log('🚫 请求被取消:', error.message);
          return Promise.reject(error);
        }

        console.error(`❌ 响应错误: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
        console.error(`⏱️  请求耗时: ${duration}ms`);

        // 处理HTTP状态码错误
        const { response } = error;
        let errorMessage = '网络异常，请稍后重试';

        if (response) {
          switch (response.status) {
            case 401:
              errorMessage = '登录已过期，请重新登录';
              this.handleTokenExpired();
              break;
            case 403:
              errorMessage = '没有权限访问';
              break;
            case 404:
              errorMessage = '请求的资源不存在';
              break;
            case 408:
              errorMessage = '请求超时，请重试';
              break;
            case 500:
              errorMessage = '服务器内部错误';
              break;
            case 502:
              errorMessage = '网关错误';
              break;
            case 503:
              errorMessage = '服务暂不可用';
              break;
            case 504:
              errorMessage = '网关超时';
              break;
            default:
              errorMessage = response.data?.message || '请求失败';
          }
        }

        return Promise.reject(new Error(errorMessage));
      }
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
   * 处理token过期
   */
  private handleTokenExpired(): void {
    // 清除token，跳转到登录页等处理
    console.log('Token已过期，需要重新登录');
  }

  /**
   * 通用请求方法
   */
  private async request<T = any>(
    method: RequestType,
    url: string,
    data?: any,
    config?: RequestConfig
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
   * 上传文件
   */
  upload<T = any>(url: string, formData: FormData, config?: RequestConfig): Promise<T> {
    const uploadConfig: RequestConfig = {
      ...config,
      timeout: this.getTimeoutByType(RequestType.UPLOAD, config?.timeout),
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    };

    return this.request<T>(RequestType.POST, url, formData, uploadConfig);
  }

  /**
   * 下载文件
   */
  download(url: string, config?: RequestConfig): Promise<Blob> {
    const downloadConfig: RequestConfig = {
      ...config,
      timeout: this.getTimeoutByType(RequestType.DOWNLOAD, config?.timeout),
      responseType: 'blob',
    };

    return this.request<Blob>(RequestType.GET, url, undefined, downloadConfig);
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

  /**
   * 取消所有请求
   */
  cancelAllRequests(): void {
    this.cancelTokens.forEach((cancelSource, requestId) => {
      cancelSource.cancel(`批量取消请求: ${requestId}`);
    });
    this.cancelTokens.clear();
    console.log('🚫 已取消所有请求');
  }

  /**
   * 设置全局超时时间
   */
  setGlobalTimeout(timeout: number): void {
    this.instance.defaults.timeout = timeout;
    console.log(`⏰ 全局超时时间已设置为: ${timeout}ms`);
  }

  /**
   * 获取当前活跃的请求数量
   */
  getActiveRequestsCount(): number {
    return this.cancelTokens.size;
  }
}

// 创建请求实例
const request = new Request();

// 导出请求实例和类型
export default request;
export type { ApiResponse, RequestConfig };
