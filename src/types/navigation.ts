import {NativeStackScreenProps} from '@react-navigation/native-stack';

// 定义根导航参数类型
export type RootStackParamList = {
  Main: undefined;
  AnimeDetail: {
    id: number;
    title?: string;
  };
  Video: {
    id: number;
    title?: string;
  };
};

// 定义屏幕组件的Props类型
export type AnimeDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'AnimeDetail'>;
export type VideoScreenProps = NativeStackScreenProps<RootStackParamList, 'Video'>;

// 导航相关的类型声明
declare global {
  namespace ReactNavigation {
  }
}
