/**
 * @Author Ligg
 * @Time 2025/7/14
 *
 * 数据解析
 **/
import {parse as parseHtml} from 'node-html-parser';
import {EpisodeItem, ParsedItem} from './types.ts';

/**
 * 解析HTML数据并提取条目列表
 * @param htmlData HTML字符串
 * @returns 解析后的条目列表
 */
export function parseSearch(htmlData: string): ParsedItem[] {
  try {
    const items: ParsedItem[] = [];
    const root = parseHtml(htmlData);

    // 解析条目名称列表
    const thumbTxtElements = root.querySelectorAll(
      '.search-box .thumb-content > .thumb-txt',
    );

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
      }
    }
    console.log(`成功解析 ${items.length} 个有效条目`);
    return items;
  } catch (error) {
    console.error('HTML解析失败:', error);
    return [];
  }
}

/**
 * 解析剧集列表
 */
export function parseEpisodes(htmlData: string, ep: number): EpisodeItem[] {
  const items: EpisodeItem[] = [];
  const root = parseHtml(htmlData);

  //提取线路名称列表
  const lineElements = root.querySelectorAll('.anthology-tab > .swiper-wrapper a');
  console.log(`找到 ${lineElements.length} 个线路`);

  //提取剧集列表容器
  const episodeElements = root.querySelectorAll('.anthology-list-box');
  console.log(`找到 ${episodeElements.length} 个剧集列表容器`);

  // 遍历每个剧集列表容器
  episodeElements.forEach((episodeElement, containerIndex) => {
    // 获取对应的线路名称
    const lineName = lineElements[containerIndex] ? lineElements[containerIndex].text.trim() : `线路${containerIndex + 1}`;

    // 在当前容器中查找所有剧集链接
    const episodeLinks = episodeElement.querySelectorAll('a');
    console.log(`线路 "${lineName}" 找到 ${episodeLinks.length} 个剧集`);

    episodeLinks.forEach((link, linkIndex) => {
      const episodeText = link.text.trim();
      const episodeUrl = link.getAttribute('href') || '';

      // 尝试从文本中提取集数
      const episodeMatch = episodeText.match(/第?(\d+)[集话]?/);
      const episodeNumber = episodeMatch ? parseInt(episodeMatch[1]) : linkIndex + 1;

      const episodeItem: EpisodeItem = {
        ep: episodeNumber,
        line: lineName,
        url: episodeUrl
      };

      items.push(episodeItem);
      console.log(`剧集 ${episodeNumber}: ${episodeText} - ${episodeUrl} (${lineName})`);
    });
  });

  console.log(`成功解析 ${items.length} 个剧集`);
  return items;
}
