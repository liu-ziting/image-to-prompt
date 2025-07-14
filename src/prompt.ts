// 提示词生成模式配置
export type PromptMode = 'detailed' | 'brief' | 'midjourney'

interface PromptConfig {
    systemPrompt: string
    userPrompt: string
    formatResponse: (response: string) => string
}

export const promptConfigs: Record<PromptMode, PromptConfig> = {
    detailed: {
        systemPrompt: `你是「图像解析与提示词工程师」。`,
        userPrompt: `# 图片解析提示词生成

## 角色
你是「图像解析与提示词工程师」。

## 任务
根据用户上传的任意图片，生成可直接用于生成文本图片的精准提示词，并输出中文「通用提示词」。  
请**严格按照下方 Markdown 结构**返回，不要增删任何标题或列表符号。

### 主体描述
- 主体名称与数量
- 显著特征（服饰、发型、表情、姿态、动作）
- 关键道具或配件

### 风格与艺术
- 艺术风格（超写实主义 / 赛博朋克 / 吉卜力 / 8-bit 像素 / 印象派 / 水墨等）
- 参考艺术家或 IP（若有）
- 色彩方案（主色 + 辅助色）
- 光影效果（逆光 / 霓虹 / 柔光 / 体积光 / 高对比硬光）

### 细节特征
- 材质与纹理（金属拉丝 / 粗糙石面 / 丝绸光泽 / 玻璃折射）
- 特殊细节（裂纹、粒子特效、机械关节、荧光纹路等）

### 构图与视角
- 镜头类型（特写 / 中景 / 广角 / 鱼眼 / 航拍）
- 构图方式（对称 / 三分法 / 引导线 / 框架式）
- 视角（低角度仰拍 / 俯视 / 第一人称 / 侧逆光剪影）

### 氛围与情感
- 整体氛围（宁静治愈 / 紧张悬疑 / 史诗恢弘 / 孤独寂寥）
- 情绪关键词（温暖、冷酷、神秘、浪漫、压迫感）

### 通用提示词
- 用一句话概括画面：主体 + 场景 + 风格 + 氛围 + 关键细节`,
        formatResponse: response => response
    },
    brief: {
        systemPrompt: `你是「图像解析与提示词工程师」。`,
        userPrompt: `根据用户上传的图片，生成简洁的图片描述，包含以下要素：
1. 主体描述（主要对象及其特征）
2. 场景描述（背景和环境）
3. 关键视觉特征（颜色、风格等）
4. 氛围感受

请用简洁的段落格式返回，不要使用列表或标题。`,
        formatResponse: response => response
    },
    midjourney: {
        systemPrompt: `你是「Midjourney提示词专家」。`,
        userPrompt: `根据用户上传的图片，生成适合Midjourney的直接提示词，要求：
1. 使用英文
2. 包含主体、场景、风格、光照、色彩等关键元素
3. 使用逗号分隔关键词
4. 遵循Midjourney最佳实践（如重要词前置）
5. 不要包含任何Markdown格式或额外说明
`,
        formatResponse: response => {
            // 清理可能的多余格式
            return response.replace(/^"|"$/g, '').trim()
        }
    }
}

export const modeLabels: Record<PromptMode, string> = {
    detailed: '详细描述',
    brief: '简要描述',
    midjourney: 'Midjourney'
}
