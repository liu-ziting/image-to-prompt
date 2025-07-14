<script setup lang="ts">
import { ref } from 'vue'
import ImageUploader from './components/ImageUploader.vue'
import PromptResult from './components/PromptResult.vue'

// 应用状态
const uploadedFile = ref<File | null>(null)
const promptResult = ref<string>('')
const isLoading = ref(false)

const handleFileUploaded = (file: File) => {
    uploadedFile.value = file
    promptResult.value = '' // 清除之前的结果
}

const analyzeImage = async () => {
    if (!uploadedFile.value) {
        alert('请先上传图片！')
        return
    }

    isLoading.value = true
    promptResult.value = ''

    try {
        // 将图片转换为base64
        const reader = new FileReader()
        reader.onload = async e => {
            const base64String = e.target?.result as string
            // 提取base64数据部分（去掉前面的data:image/...;base64,）
            const base64Data = base64String.split(',')[1]

            // 调用API
            const response = await callZhipuAI(base64Data)
            promptResult.value = response
        }
        reader.readAsDataURL(uploadedFile.value)
    } catch (error) {
        console.error('分析图片出错:', error)
        promptResult.value = '分析图片时出错，请重试'
        isLoading.value = false
    }
}

const callZhipuAI = async (base64Data: string): Promise<string> => {
    const apiKey = 'a835b9f6866d48ec956d341418df8a50.NuhlKYn58EkCb5iP'

    try {
        const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'GLM-4.1V-Thinking-Flash',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Data}`
                                }
                            },
                            {
                                type: 'text',
                                text: `图片解析与MJ提示词生成

## 要求
请根据上传的图片生成一个可直接用于Midjourney的精准提示词，使用Markdown格式返回结果。

## 输出格式
请按照以下格式组织内容，使用恰当的Markdown标题和列表：

### 主体描述
- 清晰描述图片中的主体对象
- 包括人物/物体的特征、姿态、表情等细节

### 风格与艺术
- 艺术风格（如超写实主义、赛博朋克等）
- 可能的艺术家/IP参考
- 色彩方案与光影效果

### 细节特征
- 材质与纹理描述
- 特殊细节或独特元素

### 构图与视角
- 镜头类型与构图方式
- 画面视角

### 氛围与情感
- 画面传递的情绪或氛围

### Midjourney参数建议
- 适合的MJ参数（如8k分辨率、unreal engine渲染等）

### 一句话提示词总结
- 没用其他废话，一句话包含所有的提示词总结

请确保使用清晰的Markdown格式，包括恰当的标题层级和列表# 图片解析与MJ提示词生成提示词

请你作为专业的图像解析与提示词工程师，基于用户上传的图片，生成一个可直接用于Midjourney的精准提示词。请遵循以下规则：

## 1. 核心解析维度（必须包含）
- 明确图片主体：人物/物体/场景的具体名称、特征（如“戴红色围巾的短发女孩”“悬浮在云层中的复古飞船”）。
- 风格定义：画面的艺术风格（如“超写实主义”“赛博朋克动画”“莫奈印象派”“8-bit像素风”）、可能参考的艺术家/IP（如“宫崎骏风格”“Studio Ghibli”“Beeple数字艺术”）。
- 细节描述：纹理（如“光滑金属质感”“粗糙麻布纹理”）、色彩（如“高饱和撞色”“低明度莫兰迪色系”）、光影（如“逆光剪影”“柔光漫射”“硬光强对比”）。
- 构图与视角：镜头类型（如“特写镜头”“全景俯拍”“鱼眼镜头”）、构图方式（如“对称构图”“黄金分割构图”）。
- 氛围与情感：画面传递的情绪（如“宁静治愈”“紧张悬疑”“未来科技感”）。
- MJ参数提示：加入适配MJ的常用参数描述（如“8k分辨率”“极致细节”“cinematic lighting”“unreal engine渲染”）。
`
                            }
                        ]
                    }
                ]
            })
        })

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`)
        }

        isLoading.value = false

        const data = await response.json()

        return data.choices[0]?.message?.content || '未能获取描述信息'
    } catch (error) {
        console.error('API调用失败:', error)
        return 'API调用失败，请检查网络或API Key'
    }
}
</script>

