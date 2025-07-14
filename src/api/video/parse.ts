/**
 * @Author Ligg
 * @Time 2025/7/14
 *
 * 数据解析
 **/
import * as cheerio from 'cheerio';

// 定义解析结果的类型
interface ParsedItem {
  title: string;
  link?: string;
  image?: string;
  description?: string;
}

/**
 * 解析HTML数据，提取搜索结果列表
 * @param htmlData HTML字符串数据
 * @returns Promise<ParsedItem[]> 解析后的条目列表
 */
export const parse = async (htmlData: string): Promise<ParsedItem[]> => {
  try {
    // 使用cheerio加载HTML
    const $ = cheerio.load(htmlData);
    const items: ParsedItem[] = [];
    
    // 使用CSS选择器选取条目列表
    $('.search-box .thumb-content > .thumb-txt').each((index, element) => {
      const $element = $(element);
      
      // 提取标题
      const title = $element.find('a').text().trim() || $element.text().trim();
      
      // 提取链接
      const link = $element.find('a').attr('href');
      
      // 提取图片（如果存在）
      const image = $element.closest('.thumb-content').find('img').attr('src');
      
      // 提取描述（如果存在）
      const description = $element.find('.desc, .description').text().trim();
      
      if (title) {
        items.push({
          title,
          link: link ? (link.startsWith('http') ? link : `https://www.ciyuancheng.net${link}`) : undefined,
          image: image ? (image.startsWith('http') ? image : `https://www.ciyuancheng.net${image}`) : undefined,
          description: description || undefined
        });
      }
    });
    
    console.log(`解析完成，共找到 ${items.length} 个条目`);
    return items;
  } catch (error) {
    console.error('HTML解析失败:', error);
    throw new Error(`HTML解析失败: ${error}`);
  }
};
