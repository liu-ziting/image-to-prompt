<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits(['file-uploaded'])

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const previewUrl = ref<string | null>(null)

const handleFile = (file: File) => {
    if (!file.type.match('image.*')) {
        alert('请上传图片文件！')
        return
    }

    const reader = new FileReader()
    reader.onload = e => {
        previewUrl.value = e.target?.result as string
        emit('file-uploaded', file)
    }
    reader.readAsDataURL(file)
}

const onFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files && target.files[0]) {
        handleFile(target.files[0])
    }
}

const onDrop = (e: DragEvent) => {
    e.preventDefault()
    isDragging.value = false

    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0])
    }
}

const onDragOver = (e: DragEvent) => {
    e.preventDefault()
    isDragging.value = true
}

const onDragLeave = () => {
    isDragging.value = false
}

const openFilePicker = () => {
    fileInput.value?.click()
}
</script>

<template>
    <div>
        <div
            class="upload-area"
            :class="{ 'drag-over': isDragging }"
            @dragover.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
            @click="openFilePicker"
        >
            <input ref="fileInput" type="file" class="hidden" accept="image/*" @change="onFileChange" />
            <div class="upload-content">
                <div class="upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                </div>
                <div class="upload-text">
                    <p class="title">拖放图片到此处或点击上传</p>
                    <p class="subtitle">支持 JPG, PNG, WEBP 格式 (最大 5MB)</p>
                </div>
            </div>
        </div>

        <div v-if="previewUrl" class="preview-container">
            <h3 class="preview-title">图片预览</h3>
            <div class="preview-image-wrapper">
                <img :src="previewUrl" alt="图片预览" class="preview-image" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.upload-area {
    background-color: #f8f9fa;
    border: 2px dashed #cbd5e0;
    border-radius: 12px;
    padding: 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background-image: linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.upload-area.drag-over {
    border-color: #6366f1;
    background-color: #eef2ff;
    transform: scale(1.02);
}

.upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.upload-icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6366f1;
}

.upload-icon svg {
    width: 100%;
    height: 100%;
}

.upload-text .title {
    font-size: 18px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
}

.upload-text .subtitle {
    font-size: 14px;
    color: #6b7280;
}

.preview-container {
    margin-top: 24px;
}

.preview-title {
    font-size: 18px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 12px;
}

.preview-image-wrapper {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    margin: 0 auto;
}

.preview-image {
    width: 100%;
    height: auto;
    display: block;
}

.hidden {
    display: none;
}
</style>
