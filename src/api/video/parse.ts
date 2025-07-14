/**
 * @Author Ligg
 * @Time 2025/7/14
 *
 * 数据解析
 **/
import { parse as parseHtml } from 'node-html-parser';
import { ParsedItem } from './types';

/**
 * 解析HTML数据并提取条目列表
 * @param htmlData HTML字符串
 * @returns 解析后的条目列表
 */
export function parse(htmlData: string): ParsedItem[] {
  try {
    const items: ParsedItem[] = [];
    console.log('开始解析HTML数据...');
    
    // 使用 node-html-parser 解析HTML
    const root = parseHtml(htmlData);

    // 使用CSS选择器查找 .search-box .thumb-content > .thumb-txt 元素
    const thumbTxtElements = root.querySelectorAll('.search-box .thumb-content > .thumb-txt');
    console.log(`找到 ${thumbTxtElements.length} 个条目`);

    thumbTxtElements.forEach((thumbTxtElement, index) => {
      // 提取标题和链接（通常在 a 标签中）
      const linkElement = thumbTxtElement.querySelector('a');
      const title = linkElement ? linkElement.text.trim() : '';
      let link = linkElement ? linkElement.getAttribute('href') || '' : '';
      
      // 如果是相对路径，转换为绝对路径
      if (link && !link.startsWith('http')) {
        link = `https://www.ciyuancheng.net${link.startsWith('/') ? '' : '/'}${link}`;
      }
      
      // 提取图片（在父级 thumb-content 中查找）
      const thumbContentElement = thumbTxtElement.parentNode;
      const imgElement = thumbContentElement?.querySelector('img');
      let image = imgElement ? imgElement.getAttribute('src') || '' : '';
      
      // 如果是相对路径，转换为绝对路径
      if (image && !image.startsWith('http')) {
        image = `https://www.ciyuancheng.net${image.startsWith('/') ? '' : '/'}${image}`;
      }
      
      // 提取描述（可能在 p 标签中）
      const descElement = thumbTxtElement.querySelector('p');
      const description = descElement ? descElement.text.trim() : '';
      
      if (title || link) {
        const item = {
          title,
          link,
          image,
          description
        };
        items.push(item);
        
        // 只打印条目信息，不打印HTML内容
        console.log(`条目 ${index + 1}:`, {
          标题: title,
          链接: link,
          图片: image,
          描述: description
        });
      }
    });
    
    console.log(`解析完成，共提取到 ${items.length} 个有效条目`);
    return items;
    
  } catch (error) {
    console.error('HTML解析失败:', error);
    return [];
  }
}
