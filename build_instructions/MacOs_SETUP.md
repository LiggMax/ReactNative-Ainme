# macOS 平台支持

本项目已添加对 macOS 平台的支持，包括视频播放器和屏幕方向控制功能。

## 安装和运行

### 前提条件
- macOS 11.0 或更高版本
- Xcode 12 或更高版本
- Node.js 18 或更高版本
- React Native macOS CLI

### 安装步骤

1. 确保已安装所有依赖：
```bash
npm install
# 或
yarn install
```

2. 安装 macOS 依赖（如果网络连接正常）：
```bash
cd macos && pod install && cd ..
```

3. 运行 macOS 应用：
```bash
npm run macos
# 或
yarn macos
```

## 屏幕方向控制

### 平台差异处理

由于 `react-native-orientation-locker` 库对 macOS 平台的支持有限，我们实现了平台特定的处理：

- **移动平台（iOS/Android）**：使用 `react-native-orientation-locker` 进行屏幕方向控制
- **macOS 平台**：跳过方向锁定，因为桌面应用不需要强制方向控制

### 实现细节


```typescript
// 仅在非 macOS 平台执行方向控制
if (Platform.OS !== 'macos') {
  Orientation.lockToPortrait();
}
```

### 功能特性

1. **视频播放器**：完全支持 macOS 平台
2. **全屏模式**：在 macOS 上正常工作，无需方向锁定
3. **状态栏控制**：仅在移动平台上隐藏/显示状态栏
4. **响应式设计**：自动适应 macOS 窗口大小变化

## 故障排除

### 网络连接问题

如果在运行 `pod install` 时遇到网络连接问题：

1. 检查网络连接
2. 尝试使用 VPN 或代理
3. 使用镜像源（如果可用）

### 编译错误

如果遇到 `react-native-orientation-locker` 相关的编译错误：

1. 确保使用了我们提供的类型定义文件 `src/types/orientation-locker-macos.d.ts`
2. 检查平台检测逻辑是否正确实现

### 性能优化

- 使用 `useCallback` 优化函数性能
- 平台特定代码分离，避免不必要的库调用
- 响应式设计确保在不同窗口大小下的良好体验

## 开发建议

1. **测试多平台**：确保代码在所有支持的平台上正常工作
2. **平台特定功能**：使用 `Platform.select()` 或 `Platform.OS` 进行平台特定实现
3. **性能监控**：在 macOS 上监控应用性能，特别是视频播放性能

## 支持的功能

✅ 视频播放  
✅ 全屏模式  
✅ 播放控制  
✅ 进度条  
✅ 音量控制  
✅ 响应式布局  
⚠️ 屏幕方向锁定（仅移动平台）  
⚠️ 状态栏控制（仅移动平台）  

## 更新日志

- 添加 macOS 平台支持
- 实现平台特定的屏幕方向控制
- 优化视频播放器性能
- 添加类型定义文件
- 更新 Metro 配置支持 macOS