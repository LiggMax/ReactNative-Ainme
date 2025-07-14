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
    // console.log('开始解析HTML数据...',htmlData);
    // 使用 node-html-parser 解析HTML
    const root = parseHtml(htmlData);

    // 解析条目名称列表
    const thumbTxtElements = root.querySelectorAll('.search-box .thumb-content > .thumb-txt');

    // 解析条目链接列表
    const thumbMenuLinks = root.querySelectorAll('.search-box .thumb-menu > a');

    // 构建条目数据
    const maxLength = Math.max(thumbTxtElements.length, thumbMenuLinks.length);
    for (let i = 0; i < maxLength; i++) {
      const titleElement = thumbTxtElements[i];
      const linkElement = thumbMenuLinks[i];

      const item: ParsedItem = {
        title: titleElement ? titleElement.text.trim() : '',
        link: linkElement ? linkElement.getAttribute('href') || '' : '',
      };

      if (item.title || item.link) {
        items.push(item);
        console.log(`条目 ${items.length}: ${item.title} - ${item.link}`);
      }
    }
    console.log(`成功解析 ${items.length} 个有效条目`);
    return items;

  } catch (error) {
    console.error('HTML解析失败:', error);
    return [];
  }
}
