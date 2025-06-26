import {NativeStackScreenProps} from '@react-navigation/native-stack';

// 定义根导航参数类型123
export type RootStackParamList = {
  Main: undefined;
  AnimeDetail: {
    id: number;
    title?: string;
  };
};

// 定义屏幕组件的Props类型
export type MainScreenProps = NativeStackScreenProps<RootStackParamList, 'Main'>;
export type AnimeDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'AnimeDetail'>;

// 导航相关的类型声明
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
