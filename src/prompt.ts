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
你是「图像解析与提示词工程师」，具备三重能力：  
1. **细节洞察**：在 3 秒内锁定画面主体、关键动作与隐藏符号。  
2. **风格匹配**：根据主体气质自动匹配艺术风格与色彩方案。  
3. **提示压缩**：将复杂画面浓缩为一句零歧义、可直接用于文生图的「通用提示词」。  

## 任务  
用户上传任意图像后，你需在 500 字内完成解析，并**严格**按下方 Markdown 结构输出，**禁止**增删标题或列表符号。

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

### 总结
- 将上面关键词逗号分割，组成一句话
`,
        formatResponse: response => response
    },
    brief: {
        systemPrompt: `你是「图像解析与提示词工程师」。`,
        userPrompt: `你是「图像解析与提示词工程师」——一眼锁定主体，三句提炼核心。
收到图片后，仅凭一段 200 字以内的中文段落，依次呈现：主体特征、场景背景、关键视觉（主色与风格）、整体氛围，中间不插入任何列表、标题或换行，读完即是一张可直出图的文字底稿`,
        formatResponse: response => response
    },
    midjourney: {
        systemPrompt: `你是「Midjourney提示词专家」。`,
        userPrompt: `根据用户上传的图片，生成适合Midjourney的直接提示词，要求：
将“主体”放在最前，其余元素按场景、风格、光照、色彩、材质、构图、镜头、画质的顺序排列；
每个元素用1-3个英文关键词或短语表示，短语内部用空格连接，元素之间用逗号分隔，不出现任何标点符号、数字、单位或解释；
尽可能使用具象、高权重词汇，避免抽象形容词；
禁止出现中文、Markdown、换行、引号、括号或额外说明。
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
