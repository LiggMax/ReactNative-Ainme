/**
 * 图片处理工具
 */

/**
 * 转换BGM图片URL为安全的HTTPS链接
 * @param imageUrl 原始图片URL
 * @returns 安全的图片URL
 */
export const convertImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  
  // 如果是BGM的HTTP图片链接，转换为HTTPS
  if (imageUrl.startsWith('http://lain.bgm.tv/')) {
    return imageUrl.replace('http://lain.bgm.tv/', 'https://lain.bgm.tv/');
  }
  
  // 如果是其他HTTP链接，也尝试转换为HTTPS
  if (imageUrl.startsWith('http://')) {
    return imageUrl.replace('http://', 'https://');
  }
  
  return imageUrl;
};

/**
 * 获取图片的备用URL列表
 * @param images 图片对象
 * @returns 备用URL数组，按优先级排序
 */
export const getImageFallbackUrls = (images: any): string[] => {
  if (!images) return [];
  
  const urls = [];
  
  // 按优先级顺序：medium -> common -> small -> large -> grid
  if (images.medium) urls.push(convertImageUrl(images.medium));
  if (images.common) urls.push(convertImageUrl(images.common));
  if (images.small) urls.push(convertImageUrl(images.small));
  if (images.large) urls.push(convertImageUrl(images.large));
  if (images.grid) urls.push(convertImageUrl(images.grid));
  
  return urls.filter(url => url); // 过滤空值
};

/**
 * 获取最佳的图片URL
 * @param images 图片对象
 * @param preferredSize 偏好的尺寸
 * @returns 最佳图片URL
 */
export const getBestImageUrl = (
  images: any, 
  preferredSize: 'small' | 'medium' | 'large' | 'common' = 'medium'
): string => {
  if (!images) return '';
  
  // 首先尝试获取偏好尺寸
  let url = images[preferredSize];
  if (url) return convertImageUrl(url);
  
  // 备用方案
  const fallbackUrls = getImageFallbackUrls(images);
  return fallbackUrls[0] || '';
}; 