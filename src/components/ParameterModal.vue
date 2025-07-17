<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
    visible: boolean
    currentPrompt: string
    currentSize: { width: number; height: number }
}

const props = defineProps<Props>()

const emit = defineEmits<{
    close: []
    regenerate: [params: { prompt: string; size: { width: number; height: number } }]
}>()

// 本地状态
const localPrompt = ref(props.currentPrompt)
const localWidth = ref(props.currentSize.width)
const localHeight = ref(props.currentSize.height)

// 预设尺寸选项
const sizePresets = [
    { label: '正方形 1:1', width: 1024, height: 1024 },
    { label: '横屏 16:9', width: 1344, height: 768 },
    { label: '竖屏 9:16', width: 768, height: 1344 },
    { label: '横屏 4:3', width: 1152, height: 896 },
    { label: '竖屏 3:4', width: 896, height: 1152 },
    { label: '宽屏 21:9', width: 1536, height: 640 }
]

// 监听props变化，更新本地状态
watch(
    () => props.currentPrompt,
    newPrompt => {
        localPrompt.value = newPrompt
    }
)

watch(
    () => props.currentSize,
    newSize => {
        localWidth.value = newSize.width
        localHeight.value = newSize.height
    }
)

const selectPreset = (preset: { width: number; height: number }) => {
    localWidth.value = preset.width
    localHeight.value = preset.height
}

const handleRegenerate = () => {
    emit('regenerate', {
        prompt: localPrompt.value,
        size: { width: localWidth.value, height: localHeight.value }
    })
}

const handleClose = () => {
    emit('close')
}

// 阻止背景滚动
watch(
    () => props.visible,
    visible => {
        if (visible) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
    }
)
</script>

<template>
    <div v-if="visible" class="modal-overlay" @click="handleClose">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3 class="modal-title">调整生成参数</h3>
                <button class="close-button" @click="handleClose">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <div class="modal-body">
                <!-- 提示词调整 -->
                <div class="form-group">
                    <label class="form-label">图片提示词</label>
                    <textarea v-model="localPrompt" class="form-textarea" rows="4" placeholder="请输入图片生成提示词..."></textarea>
                </div>

                <!-- 尺寸调整 -->
                <div class="form-group">
                    <label class="form-label">图片尺寸</label>

                    <!-- 预设尺寸选择 -->
                    <div class="size-presets">
                        <button
                            v-for="preset in sizePresets"
                            :key="preset.label"
                            @click="selectPreset(preset)"
                            :class="{
                                'preset-button': true,
                                active: localWidth === preset.width && localHeight === preset.height
                            }"
                        >
                            {{ preset.label }}
                            <span class="preset-size">{{ preset.width }}×{{ preset.height }}</span>
                        </button>
                    </div>

                    <!-- 自定义尺寸输入 -->
                    <!-- <div class="custom-size">
                        <div class="size-input-group">
                            <label class="size-label">宽度</label>
                            <input v-model.number="localWidth" type="number" class="size-input" min="256" max="2048" step="64" />
                        </div>
                        <div class="size-separator">×</div>
                        <div class="size-input-group">
                            <label class="size-label">高度</label>
                            <input v-model.number="localHeight" type="number" class="size-input" min="256" max="2048" step="64" />
                        </div>
                    </div> -->
                </div>
            </div>

            <div class="modal-footer">
                <button class="cancel-button" @click="handleClose">取消</button>
                <button class="regenerate-button" @click="handleRegenerate">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="1 4 1 10 7 10"></polyline>
                        <polyline points="23 20 23 14 17 14"></polyline>
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                    </svg>
                    重新生成
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 24px 0;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 24px;
    padding-bottom: 16px;
}

.modal-title {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
}

.close-button {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;
}

.close-button:hover {
    background-color: #f3f4f6;
    color: #374151;
}

.close-button svg {
    width: 20px;
    height: 20px;
}

.modal-body {
    padding: 0 24px;
}

.form-group {
    margin-bottom: 24px;
}

.form-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
}

.form-textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.5;
    resize: vertical;
    min-height: 100px;
    transition: border-color 0.2s;
}

.form-textarea:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.size-presets {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 8px;
    margin-bottom: 16px;
}

.preset-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 8px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
}

.preset-button:hover {
    border-color: #6366f1;
    background-color: #f8faff;
}

.preset-button.active {
    border-color: #6366f1;
    background-color: #eef2ff;
    color: #6366f1;
}

.preset-size {
    font-size: 11px;
    color: #6b7280;
    margin-top: 4px;
}

.preset-button.active .preset-size {
    color: #6366f1;
}

.custom-size {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background-color: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

.size-input-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.size-label {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
}

.size-input {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    text-align: center;
    transition: border-color 0.2s;
}

.size-input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.size-separator {
    font-size: 18px;
    font-weight: 500;
    color: #6b7280;
    margin-top: 16px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 24px;
    border-top: 1px solid #e5e7eb;
    margin-top: 24px;
}

.cancel-button {
    padding: 10px 20px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: white;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.cancel-button:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
}

.regenerate-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.regenerate-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.regenerate-button svg {
    width: 16px;
    height: 16px;
}

@media (max-width: 640px) {
    .modal-overlay {
        padding: 10px;
    }

    .size-presets {
        grid-template-columns: repeat(2, 1fr);
    }

    .custom-size {
        flex-direction: column;
        gap: 8px;
    }

    .size-separator {
        margin-top: 0;
    }
}
</style>
