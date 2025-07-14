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

    // 遍历每个条目名称
    thumbTxtElements.forEach((element, index) => {
      console.log('条目名称:', element.text);
    });

    // 遍历每个条目链接
     thumbMenuLinks.forEach((link, index) => {
       console.log(`\n=== 链接 ${index + 1} ===`);
       console.log('链接地址:', link.getAttribute('href'));
       console.log('链接文本:', link.text);
     });

    return items;

  } catch (error) {
    console.error('HTML解析失败:', error);
    return [];
  }
}
