/**
 * macOS platform type definitions for react-native-orientation-locker
 * Since react-native-orientation-locker doesn't fully support macOS,
 * we provide stub implementations to prevent compilation errors.
 */

declare module 'react-native-orientation-locker' {
  interface OrientationStatic {
    lockToPortrait(): void;
    lockToLandscape(): void;
    lockToLandscapeLeft(): void;
    lockToLandscapeRight(): void;
    unlockAllOrientations(): void;
    addOrientationListener(callback: (orientation: string) => void): void;
    removeOrientationListener(callback: (orientation: string) => void): void;
    getOrientation(callback: (orientation: string) => void): void;
  }

  const Orientation: OrientationStatic;
  export default Orientation;
}
