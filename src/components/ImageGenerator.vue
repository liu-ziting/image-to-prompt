<script setup lang="ts">
import { defineOptions, ref, defineProps, withDefaults } from 'vue'

defineOptions({
    name: 'ImageGenerator'
})

interface Props {
    generatedImage?: string
    isLoading?: boolean
    prompt?: string
}

const props = withDefaults(defineProps<Props>(), {
    generatedImage: '',
    isLoading: false,
    prompt: ''
})

const emit = defineEmits<{
    generateImage: [prompt: string]
}>()

const handleGenerateImage = () => {
    if (props.prompt) {
        emit('generateImage', props.prompt)
    }
}
</script>

<template>
    <div class="generator-container">
        <div v-if="isLoading" class="loading-indicator">
            <div class="spinner"></div>
            <p class="loading-text">正在根据提示词生成图片，请稍候...</p>
        </div>

        <div v-else-if="generatedImage" class="result-card">
            <div class="result-header">
                <div class="header-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                </div>
                <h3 class="result-title">AI生成图片（模型决定效果，仅供参考）</h3>
                <button @click="handleGenerateImage" class="regenerate-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="1 4 1 10 7 10"></polyline>
                        <polyline points="23 20 23 14 17 14"></polyline>
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                    </svg>
                    <span>重新生成</span>
                </button>
            </div>
            <div class="result-content">
                <img :src="generatedImage" alt="AI生成的图片" class="generated-image" />
            </div>
            <!-- <div v-if="generatedImage" class="download-section">
                <a :href="generatedImage" download="ai-generated-image.png" class="download-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>下载图片</span>
                </a>
            </div> -->
        </div>

        <div v-else class="empty-state">
            <div class="empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
            </div>
            <p class="empty-text">点击"生成AI图片"按钮，将提示词转化为精美图片</p>
        </div>
    </div>
</template>

<style scoped>
.generator-container {
    margin-top: 32px;
}

.loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(99, 102, 241, 0.2);
    border-top: 4px solid #6366f1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.loading-text {
    font-size: 16px;
    color: #4b5563;
}

.result-card {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    border: 1px solid #e5e7eb;
}

.result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f0fdf4;
    padding: 16px 24px;
    border-bottom: 1px solid #e5e7eb;
}

.header-icon {
    width: 24px;
    height: 24px;
    color: #16a34a;
    margin-right: 12px;
}

.result-title {
    font-size: 18px;
    font-weight: 600;
    color: #15803d;
    flex-grow: 1;
}

.regenerate-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: #16a34a;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 6px;
    transition: all 0.2s;
}

.regenerate-button:hover {
    background-color: #dcfce7;
}

.regenerate-button svg {
    width: 16px;
    height: 16px;
}

.result-content {
    padding: 24px;
}

.generated-image {
    width: 100%;
    max-width: 512px;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: block;
    margin: 0 auto;
}

.download-section {
    padding: 0 24px 24px;
    text-align: center;
}

.download-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(90deg, #16a34a, #22c55e);
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
}

.download-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.download-button svg {
    width: 16px;
    height: 16px;
}

.empty-state {
    text-align: center;
    padding: 48px 24px;
    background-color: #f9fafb;
    border-radius: 12px;
    border: 2px dashed #d1d5db;
}

.empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    color: #9ca3af;
}

.empty-icon svg {
    width: 100%;
    height: 100%;
}

.empty-text {
    font-size: 16px;
    color: #6b7280;
    margin: 0;
}
</style>
