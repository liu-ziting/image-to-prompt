// 图片尺寸计算工具

// 推荐的枚举尺寸
export const RECOMMENDED_SIZES = [
    { width: 1024, height: 1024, ratio: 1.0 },      // 正方形
    { width: 768, height: 1344, ratio: 0.571 },     // 竖屏 9:16
    { width: 864, height: 1152, ratio: 0.75 },      // 竖屏 3:4
    { width: 1344, height: 768, ratio: 1.75 },      // 横屏 16:9
    { width: 1152, height: 864, ratio: 1.333 },     // 横屏 4:3
    { width: 1440, height: 720, ratio: 2.0 },       // 超宽横屏 2:1
    { width: 720, height: 1440, ratio: 0.5 }        // 超长竖屏 1:2
]

// 默认尺寸
export const DEFAULT_SIZE = { width: 1024, height: 1024 }

/**
 * 获取图片的实际尺寸
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)
        
        img.onload = () => {
            URL.revokeObjectURL(url)
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight
            })
        }
        
        img.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error('无法加载图片'))
        }
        
        img.src = url
    })
}

/**
 * 根据原图比例选择最合适的生成尺寸
 */
export function getBestSize(originalWidth: number, originalHeight: number): { width: number; height: number } {
    const originalRatio = originalWidth / originalHeight
    
    // 找到比例最接近的推荐尺寸
    let bestSize = DEFAULT_SIZE
    let minDifference = Math.abs(originalRatio - 1.0) // 默认正方形的差值
    
    for (const size of RECOMMENDED_SIZES) {
        const difference = Math.abs(originalRatio - size.ratio)
        if (difference < minDifference) {
            minDifference = difference
            bestSize = { width: size.width, height: size.height }
        }
    }
    
    return bestSize
}

/**
 * 验证自定义尺寸是否符合要求
 */
export function validateCustomSize(width: number, height: number): { valid: boolean; error?: string } {
    // 检查范围：512px - 2048px
    if (width < 512 || width > 2048) {
        return { valid: false, error: '宽度必须在 512px - 2048px 之间' }
    }
    
    if (height < 512 || height > 2048) {
        return { valid: false, error: '高度必须在 512px - 2048px 之间' }
    }
    
    // 检查是否被16整除
    if (width % 16 !== 0) {
        return { valid: false, error: '宽度必须被16整除' }
    }
    
    if (height % 16 !== 0) {
        return { valid: false, error: '高度必须被16整除' }
    }
    
    // 检查最大像素数不超过 2^21 px
    const maxPixels = Math.pow(2, 21) // 2,097,152
    if (width * height > maxPixels) {
        return { valid: false, error: `总像素数不能超过 ${maxPixels.toLocaleString()} px` }
    }
    
    return { valid: true }
}

/**
 * 格式化尺寸为字符串
 */
export function formatSize(width: number, height: number): string {
    return `${width}x${height}`
}

/**
 * 获取尺寸的描述文本
 */
export function getSizeDescription(width: number, height: number): string {
    const ratio = width / height
    
    if (Math.abs(ratio - 1.0) < 0.1) {
        return '正方形'
    } else if (ratio > 1.5) {
        return '横屏'
    } else if (ratio < 0.67) {
        return '竖屏'
    } else if (ratio > 1.0) {
        return '横向'
    } else {
        return '纵向'
    }
}