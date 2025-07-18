<script setup lang="ts">
import { defineOptions } from 'vue'

defineOptions({
    name: 'PromptResult'
})
import { ref, defineProps, withDefaults, watch } from 'vue'
import { marked } from 'marked'

interface Props {
    prompt?: string
    isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    prompt: '',
    isLoading: false
})

const emit = defineEmits<{
    generateImage: [prompt: string]
}>()

const showCopied = ref(false)
const htmlPrompt = ref('')

const copyToClipboard = () => {
    if (!props.prompt) return

    // 创建临时textarea元素
    const textarea = document.createElement('textarea')
    textarea.value = props.prompt
    textarea.style.position = 'fixed' // 防止页面滚动
    document.body.appendChild(textarea)
    textarea.select()

    try {
        // 尝试使用现代API
        if (navigator.clipboard) {
            navigator.clipboard
                .writeText(props.prompt)
                .then(() => {
                    showCopiedToast()
                })
                .catch(() => {
                    fallbackCopy()
                })
        } else {
            // 使用传统方法
            fallbackCopy()
        }
    } catch (e) {
        fallbackCopy()
    } finally {
        document.body.removeChild(textarea)
    }

    function fallbackCopy() {
        try {
            const success = document.execCommand('copy')
            if (success) {
                showCopiedToast()
            }
        } catch (e) {
            console.error('复制失败:', e)
        }
    }

    function showCopiedToast() {
        showCopied.value = true
        setTimeout(() => {
            showCopied.value = false
        }, 2000)
    }
}

const handleGenerateImage = () => {
    if (props.prompt) {
        emit('generateImage', props.prompt)
    }
}

watch(
    () => props.prompt,
    async newPrompt => {
        showCopied.value = false
        // 将 Markdown 转换为 HTML
        if (newPrompt) {
            const result = await marked(newPrompt)
            htmlPrompt.value = typeof result === 'string' ? result : ''
        } else {
            htmlPrompt.value = ''
        }
    }
)
</script>

<template>
    <div class="result-container">
        <div v-if="isLoading" class="loading-indicator">
            <div class="spinner"></div>
            <p class="loading-text">正在分析图片内容，请稍候...</p>
        </div>

        <div v-else-if="prompt" class="result-card">
            <div class="result-header">
                <div class="header-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                    </svg>
                </div>
                <h3 class="result-title">Prompt</h3>
                <button @click="copyToClipboard" class="copy-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>复制</span>
                </button>
                <button @click="handleGenerateImage" class="generate-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M10.6144 17.7956C10.277 18.5682 9.20776 18.5682 8.8704 17.7956L7.99275 15.7854C7.21171 13.9966 5.80589 12.5726 4.0523 11.7942L1.63658 10.7219C.868536 10.381.868537 9.26368 1.63658 8.92276L3.97685 7.88394C5.77553 7.08552 7.20657 5.60881 7.97427 3.75892L8.8633 1.61673C9.19319.821767 10.2916.821765 10.6215 1.61673L11.5105 3.75894C12.2782 5.60881 13.7092 7.08552 15.5079 7.88394L17.8482 8.92276C18.6162 9.26368 18.6162 10.381 17.8482 10.7219L15.4325 11.7942C13.6789 12.5726 12.2731 13.9966 11.492 15.7854L10.6144 17.7956ZM4.53956 9.82234C6.8254 10.837 8.68402 12.5048 9.74238 14.7996 10.8008 12.5048 12.6594 10.837 14.9452 9.82234 12.6321 8.79557 10.7676 7.04647 9.74239 4.71088 8.71719 7.04648 6.85267 8.79557 4.53956 9.82234ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899ZM18.3745 19.0469 18.937 18.4883 19.4878 19.0469 18.937 19.5898 18.3745 19.0469Z"
                        ></path>
                    </svg>
                    <span>生成图片</span>
                </button>
            </div>
            <div class="result-content">
                <div class="prompt-text" v-html="htmlPrompt"></div>
            </div>
            <div v-if="showCopied" class="copied-notice">已复制到剪贴板!</div>
        </div>
    </div>
</template>

<style scoped>
.result-container {
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
    background-color: #eef2ff;
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
}

.header-icon {
    width: 24px;
    height: 24px;
    color: #6366f1;
    margin-right: 12px;
}

.result-title {
    font-size: 18px;
    font-weight: 600;
    color: #4338ca;
    flex-grow: 1;
}

.copy-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: #6366f1;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 6px;
    transition: all 0.2s;
}

.copy-button:hover {
    background-color: #e0e7ff;
}

.copy-button svg {
    width: 16px;
    height: 16px;
}

.generate-button {
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

.generate-button:hover {
    background-color: #dcfce7;
}

.generate-button svg {
    width: 16px;
    height: 16px;
}

.result-content {
    padding: 24px;
}

.prompt-text {
    font-size: 16px;
    line-height: 1.6;
    color: #4b5563;
}

.copied-notice {
    background-color: #6366f1;
    color: white;
    text-align: center;
    padding: 8px;
    font-size: 14px;
    animation: fadeInOut 2s;
}

@keyframes fadeInOut {
    0% {
        opacity: 0;
    }
    20% {
        opacity: 1;
    }
    80% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

/* 添加一些 Markdown 渲染样式 */
.prompt-text >>> h1,
.prompt-text >>> h2,
.prompt-text >>> h3,
.prompt-text >>> h4 {
    margin: 1em 0 0.5em 0;
    font-weight: 600;
    color: #1f2937;
}

.prompt-text >>> p {
    margin: 0.5em 0;
    line-height: 1.6;
}

.prompt-text >>> ul,
.prompt-text >>> ol {
    margin: 0.5em 0;
    padding-left: 1.5em;
}

.prompt-text >>> li {
    margin: 0.25em 0;
}

.prompt-text >>> code {
    background-color: #f3f4f6;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
}

.prompt-text >>> pre {
    background-color: #f3f4f6;
    padding: 1em;
    border-radius: 6px;
    overflow-x: auto;
    margin: 1em 0;
}

.prompt-text >>> pre code {
    background-color: transparent;
    padding: 0;
}

.prompt-text >>> blockquote {
    border-left: 4px solid #e5e7eb;
    padding-left: 1em;
    margin: 1em 0;
    color: #6b7280;
}

.prompt-text >>> a {
    color: #6366f1;
    text-decoration: none;
}

.prompt-text >>> a:hover {
    text-decoration: underline;
}
</style>
