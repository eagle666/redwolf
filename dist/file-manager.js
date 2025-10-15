"use strict";
// 文件上传和管理系统
// 模块8: TDD开发 - 文件上传和管理系统
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileMemoryStore = void 0;
exports.uploadFile = uploadFile;
exports.validateFile = validateFile;
exports.deleteFile = deleteFile;
exports.getFileMetadata = getFileMetadata;
exports.updateFileMetadata = updateFileMetadata;
exports.listFiles = listFiles;
exports.searchFiles = searchFiles;
exports.getFileUrl = getFileUrl;
exports.processImageFile = processImageFile;
exports.generateThumbnail = generateThumbnail;
exports.compressFile = compressFile;
exports.moveFile = moveFile;
exports.copyFile = copyFile;
exports.getFileStats = getFileStats;
exports.cleanupOrphanedFiles = cleanupOrphanedFiles;
exports.backupFiles = backupFiles;
exports.restoreFiles = restoreFiles;
const crypto_1 = require("crypto");
const promises_1 = require("fs/promises");
const path_1 = require("path");
// 内存存储（生产环境应使用数据库）
const files = new Map();
const fileCategories = new Set(['avatar', 'banner', 'document', 'gallery', 'temp', 'backup']);
const allowedMimeTypes = new Set([
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'text/csv',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);
const maxFileSize = 10 * 1024 * 1024; // 10MB
const uploadPath = './uploads';
/**
 * 上传文件
 * @param file 文件对象
 * @param options 上传选项
 * @returns {Promise<FileUploadResult>} 上传结果
 */
async function uploadFile(file, options) {
    try {
        // 验证文件
        const validation = await validateFile(file, {
            allowedTypes: options.allowedTypes || Array.from(allowedMimeTypes),
            maxSize: options.maxSize || maxFileSize
        });
        if (!validation.valid) {
            return {
                success: false,
                error: validation.errors.join(', ')
            };
        }
        // 验证分类
        if (options.category && !fileCategories.has(options.category)) {
            return {
                success: false,
                error: `无效的文件分类: ${options.category}`
            };
        }
        // 生成文件ID
        const fileId = generateFileId();
        const fileExt = getFileExtension(file.name);
        const fileName = `${fileId}${fileExt}`;
        const category = options.category || 'temp';
        const userId = options.userId;
        // 确保上传目录存在
        const userDir = (0, path_1.join)(uploadPath, userId, category);
        await ensureDirectoryExists(userDir);
        // 读取文件数据
        const buffer = Buffer.from(await file.arrayBuffer());
        // 计算文件校验和
        const checksum = calculateChecksum(buffer);
        // 检查重复文件
        const existingFile = Array.from(files.values()).find(f => f.checksum === checksum && f.userId === userId);
        if (existingFile) {
            return {
                success: false,
                error: '文件已存在'
            };
        }
        // 保存文件
        const filePath = (0, path_1.join)(userDir, fileName);
        await (0, promises_1.writeFile)(filePath, buffer);
        // 获取图片尺寸（如果是图片）
        let width;
        let height;
        let format;
        if (file.type.startsWith('image/')) {
            const imageInfo = await getImageInfo(buffer);
            width = imageInfo.width;
            height = imageInfo.height;
            format = imageInfo.format;
        }
        // 生成文件URL
        const url = `/files/${userId}/${category}/${fileName}`;
        let thumbnailUrl;
        // 生成缩略图（如果需要）
        if (options.generateThumbnail && file.type.startsWith('image/')) {
            const thumbnailResult = await generateThumbnail(fileId, {
                width: 150,
                height: 150,
                quality: 80
            });
            if (thumbnailResult.success) {
                thumbnailUrl = thumbnailResult.thumbnailUrl;
            }
        }
        // 创建文件元数据
        const now = new Date();
        const metadata = {
            fileId,
            originalName: file.name,
            customName: options.customName,
            mimeType: file.type,
            size: buffer.length,
            url,
            thumbnailUrl,
            category,
            userId,
            isPublic: options.isPublic || false,
            description: options.description,
            tags: options.tags || [],
            width,
            height,
            format,
            checksum,
            createdAt: now,
            updatedAt: now,
            downloadCount: 0,
            data: buffer // 内存存储（生产环境应使用文件系统）
        };
        // 存储文件信息
        files.set(fileId, metadata);
        return {
            success: true,
            fileId,
            originalName: file.name,
            customName: options.customName,
            mimeType: file.type,
            size: buffer.length,
            url,
            thumbnailUrl,
            category,
            userId,
            isPublic: options.isPublic || false,
            description: options.description,
            tags: options.tags || [],
            width,
            height,
            format,
            createdAt: now
        };
    }
    catch (error) {
        console.error('文件上传失败:', error);
        return {
            success: false,
            error: error.message || '文件上传失败'
        };
    }
}
/**
 * 验证文件
 * @param file 文件对象
 * @param options 验证选项
 * @returns {Promise<FileValidationResult>} 验证结果
 */
async function validateFile(file, options) {
    const errors = [];
    const warnings = [];
    try {
        // 检查文件大小
        const maxSize = options?.maxSize || maxFileSize;
        if (file.size > maxSize) {
            errors.push(`文件大小超过限制 (${file.size} > ${maxSize} bytes)`);
        }
        // 检查文件类型
        const allowedTypes = new Set(options?.allowedTypes || Array.from(allowedMimeTypes));
        if (!allowedTypes.has(file.type)) {
            errors.push(`不支持的文件类型: ${file.type}`);
        }
        // 检查文件名
        if (!file.name || file.name.trim().length === 0) {
            errors.push('文件名不能为空');
        }
        // 检查文件扩展名
        const ext = getFileExtension(file.name).toLowerCase();
        const expectedExt = getExtensionFromMimeType(file.type);
        if (expectedExt && ext !== expectedExt) {
            warnings.push(`文件扩展名不匹配 (${ext} != ${expectedExt})`);
        }
        // 检查恶意文件内容
        const buffer = Buffer.from(await file.arrayBuffer());
        const content = buffer.toString('utf8', 0, Math.min(1024, buffer.length));
        if (containsMaliciousContent(content)) {
            errors.push('检测到潜在恶意内容');
        }
        // 检查文件损坏（仅对图片）
        if (file.type.startsWith('image/')) {
            const imageInfo = await getImageInfo(buffer);
            if (!imageInfo.width || !imageInfo.height) {
                errors.push('图片文件可能已损坏');
            }
        }
    }
    catch (error) {
        errors.push(`文件验证失败: ${error.message}`);
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}
/**
 * 删除文件
 * @param fileId 文件ID
 * @param userId 用户ID
 * @returns {Promise<FileDeleteResult>} 删除结果
 */
async function deleteFile(fileId, userId) {
    try {
        const file = files.get(fileId);
        if (!file) {
            return {
                success: false,
                error: '文件不存在'
            };
        }
        // 检查权限
        if (file.userId !== userId) {
            return {
                success: false,
                error: '权限不足'
            };
        }
        // 删除文件（内存中）
        files.delete(fileId);
        return {
            success: true,
            deletedAt: new Date()
        };
    }
    catch (error) {
        console.error('文件删除失败:', error);
        return {
            success: false,
            error: error.message || '文件删除失败'
        };
    }
}
/**
 * 获取文件元数据
 * @param fileId 文件ID
 * @returns {Promise<FileMetadata | null>} 文件元数据
 */
async function getFileMetadata(fileId) {
    try {
        const file = files.get(fileId);
        if (!file) {
            return null;
        }
        // 更新访问时间
        file.accessedAt = new Date();
        return {
            fileId: file.fileId,
            originalName: file.originalName,
            customName: file.customName,
            mimeType: file.mimeType,
            size: file.size,
            url: file.url,
            thumbnailUrl: file.thumbnailUrl,
            category: file.category,
            userId: file.userId,
            isPublic: file.isPublic,
            description: file.description,
            tags: file.tags,
            width: file.width,
            height: file.height,
            format: file.format,
            checksum: file.checksum,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
            accessedAt: file.accessedAt,
            downloadCount: file.downloadCount
        };
    }
    catch (error) {
        console.error('获取文件元数据失败:', error);
        return null;
    }
}
/**
 * 更新文件元数据
 * @param fileId 文件ID
 * @param updateData 更新数据
 * @param userId 用户ID
 * @returns {Promise<FileUpdateResult>} 更新结果
 */
async function updateFileMetadata(fileId, updateData, userId) {
    try {
        const file = files.get(fileId);
        if (!file) {
            return {
                success: false,
                error: '文件不存在'
            };
        }
        // 检查权限
        if (file.userId !== userId) {
            return {
                success: false,
                error: '权限不足'
            };
        }
        // 验证分类
        if (updateData.category && !fileCategories.has(updateData.category)) {
            return {
                success: false,
                error: `无效的文件分类: ${updateData.category}`
            };
        }
        // 更新元数据
        const updates = {
            ...updateData,
            updatedAt: new Date()
        };
        const updatedFile = { ...file, ...updates };
        files.set(fileId, updatedFile);
        return {
            success: true,
            updatedAt: new Date()
        };
    }
    catch (error) {
        console.error('更新文件元数据失败:', error);
        return {
            success: false,
            error: error.message || '更新文件元数据失败'
        };
    }
}
/**
 * 列出文件
 * @param options 列表选项
 * @returns {Promise<FileListResult>} 文件列表
 */
async function listFiles(options) {
    try {
        const { userId, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', mimeType, category, tags, dateFrom, dateTo, minSize, maxSize, isPublic } = options;
        // 过滤文件
        let filteredFiles = Array.from(files.values()).filter(file => {
            if (file.userId !== userId)
                return false;
            if (mimeType && !file.mimeType.includes(mimeType))
                return false;
            if (category && file.category !== category)
                return false;
            if (tags && !tags.some(tag => file.tags.includes(tag)))
                return false;
            if (dateFrom && file.createdAt < dateFrom)
                return false;
            if (dateTo && file.createdAt > dateTo)
                return false;
            if (minSize && file.size < minSize)
                return false;
            if (maxSize && file.size > maxSize)
                return false;
            if (isPublic !== undefined && file.isPublic !== isPublic)
                return false;
            return true;
        });
        // 排序
        filteredFiles.sort((a, b) => {
            const aValue = a[sortBy];
            const bValue = b[sortBy];
            if (aValue === undefined || bValue === undefined)
                return 0;
            let comparison = 0;
            if (aValue < bValue)
                comparison = -1;
            if (aValue > bValue)
                comparison = 1;
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        // 分页
        const total = filteredFiles.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedFiles = filteredFiles.slice(startIndex, endIndex);
        return {
            success: true,
            files: paginatedFiles.map(file => ({
                fileId: file.fileId,
                originalName: file.originalName,
                customName: file.customName,
                mimeType: file.mimeType,
                size: file.size,
                url: file.url,
                thumbnailUrl: file.thumbnailUrl,
                category: file.category,
                userId: file.userId,
                isPublic: file.isPublic,
                description: file.description,
                tags: file.tags,
                width: file.width,
                height: file.height,
                format: file.format,
                checksum: file.checksum,
                createdAt: file.createdAt,
                updatedAt: file.updatedAt,
                accessedAt: file.accessedAt,
                downloadCount: file.downloadCount
            })),
            total,
            page,
            limit,
            totalPages
        };
    }
    catch (error) {
        console.error('列出文件失败:', error);
        return {
            success: false,
            files: [],
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 0,
            error: error.message || '列出文件失败'
        };
    }
}
/**
 * 搜索文件
 * @param options 搜索选项
 * @returns {Promise<FileSearchResult>} 搜索结果
 */
async function searchFiles(options) {
    try {
        const { userId, query, searchBy, mimeType, category, tags, dateFrom, dateTo, minSize, maxSize, page = 1, limit = 20 } = options;
        // 搜索文件
        let matchedFiles = Array.from(files.values()).filter(file => {
            // 用户过滤
            if (userId && file.userId !== userId)
                return false;
            // 搜索条件匹配
            let matches = false;
            const lowerQuery = query.toLowerCase();
            if (searchBy.includes('originalName') && file.originalName.toLowerCase().includes(lowerQuery)) {
                matches = true;
            }
            if (searchBy.includes('customName') && file.customName?.toLowerCase().includes(lowerQuery)) {
                matches = true;
            }
            if (searchBy.includes('description') && file.description?.toLowerCase().includes(lowerQuery)) {
                matches = true;
            }
            if (searchBy.includes('tags') && file.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
                matches = true;
            }
            if (!matches)
                return false;
            // 其他过滤条件
            if (mimeType && !file.mimeType.includes(mimeType))
                return false;
            if (category && file.category !== category)
                return false;
            if (tags && !tags.some(tag => file.tags.includes(tag)))
                return false;
            if (dateFrom && file.createdAt < dateFrom)
                return false;
            if (dateTo && file.createdAt > dateTo)
                return false;
            if (minSize && file.size < minSize)
                return false;
            if (maxSize && file.size > maxSize)
                return false;
            return true;
        });
        // 按相关性排序
        matchedFiles.sort((a, b) => {
            let aScore = 0;
            let bScore = 0;
            if (a.originalName.toLowerCase().includes(query.toLowerCase()))
                aScore += 3;
            if (b.originalName.toLowerCase().includes(query.toLowerCase()))
                bScore += 3;
            if (a.customName?.toLowerCase().includes(query.toLowerCase()))
                aScore += 2;
            if (b.customName?.toLowerCase().includes(query.toLowerCase()))
                bScore += 2;
            if (a.description?.toLowerCase().includes(query.toLowerCase()))
                aScore += 1;
            if (b.description?.toLowerCase().includes(query.toLowerCase()))
                bScore += 1;
            return bScore - aScore;
        });
        // 分页
        const total = matchedFiles.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedFiles = matchedFiles.slice(startIndex, endIndex);
        return {
            success: true,
            files: paginatedFiles,
            total,
            page,
            limit,
            totalPages,
            query
        };
    }
    catch (error) {
        console.error('搜索文件失败:', error);
        return {
            success: false,
            files: [],
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 0,
            query: options.query,
            error: error.message || '搜索文件失败'
        };
    }
}
/**
 * 获取文件URL
 * @param fileId 文件ID
 * @param options URL选项
 * @returns {Promise<string>} 文件URL
 */
async function getFileUrl(fileId, options) {
    try {
        const file = files.get(fileId);
        if (!file) {
            throw new Error('文件不存在');
        }
        // 更新下载次数
        file.downloadCount++;
        // 生成URL
        let url = file.url;
        // 添加签名（如果是私有文件或设置了过期时间）
        if (!file.isPublic || options?.expiresIn) {
            const signature = generateFileSignature(fileId, options);
            const separator = url.includes('?') ? '&' : '?';
            url += `${separator}signature=${signature}`;
            if (options?.expiresIn) {
                const expires = Math.floor(Date.now() / 1000) + options.expiresIn;
                url += `&expires=${expires}`;
            }
        }
        // 添加下载参数
        if (options?.download) {
            const separator = url.includes('?') ? '&' : '?';
            url += `${separator}download=1`;
        }
        return url;
    }
    catch (error) {
        console.error('获取文件URL失败:', error);
        throw new Error(error.message || '获取文件URL失败');
    }
}
/**
 * 处理图片文件
 * @param fileId 文件ID
 * @param options 处理选项
 * @returns {Promise<FileProcessingResult>} 处理结果
 */
async function processImageFile(fileId, options) {
    try {
        const file = files.get(fileId);
        if (!file) {
            return {
                success: false,
                error: '文件不存在'
            };
        }
        if (!file.mimeType.startsWith('image/')) {
            return {
                success: false,
                error: '不支持的文件类型'
            };
        }
        const startTime = Date.now();
        // 模拟图片处理
        const processedData = await simulateImageProcessing(file.data, options);
        // 生成处理后的文件ID
        const processedFileId = generateFileId();
        const processedExt = options.format || getFileExtension(file.originalName);
        const processedFileName = `${processedFileId}.${processedExt}`;
        // 保存处理后的文件
        const userDir = (0, path_1.join)(uploadPath, file.userId, 'processed');
        await ensureDirectoryExists(userDir);
        const processedPath = (0, path_1.join)(userDir, processedFileName);
        await (0, promises_1.writeFile)(processedPath, processedData);
        // 创建处理后的文件元数据
        const processedMetadata = {
            ...file,
            fileId: processedFileId,
            originalName: `processed_${file.originalName}`,
            size: processedData.length,
            url: `/files/${file.userId}/processed/${processedFileName}`,
            format: options.format?.toUpperCase(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        files.set(processedFileId, processedMetadata);
        const processingTime = Date.now() - startTime;
        return {
            success: true,
            processedFileId,
            url: processedMetadata.url,
            width: options.width || file.width,
            height: options.height || file.height,
            size: processedData.length,
            format: options.format || file.format?.toLowerCase(),
            quality: options.quality,
            compressionRatio: file.size / processedData.length,
            processingTime
        };
    }
    catch (error) {
        console.error('图片处理失败:', error);
        return {
            success: false,
            error: error.message || '图片处理失败'
        };
    }
}
/**
 * 生成缩略图
 * @param fileId 文件ID
 * @param options 缩略图选项
 * @returns {Promise<ThumbnailResult>} 缩略图结果
 */
async function generateThumbnail(fileId, options) {
    try {
        const file = files.get(fileId);
        if (!file) {
            return {
                success: false,
                error: '文件不存在'
            };
        }
        if (!file.mimeType.startsWith('image/')) {
            return {
                success: false,
                error: '不支持的文件类型'
            };
        }
        // 模拟缩略图生成
        const thumbnailData = await simulateThumbnailGeneration(file.data, options);
        // 生成缩略图文件ID
        const thumbnailId = generateFileId();
        const thumbnailFileName = `${thumbnailId}_thumb.${options.format || 'jpg'}`;
        // 保存缩略图
        const userDir = (0, path_1.join)(uploadPath, file.userId, 'thumbnails');
        await ensureDirectoryExists(userDir);
        const thumbnailPath = (0, path_1.join)(userDir, thumbnailFileName);
        await (0, promises_1.writeFile)(thumbnailPath, thumbnailData);
        // 创建缩略图URL
        const thumbnailUrl = `/files/${file.userId}/thumbnails/${thumbnailFileName}`;
        // 更新原文件的缩略图URL
        file.thumbnailUrl = thumbnailUrl;
        files.set(fileId, file);
        return {
            success: true,
            thumbnailId,
            thumbnailUrl,
            width: options.width,
            height: options.height,
            size: thumbnailData.length
        };
    }
    catch (error) {
        console.error('生成缩略图失败:', error);
        return {
            success: false,
            error: error.message || '生成缩略图失败'
        };
    }
}
/**
 * 压缩文件
 * @param fileId 文件ID
 * @param options 压缩选项
 * @returns {Promise<CompressionResult>} 压缩结果
 */
async function compressFile(fileId, options) {
    try {
        const file = files.get(fileId);
        if (!file) {
            return {
                success: false,
                error: '文件不存在'
            };
        }
        const originalSize = file.size;
        // 模拟文件压缩
        const compressedData = await simulateFileCompression(file.data, options);
        // 生成压缩后的文件ID
        const compressedFileId = generateFileId();
        const compressedFileName = `${compressedFileId}_compressed.${getFileExtension(file.originalName)}`;
        // 保存压缩后的文件
        const userDir = (0, path_1.join)(uploadPath, file.userId, 'compressed');
        await ensureDirectoryExists(userDir);
        const compressedPath = (0, path_1.join)(userDir, compressedFileName);
        await (0, promises_1.writeFile)(compressedPath, compressedData);
        // 创建压缩后的文件元数据
        const compressedMetadata = {
            ...file,
            fileId: compressedFileId,
            originalName: `compressed_${file.originalName}`,
            size: compressedData.length,
            url: `/files/${file.userId}/compressed/${compressedFileName}`,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        files.set(compressedFileId, compressedMetadata);
        const compressedSize = compressedData.length;
        const compressionRatio = originalSize / compressedSize;
        const spaceSaved = originalSize - compressedSize;
        return {
            success: true,
            compressedFileId,
            url: compressedMetadata.url,
            originalSize,
            compressedSize,
            compressionRatio,
            spaceSaved
        };
    }
    catch (error) {
        console.error('文件压缩失败:', error);
        return {
            success: false,
            error: error.message || '文件压缩失败'
        };
    }
}
/**
 * 移动文件
 * @param fileId 文件ID
 * @param options 移动选项
 * @returns {Promise<FileMoveResult>} 移动结果
 */
async function moveFile(fileId, options) {
    try {
        const file = files.get(fileId);
        if (!file) {
            return {
                success: false,
                error: '文件不存在'
            };
        }
        // 检查权限
        if (file.userId !== options.userId) {
            return {
                success: false,
                error: '权限不足'
            };
        }
        // 验证新分类
        if (options.newCategory && !fileCategories.has(options.newCategory)) {
            return {
                success: false,
                error: `无效的目标分类: ${options.newCategory}`
            };
        }
        const oldPath = file.url;
        const oldCategory = file.category;
        // 更新文件信息
        const updates = {
            updatedAt: new Date()
        };
        if (options.newCategory) {
            updates.category = options.newCategory;
            updates.url = file.url.replace(`/${oldCategory}/`, `/${options.newCategory}/`);
        }
        if (options.newCustomName) {
            updates.customName = options.newCustomName;
        }
        if (options.newUserId) {
            updates.userId = options.newUserId;
        }
        const updatedFile = { ...file, ...updates };
        files.set(fileId, updatedFile);
        return {
            success: true,
            newPath: updatedFile.url,
            oldPath,
            movedAt: new Date()
        };
    }
    catch (error) {
        console.error('文件移动失败:', error);
        return {
            success: false,
            error: error.message || '文件移动失败'
        };
    }
}
/**
 * 复制文件
 * @param fileId 文件ID
 * @param options 复制选项
 * @returns {Promise<FileCopyResult>} 复制结果
 */
async function copyFile(fileId, options) {
    try {
        const file = files.get(fileId);
        if (!file) {
            return {
                success: false,
                error: '文件不存在'
            };
        }
        // 检查权限
        if (file.userId !== options.userId) {
            return {
                success: false,
                error: '权限不足'
            };
        }
        // 验证新分类
        if (options.newCategory && !fileCategories.has(options.newCategory)) {
            return {
                success: false,
                error: `无效的目标分类: ${options.newCategory}`
            };
        }
        // 生成新文件ID
        const newFileId = generateFileId();
        const fileExt = getFileExtension(file.originalName);
        const newFileName = `${newFileId}${fileExt}`;
        const newCategory = options.newCategory || file.category;
        const newUserId = options.newUserId || file.userId;
        // 保存复制的文件
        const userDir = (0, path_1.join)(uploadPath, newUserId, newCategory);
        await ensureDirectoryExists(userDir);
        const newFilePath = (0, path_1.join)(userDir, newFileName);
        if (file.data) {
            await (0, promises_1.writeFile)(newFilePath, file.data);
        }
        // 创建复制的文件元数据
        const copiedMetadata = {
            ...file,
            fileId: newFileId,
            originalName: `copy_of_${file.originalName}`,
            customName: options.newCustomName || file.customName,
            url: `/files/${newUserId}/${newCategory}/${newFileName}`,
            category: newCategory,
            userId: newUserId,
            createdAt: new Date(),
            updatedAt: new Date(),
            downloadCount: 0,
            // 如果不需要保留元数据，则清空描述和标签
            ...(options.preserveMetadata ? {} : {
                description: undefined,
                tags: []
            })
        };
        files.set(newFileId, copiedMetadata);
        return {
            success: true,
            newFileId,
            originalFileId: fileId,
            copiedAt: new Date()
        };
    }
    catch (error) {
        console.error('文件复制失败:', error);
        return {
            success: false,
            error: error.message || '文件复制失败'
        };
    }
}
/**
 * 获取文件统计信息
 * @param userId 用户ID（可选，系统级统计时为空）
 * @returns {Promise<FileStats>} 统计信息
 */
async function getFileStats(userId) {
    try {
        // 过滤文件
        const userFiles = userId
            ? Array.from(files.values()).filter(file => file.userId === userId)
            : Array.from(files.values());
        const totalFiles = userFiles.length;
        const totalSize = userFiles.reduce((sum, file) => sum + file.size, 0);
        const averageFileSize = totalFiles > 0 ? totalSize / totalFiles : 0;
        // 统计文件类型
        const fileTypes = {};
        userFiles.forEach(file => {
            fileTypes[file.mimeType] = (fileTypes[file.mimeType] || 0) + 1;
        });
        // 统计分类
        const categoryStats = {};
        userFiles.forEach(file => {
            if (!categoryStats[file.category]) {
                categoryStats[file.category] = { count: 0, size: 0 };
            }
            categoryStats[file.category].count++;
            categoryStats[file.category].size += file.size;
        });
        // 统计上传日期
        const uploadDates = {};
        userFiles.forEach(file => {
            const date = file.createdAt.toISOString().split('T')[0];
            uploadDates[date] = (uploadDates[date] || 0) + 1;
        });
        // 用户统计（仅系统级统计）
        let userStats;
        if (!userId) {
            userStats = {};
            Array.from(files.values()).forEach(file => {
                if (!userStats[file.userId]) {
                    userStats[file.userId] = { files: 0, size: 0 };
                }
                userStats[file.userId].files++;
                userStats[file.userId].size += file.size;
            });
        }
        return {
            totalFiles,
            totalSize,
            averageFileSize,
            fileTypes,
            categoryStats,
            uploadDates,
            userStats
        };
    }
    catch (error) {
        console.error('获取文件统计失败:', error);
        return {
            totalFiles: 0,
            totalSize: 0,
            averageFileSize: 0,
            fileTypes: {},
            categoryStats: {},
            uploadDates: {}
        };
    }
}
/**
 * 清理孤立文件
 * @param options 清理选项
 * @returns {Promise<CleanupResult>} 清理结果
 */
async function cleanupOrphanedFiles(options = {}) {
    try {
        const { dryRun = false, olderThan, includePublic = false, userId } = options;
        // 查找孤立文件
        let orphanedFiles = Array.from(files.entries()).filter(([id, file]) => {
            // 检查文件年龄
            if (olderThan && file.createdAt >= olderThan)
                return false;
            // 检查公共文件
            if (!includePublic && file.isPublic)
                return false;
            // 检查用户
            if (userId && file.userId !== userId)
                return false;
            // 检查是否有对应的实际文件（这里简化处理）
            return true;
        });
        const cleanedFiles = orphanedFiles.map(([id]) => id);
        const freedSpace = orphanedFiles.reduce((sum, [, file]) => sum + file.size, 0);
        if (dryRun) {
            return {
                success: true,
                preview: true,
                wouldCleanFiles: cleanedFiles,
                freedSpace
            };
        }
        // 实际清理
        orphanedFiles.forEach(([id]) => {
            files.delete(id);
        });
        return {
            success: true,
            cleanedFiles,
            freedSpace,
            cleanedAt: new Date()
        };
    }
    catch (error) {
        console.error('清理孤立文件失败:', error);
        return {
            success: false,
            error: error.message || '清理孤立文件失败'
        };
    }
}
/**
 * 备份文件
 * @param options 备份选项
 * @returns {Promise<BackupResult>} 备份结果
 */
async function backupFiles(options = {}) {
    try {
        const { fileIds, backupType = 'full', destination = 'local', compression = true, encryption = false, since, userId } = options;
        let filesToBackup = Array.from(files.values());
        // 用户过滤
        if (userId) {
            filesToBackup = filesToBackup.filter(file => file.userId === userId);
        }
        // 指定文件ID
        if (fileIds && fileIds.length > 0) {
            filesToBackup = filesToBackup.filter(file => fileIds.includes(file.fileId));
        }
        // 增量备份
        if (backupType === 'incremental' && since) {
            filesToBackup = filesToBackup.filter(file => file.updatedAt >= since);
        }
        // 生成备份ID
        const backupId = generateBackupId();
        // 计算备份大小
        const backupSize = filesToBackup.reduce((sum, file) => sum + file.size, 0);
        // 模拟备份过程
        const estimatedDuration = Math.ceil(backupSize / (1024 * 1024)); // 估算每MB需要1秒
        return {
            success: true,
            backupId,
            fileCount: filesToBackup.length,
            backupSize: compression ? Math.floor(backupSize * 0.7) : backupSize,
            backupType,
            destination,
            createdAt: new Date(),
            estimatedDuration
        };
    }
    catch (error) {
        console.error('文件备份失败:', error);
        return {
            success: false,
            error: error.message || '文件备份失败'
        };
    }
}
/**
 * 恢复文件
 * @param options 恢复选项
 * @returns {Promise<RestoreResult>} 恢复结果
 */
async function restoreFiles(options) {
    try {
        const { backupId, fileIds, restoreTo = 'original-location', newLocation, overwrite = false, preserveOriginal = true, userId } = options;
        // 模拟从备份恢复
        // 这里应该从实际的备份存储中读取数据
        const restoredFiles = [];
        const skippedFiles = [];
        const overwrittenFiles = [];
        const errorFiles = [];
        if (fileIds) {
            for (const fileId of fileIds) {
                try {
                    const existingFile = files.get(fileId);
                    if (existingFile && !overwrite) {
                        skippedFiles.push(fileId);
                        continue;
                    }
                    if (existingFile && overwrite) {
                        overwrittenFiles.push(fileId);
                    }
                    // 模拟恢复文件
                    // 这里应该从备份中恢复实际数据
                    restoredFiles.push(fileId);
                }
                catch (error) {
                    errorFiles.push(fileId);
                }
            }
        }
        const totalSize = restoredFiles.reduce((sum, fileId) => {
            const file = files.get(fileId);
            return sum + (file?.size || 0);
        }, 0);
        return {
            success: true,
            restoredFiles,
            skippedFiles,
            overwrittenFiles,
            errorFiles,
            restoredAt: new Date(),
            totalSize
        };
    }
    catch (error) {
        console.error('文件恢复失败:', error);
        return {
            success: false,
            error: error.message || '文件恢复失败'
        };
    }
}
// 辅助函数
/**
 * 生成文件ID
 * @returns {string} 文件ID
 */
function generateFileId() {
    return 'file_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}
/**
 * 生成备份ID
 * @returns {string} 备份ID
 */
function generateBackupId() {
    return 'backup_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}
/**
 * 获取文件扩展名
 * @param filename 文件名
 * @returns {string} 扩展名
 */
function getFileExtension(filename) {
    return filename.slice(filename.lastIndexOf('.'));
}
/**
 * 从MIME类型获取扩展名
 * @param mimeType MIME类型
 * @returns {string} 扩展名
 */
function getExtensionFromMimeType(mimeType) {
    const mimeToExt = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'application/pdf': '.pdf',
        'text/plain': '.txt',
        'text/csv': '.csv'
    };
    return mimeToExt[mimeType] || null;
}
/**
 * 计算文件校验和
 * @param data 文件数据
 * @returns {string} 校验和
 */
function calculateChecksum(data) {
    return (0, crypto_1.createHash)('sha256').update(data).digest('hex');
}
/**
 * 检查是否包含恶意内容
 * @param content 文件内容
 * @returns {boolean} 是否包含恶意内容
 */
function containsMaliciousContent(content) {
    const maliciousPatterns = [
        /<script/i,
        /javascript:/i,
        /vbscript:/i,
        /onload=/i,
        /onerror=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i
    ];
    return maliciousPatterns.some(pattern => pattern.test(content));
}
/**
 * 获取图片信息
 * @param data 图片数据
 * @returns {Promise<{width: number, height: number, format: string}>} 图片信息
 */
async function getImageInfo(data) {
    // 模拟图片信息获取
    // 实际实现中应该解析图片头部获取真实信息
    return {
        width: 800,
        height: 600,
        format: 'JPEG'
    };
}
/**
 * 模拟图片处理
 * @param data 原始图片数据
 * @param options 处理选项
 * @returns {Promise<Buffer>} 处理后的图片数据
 */
async function simulateImageProcessing(data, options) {
    // 模拟图片处理
    // 实际实现中应该使用图像处理库如 sharp
    let processedData = data;
    if (options.quality && options.quality < 100) {
        // 模拟压缩
        const compressionRatio = options.quality / 100;
        const newSize = Math.floor(data.length * compressionRatio);
        processedData = data.slice(0, newSize);
    }
    return processedData;
}
/**
 * 模拟缩略图生成
 * @param data 原始图片数据
 * @param options 缩略图选项
 * @returns {Promise<Buffer>} 缩略图数据
 */
async function simulateThumbnailGeneration(data, options) {
    // 模拟缩略图生成
    // 实际实现中应该使用图像处理库
    const thumbnailSize = Math.floor(data.length * 0.1); // 缩略图约为原大小的10%
    return data.slice(0, thumbnailSize);
}
/**
 * 模拟文件压缩
 * @param data 原始文件数据
 * @param options 压缩选项
 * @returns {Promise<Buffer>} 压缩后的文件数据
 */
async function simulateFileCompression(data, options) {
    // 模拟文件压缩
    // 实际实现中应该使用相应的压缩算法
    const compressionRatio = options.quality ? options.quality / 100 : 0.8;
    const compressedSize = Math.floor(data.length * compressionRatio);
    return data.slice(0, compressedSize);
}
/**
 * 生成文件签名
 * @param fileId 文件ID
 * @param options 签名选项
 * @returns {string} 签名
 */
function generateFileSignature(fileId, options) {
    const timestamp = Math.floor(Date.now() / 1000);
    const secret = process.env.FILE_SIGNATURE_SECRET || 'default-secret';
    const data = `${fileId}:${timestamp}:${secret}`;
    return (0, crypto_1.createHash)('sha256').update(data).digest('hex').substring(0, 16);
}
/**
 * 确保目录存在
 * @param dirPath 目录路径
 */
async function ensureDirectoryExists(dirPath) {
    try {
        await (0, promises_1.mkdir)(dirPath, { recursive: true });
    }
    catch (error) {
        // 目录已存在，忽略错误
    }
}
// 导出内存存储实例（用于测试和调试）
exports.fileMemoryStore = {
    files,
    fileCategories,
    allowedMimeTypes,
    maxFileSize
};
