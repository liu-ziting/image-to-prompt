<script setup lang="ts">
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

const showCopied = ref(false)
const htmlPrompt = ref('')

const copyToClipboard = () => {
    if (!props.prompt) return

    navigator.clipboard.writeText(props.prompt).then(() => {
        showCopied.value = true
        setTimeout(() => {
            showCopied.value = false
        }, 2000)
    })
}

watch(
    () => props.prompt,
    newPrompt => {
        showCopied.value = false
        // 将 Markdown 转换为 HTML
        htmlPrompt.value = newPrompt ? marked(newPrompt) : ''
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
                <h3 class="result-title">图片提示词</h3>
                <button @click="copyToClipboard" class="copy-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>复制</span>
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
    padding: 16px 24px;
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
