/**
 * 视频API相关类型定义
 */
import {parseEpisodes} from './parse.ts';

// 搜索结果的类型
export interface ParsedItem {
  title: string;
  link: string;
}

/**
 * 拒接结果类型
 */
export interface EpisodeItem {
  ep: number; // 集数
  line: string; // 线路
  url: string; // 播放链接
}

/**
 * 视频地址源解析类型
 */
export interface VideoUrlSource {
  url: string; // 源链接
}
