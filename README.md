# Image To Prompt - 图片转 AI 提示词工具

一个基于 Vue 3 + Vite 的 AI 应用，可将上传的图片转换为高质量的描述性文本提示词，支持多种输出风格。

## ✨ 核心功能

-   **图片转提示词** - 上传任意图片，自动生成详细的描述性提示词
-   **多风格切换** - 支持三种输出模式：
    -   📝 **详细描述** - 包含主体、风格、构图等全面分析
    -   ✏️ **简要描述** - 简洁的段落式描述
    -   🎨 **Midjourney** - 专为 Midjourney 优化的英文提示词格式
-   **响应式设计** - 适配各种设备屏幕
-   **隐私保护** - 图片处理完全在本地进行

## 📂 项目目录结构

```
image-to-prompt/
├── public/                  # 静态资源
├── src/
│   ├── assets/              # 样式和图片资源
│   ├── components/          # Vue组件
│   │   ├── ImageUploader.vue # 图片上传组件
│   │   └── PromptResult.vue # 提示词展示组件
│   ├── App.vue              # 主应用组件
│   ├── main.ts              # 应用入口
│   ├── prompt.ts            # 提示词生成逻辑
│   └── style.css            # 全局样式
├── index.html               # 主HTML文件
├── package.json             # 项目配置
├── vite.config.js           # Vite配置
└── README.md                # 项目文档
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:5173](http://localhost:5173)

### 生产构建

```bash
npm run build
```

## 🛠️ 技术栈

-   [Vue 3](https://vuejs.org/) - 前端框架
-   [Vite](https://vitejs.dev/) - 构建工具
-   [GLM-4V API](https://open.bigmodel.cn/) - AI 图片分析
-   [TypeScript](https://www.typescriptlang.org/) - 类型安全

## 📝 使用示例

1. 点击"上传图片"按钮或拖放图片到上传区域
2. 选择输出风格：
    - 详细描述 - 适合需要全面分析的场景
    - 简要描述 - 适合快速获取关键信息
    - Midjourney - 专为 AI 绘画优化的提示词
3. 点击"识别图片提示词"按钮
4. 获取生成的提示词并复制使用

## 📜 许可证

MIT License © 2025

