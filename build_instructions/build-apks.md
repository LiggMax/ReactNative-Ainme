# Android 多架构 APK 构建指南

## 配置说明

已在 `android/app/build.gradle` 中添加了以下配置：

### 1. ABI Splits 配置
```gradle
splits {
    abi {
        reset()
        enable true
        universalApk false  // 如果为true，还会生成一个包含所有架构的通用APK
        include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
    }
}
```

### 2. 版本代码映射
为不同架构设置不同的版本代码，避免上传冲突：
- armeabi-v7a: versionCode * 1000 + 1
- arm64-v8a: versionCode * 1000 + 2
- x86: versionCode * 1000 + 3
- x86_64: versionCode * 1000 + 4

## 构建命令

### 构建 Release APK（所有架构）
```bash
cd android
./gradlew assembleRelease
```

### 构建 Debug APK（所有架构）
```bash
cd android
./gradlew assembleDebug
```

### 构建特定架构的 APK
```bash
# 仅构建 ARM64 架构
./gradlew assembleRelease -Preact.internal.disableAutomaticComponentCreation=true

# 或者使用 React Native CLI
npx react-native run-android --variant=release
```

## 生成的 APK 文件位置

构建完成后，APK 文件将位于：
```
android/app/build/outputs/apk/release/
├── app-armeabi-v7a-release.apk
├── app-arm64-v8a-release.apk
├── app-x86-release.apk
└── app-x86_64-release.apk
```

## 架构说明

- **armeabi-v7a**: 32位 ARM 架构，兼容大部分旧设备
- **arm64-v8a**: 64位 ARM 架构，现代 Android 设备的主流架构
- **x86**: 32位 x86 架构，主要用于模拟器和少数设备
- **x86_64**: 64位 x86 架构，主要用于模拟器和少数设备

## 注意事项

1. **APK 大小**: 分离架构可以显著减少每个 APK 的大小
2. **兼容性**: 确保目标设备支持对应的架构
3. **上传**: 可以将所有架构的 APK 上传到 Google Play Store，系统会自动为用户选择合适的版本
4. **测试**: 建议在不同架构的设备上测试应用

## 可选配置

如果需要同时生成通用 APK（包含所有架构），可以将 `universalApk` 设置为 `true`：

```gradle
splits {
    abi {
        reset()
        enable true
        universalApk true  // 同时生成通用APK
        include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
    }
}
```

这样会额外生成一个 `app-universal-release.apk` 文件。