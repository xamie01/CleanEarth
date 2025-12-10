import 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
    style?: any;
  }
  interface TextProps {
    className?: string;
    style?: any;
  }
  interface ImageProps {
    className?: string;
    style?: any;
  }
  interface ScrollViewProps {
    className?: string;
    style?: any;
  }
  interface FlatListProps<ItemT> {
    className?: string;
    style?: any;
  }
  interface SectionListProps<ItemT, SectionT = DefaultSectionT> {
    className?: string;
    style?: any;
  }
  interface PressableProps {
    className?: string;
    style?: any;
  }
  interface TouchableOpacityProps {
    className?: string;
    style?: any;
  }
  interface TouchableHighlightProps {
    className?: string;
    style?: any;
  }
}

export {};