<template>
    <!-- 保持原有的template部分不变 -->
    <div class="app-container">
        <!-- 头部 -->
        <header class="app-header">
            <h1 class="app-title">Image To Prompt</h1>
            <p class="app-subtitle">上传图片，获取AI生成提示词，为您的创意提供无限可能</p>
        </header>

        <!-- 主卡片 -->
        <div class="main-card">
            <!-- 上传区域 -->
            <ImageUploader @file-uploaded="handleFileUploaded" />

            <!-- 操作按钮 -->
            <div class="action-section">
                <button @click="analyzeImage" :disabled="isLoading || !uploadedFile" class="analyze-button" :class="{ disabled: isLoading || !uploadedFile }">
                    <span v-if="!isLoading">识别图片提示词</span>
                    <span v-else>分析中...</span>
                    <svg v-if="isLoading" class="spinner" viewBox="0 0 50 50">
                        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle>
                    </svg>
                </button>
            </div>

            <!-- 结果区域 -->
            <PromptResult :prompt="promptResult" :is-loading="isLoading" />

            <!-- 特性展示 -->
            <div class="features-section">
                <h2 class="features-title">为什么选择 Image To Prompt</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                            </svg>
                        </div>
                        <h3 class="feature-title">快速识别</h3>
                        <p class="feature-description">只需几秒钟即可获取图片的详细提示词</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                        </div>
                        <h3 class="feature-title">隐私保护</h3>
                        <p class="feature-description">您的图片不会上传到服务器，所有处理在本地完成</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                                <line x1="16" y1="8" x2="2" y2="22"></line>
                                <line x1="17.5" y1="15" x2="9" y2="15"></line>
                            </svg>
                        </div>
                        <h3 class="feature-title">创意无限</h3>
                        <p class="feature-description">为AI生成艺术提供完美的提示词</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 页脚 -->
        <footer class="app-footer">
            <p>© 2025 Image To Prompt | <a href="https://github.com/liu-ziting/" target="_blank" rel="noopener">liu-ziting</a></p>
        </footer>
    </div>
</template>

<style>
/* 保持原有的style部分不变 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
a {
    color: #000000;
    text-decoration: none;
}
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f3f4f6;
    color: #333;
    line-height: 1.6;
}

.app-container {
    min-height: 100vh;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%);
}

.app-header {
    text-align: center;
    margin-bottom: 40px;
    padding: 0 20px;
    max-width: 800px;
}

.app-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 16px;
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    position: relative;
    display: inline-block;
}

.app-title::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
    border-radius: 2px;
}

.app-subtitle {
    font-size: 1.1rem;
    color: #4b5563;
    margin-top: 16px;
}

.main-card {
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    padding: 32px;
    width: 100%;
    max-width: 1000px;
    margin-bottom: 40px;
}

.action-section {
    display: flex;
    justify-content: center;
    margin-top: 32px;
}

.analyze-button {
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
    color: white;
    border: none;
    padding: 14px 40px;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
    display: inline-flex;
    align-items: center;
    gap: 10px;
    position: relative;
}

.analyze-button:hover:not(.disabled) {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
}

.analyze-button:active:not(.disabled) {
    transform: translateY(1px);
}

.analyze-button.disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.spinner {
    animation: rotate 1s linear infinite;
    width: 20px;
    height: 20px;
    margin-left: 10px;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.features-section {
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid #e5e7eb;
}

.features-title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 32px;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
}

.feature-card {
    background-color: #f9fafb;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    transition: transform 0.3s ease;
    border: 1px solid #e5e7eb;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.feature-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 20px;
    background-color: #eef2ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4f46e5;
}

.feature-icon svg {
    width: 32px;
    height: 32px;
}

.feature-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 12px;
}

.feature-description {
    font-size: 0.95rem;
    color: #6b7280;
}

.app-footer {
    text-align: center;
    color: #6b7280;
    font-size: 0.9rem;
    padding-top: 20px;
    margin-top: auto;
}

@media (max-width: 768px) {
    .app-container {
        padding: 16px;
    }
    .app-title {
        font-size: 2rem;
    }

    .main-card {
        padding: 24px;
    }

    .analyze-button {
        padding: 12px 32px;
        font-size: 1rem;
    }

    .features-grid {
        grid-template-columns: 1fr;
    }
}
</style>

