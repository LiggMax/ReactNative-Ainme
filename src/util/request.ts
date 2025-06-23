/**
 * 请求工具类
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BASE_URL, TIMEOUT, HEADERS } from './config';

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
}

class Request {
  private instance: AxiosInstance;
  private baseURL: string;

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
   * 设置请求和响应拦截器
   */
  private setInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        console.log('🚀 发送请求:', config.url);

        // 在这里可以添加token
        const token = this.getToken();
        if (token) {
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
      (response: AxiosResponse<ApiResponse>) => {
        console.log('✅ 响应成功:', response.data);

        const { code, data, message } = response.data;

        // 根据业务状态码处理
        if (code === 200 || code === 0) {
          return data;
        } else {
          console.warn('⚠️ 业务错误:', message);
          return Promise.reject(new Error(message || '请求失败'));
        }
      },
      (error) => {
        console.error('❌ 响应错误:', error);

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
            case 500:
              errorMessage = '服务器内部错误';
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
   * GET请求
   */
  get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.get(url, config);
  }

  /**
   * POST请求
   */
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.post(url, data, config);
  }

  /**
   * PUT请求
   */
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.put(url, data, config);
  }

  /**
   * DELETE请求
   */
  delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }

  /**
   * PATCH请求
   */
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.patch(url, data, config);
  }

  /**
   * 上传文件
   */
  upload<T = any>(url: string, formData: FormData, config?: RequestConfig): Promise<T> {
    return this.instance.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
  }

  /**
   * 下载文件
   */
  download(url: string, config?: RequestConfig): Promise<Blob> {
    return this.instance.get(url, {
      ...config,
      responseType: 'blob',
    });
  }

  /**
   * 取消请求
   */
  cancelRequest(requestId: string): void {
    // 可以实现请求取消逻辑
    console.log(`取消请求: ${requestId}`);
  }
}

// 创建请求实例
const request = new Request();

// 导出请求实例和类型
export default request;
export type { ApiResponse, RequestConfig };
