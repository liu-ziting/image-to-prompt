<script lang="ts">
export default {
    name: 'ImageUploader'
}
</script>

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
            :class="{ 'drag-over': isDragging, 'has-image': previewUrl }"
            @dragover.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
            @click="openFilePicker"
        >
            <input ref="fileInput" type="file" class="hidden" accept="image/*" @change="onFileChange" />

            <!-- 未上传图片时显示上传提示 -->
            <div v-if="!previewUrl" class="upload-content">
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

            <!-- 已上传图片时显示图片和重新上传提示 -->
            <div v-else class="image-preview-content">
                <div class="preview-image-container">
                    <img :src="previewUrl" alt="已上传图片" class="uploaded-image" />
                    <div class="image-overlay">
                        <div class="overlay-content">
                            <div class="overlay-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                            </div>
                            <p class="overlay-text">点击重新上传</p>
                        </div>
                    </div>
                </div>
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

.upload-area.has-image {
    padding: 0;
    background: none;
    border: 2px solid #e5e7eb;
}

.upload-area.has-image:hover {
    border-color: #6366f1;
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

.image-preview-content {
    width: 100%;
    height: 100%;
}

.preview-image-container {
    position: relative;
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
}

.uploaded-image {
    width: 100%;
    height: auto;
    max-height: 400px;
    object-fit: contain;
    display: block;
    background: #f8f9fa;
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.preview-image-container:hover .image-overlay {
    opacity: 1;
}

.overlay-content {
    text-align: center;
    color: white;
}

.overlay-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.overlay-icon svg {
    width: 100%;
    height: 100%;
}

.overlay-text {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
}

.hidden {
    display: none;
}
</style>
