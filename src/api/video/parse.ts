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
    console.log('开始解析HTML数据...',htmlData);
    // 使用 node-html-parser 解析HTML
    const root = parseHtml(htmlData);

    // 使用CSS选择器查找 .search-box .thumb-content > .thumb-txt 元素
    const thumbTxtElements = root.querySelectorAll('.search-box .thumb-content > .thumb-txt');
    console.log(`找到 ${thumbTxtElements.length} 个条目`);

    // 遍历每个条目并打印信息
    thumbTxtElements.forEach((element, index) => {
      console.log(`\n=== 条目 ${index + 1} ===`);
      console.log('文本内容:', element.text);
    });

    return items;

  } catch (error) {
    console.error('HTML解析失败:', error);
    return [];
  }
}
