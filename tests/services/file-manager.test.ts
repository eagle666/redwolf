// 文件上传和管理系统测试
// 模块8: TDD开发 - 文件上传和管理系统

import {
  uploadFile,
  deleteFile,
  getFileMetadata,
  updateFileMetadata,
  listFiles,
  searchFiles,
  getFileUrl,
  validateFile,
  processImageFile,
  generateThumbnail,
  compressFile,
  moveFile,
  copyFile,
  getFileStats,
  cleanupOrphanedFiles,
  backupFiles,
  restoreFiles,
  FileUploadResult,
  FileMetadata,
  FileSearchOptions,
  FileStats,
  FileProcessingOptions
} from '../../src/lib/services/file-manager'

describe('文件上传和管理系统', () => {
  beforeEach(() => {
    // 清理测试环境
    jest.clearAllMocks()
  })

  describe('uploadFile - 文件上传', () => {
    it('应该成功上传图片文件', async () => {
      const fileData = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const options = {
        userId: 'user-123',
        category: 'avatar',
        isPublic: false
      }

      const result = await uploadFile(fileData, options)

      expect(result.success).toBe(true)
      expect(result.fileId).toBeDefined()
      expect(result.originalName).toBe('test.jpg')
      expect(result.mimeType).toBe('image/jpeg')
      expect(result.size).toBe(4)
      expect(result.category).toBe('avatar')
      expect(result.userId).toBe('user-123')
      expect(result.isPublic).toBe(false)
      expect(result.url).toBeDefined()
      expect(result.thumbnailUrl).toBeDefined()
    })

    it('应该拒绝无效的文件类型', async () => {
      const fileData = new File(['test'], 'test.exe', { type: 'application/x-executable' })
      const options = { userId: 'user-123' }

      const result = await uploadFile(fileData, options)

      expect(result.success).toBe(false)
      expect(result.error).toContain('不支持的文件类型')
    })

    it('应该拒绝超过大小限制的文件', async () => {
      const largeData = new Array(11 * 1024 * 1024).fill('a').join('') // 11MB
      const fileData = new File([largeData], 'large.jpg', { type: 'image/jpeg' })
      const options = { userId: 'user-123' }

      const result = await uploadFile(fileData, options)

      expect(result.success).toBe(false)
      expect(result.error).toContain('文件大小超过限制')
    })

    it('应该支持自定义文件名', async () => {
      const fileData = new File(['test'], 'original.jpg', { type: 'image/jpeg' })
      const options = {
        userId: 'user-123',
        customName: 'custom-avatar'
      }

      const result = await uploadFile(fileData, options)

      expect(result.success).toBe(true)
      expect(result.customName).toBe('custom-avatar')
    })

    it('应该自动生成缩略图', async () => {
      const fileData = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const options = {
        userId: 'user-123',
        generateThumbnail: true
      }

      const result = await uploadFile(fileData, options)

      expect(result.success).toBe(true)
      expect(result.thumbnailUrl).toBeDefined()
      expect(result.thumbnailUrl).toContain('_thumb.')
    })

    it('应该支持批量上传', async () => {
      const files = [
        new File(['test1'], 'file1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'file2.jpg', { type: 'image/jpeg' })
      ]
      const options = { userId: 'user-123' }

      const results = await Promise.all(files.map(file => uploadFile(file, options)))

      results.forEach(result => {
        expect(result.success).toBe(true)
        expect(result.fileId).toBeDefined()
      })
    })
  })

  describe('validateFile - 文件验证', () => {
    it('应该验证有效的图片文件', async () => {
      const fileData = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

      const result = await validateFile(fileData)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('应该拒绝不支持的文件类型', async () => {
      const fileData = new File(['test'], 'test.exe', { type: 'application/x-executable' })

      const result = await validateFile(fileData)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('不支持的文件类型: application/x-executable')
    })

    it('应该拒绝过大的文件', async () => {
      const largeData = new Array(11 * 1024 * 1024).fill('a').join('')
      const fileData = new File([largeData], 'large.jpg', { type: 'image/jpeg' })

      const result = await validateFile(fileData)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('文件大小'))).toBe(true)
    })

    it('应该检测恶意文件内容', async () => {
      const maliciousData = '<script>alert("xss")</script>'
      const fileData = new File([maliciousData], 'malicious.html', { type: 'text/html' })

      const result = await validateFile(fileData)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('潜在恶意内容'))).toBe(true)
    })

    it('应该验证文件扩展名和MIME类型一致性', async () => {
      const fileData = new File(['test'], 'fake.jpg', { type: 'application/pdf' })

      const result = await validateFile(fileData)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.contains('文件类型不匹配'))).toBe(true)
    })
  })

  describe('deleteFile - 文件删除', () => {
    it('应该成功删除存在的文件', async () => {
      // 先上传文件
      const fileData = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const uploadResult = await uploadFile(fileData, { userId: 'user-123' })

      // 删除文件
      const deleteResult = await deleteFile(uploadResult.fileId, 'user-123')

      expect(deleteResult.success).toBe(true)
      expect(deleteResult.deletedAt).toBeDefined()
    })

    it('应该拒绝删除不存在的文件', async () => {
      const result = await deleteFile('nonexistent-file-id', 'user-123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('文件不存在')
    })

    it('应该拒绝删除其他用户的文件', async () => {
      // 上传文件
      const fileData = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const uploadResult = await uploadFile(fileData, { userId: 'user-123' })

      // 尝试用其他用户ID删除
      const result = await deleteFile(uploadResult.fileId, 'user-456')

      expect(result.success).toBe(false)
      expect(result.error).toContain('权限不足')
    })

    it('应该支持批量删除', async () => {
      // 上传多个文件
      const files = [
        new File(['test1'], 'file1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'file2.jpg', { type: 'image/jpeg' })
      ]
      const uploadResults = await Promise.all(
        files.map(file => uploadFile(file, { userId: 'user-123' }))
      )

      // 批量删除
      const fileIds = uploadResults.map(r => r.fileId)
      const deleteResults = await Promise.all(
        fileIds.map(id => deleteFile(id, 'user-123'))
      )

      deleteResults.forEach(result => {
        expect(result.success).toBe(true)
      })
    })
  })

  describe('getFileMetadata - 获取文件元数据', () => {
    it('应该返回文件的完整元数据', async () => {
      const fileData = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const uploadResult = await uploadFile(fileData, {
        userId: 'user-123',
        category: 'avatar',
        tags: ['profile', 'user']
      })

      const metadata = await getFileMetadata(uploadResult.fileId)

      expect(metadata.fileId).toBe(uploadResult.fileId)
      expect(metadata.originalName).toBe('test.jpg')
      expect(metadata.mimeType).toBe('image/jpeg')
      expect(metadata.size).toBe(4)
      expect(metadata.category).toBe('avatar')
      expect(metadata.userId).toBe('user-123')
      expect(metadata.tags).toContain('profile')
      expect(metadata.tags).toContain('user')
      expect(metadata.createdAt).toBeDefined()
    })

    it('应该返回null对于不存在的文件', async () => {
      const metadata = await getFileMetadata('nonexistent-file-id')
      expect(metadata).toBeNull()
    })

    it('应该包含图片的额外信息', async () => {
      const imageData = 'fake-image-data'
      const fileData = new File([imageData], 'test.jpg', { type: 'image/jpeg' })
      const uploadResult = await uploadFile(fileData, { userId: 'user-123' })

      const metadata = await getFileMetadata(uploadResult.fileId)

      expect(metadata.width).toBeDefined()
      expect(metadata.height).toBeDefined()
      expect(metadata.format).toBe('JPEG')
    })
  })

  describe('updateFileMetadata - 更新文件元数据', () => {
    it('应该成功更新文件元数据', async () => {
      const fileData = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const uploadResult = await uploadFile(fileData, { userId: 'user-123' })

      const updateData = {
        customName: 'new-name',
        description: 'Updated description',
        tags: ['new-tag'],
        isPublic: true,
        category: 'gallery'
      }

      const result = await updateFileMetadata(uploadResult.fileId, updateData, 'user-123')

      expect(result.success).toBe(true)
      expect(result.updatedAt).toBeDefined()

      // 验证更新后的元数据
      const metadata = await getFileMetadata(uploadResult.fileId)
      expect(metadata.customName).toBe('new-name')
      expect(metadata.description).toBe('Updated description')
      expect(metadata.tags).toContain('new-tag')
      expect(metadata.isPublic).toBe(true)
      expect(metadata.category).toBe('gallery')
    })

    it('应该拒绝更新其他用户的文件', async () => {
      const fileData = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const uploadResult = await uploadFile(fileData, { userId: 'user-123' })

      const result = await updateFileMetadata(
        uploadResult.fileId,
        { customName: 'hacked' },
        'user-456'
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('权限不足')
    })
  })

  describe('listFiles - 文件列表', () => {
    it('应该返回用户的所有文件', async () => {
      const files = [
        new File(['test1'], 'file1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'file2.png', { type: 'image/png' }),
        new File(['test3'], 'file3.pdf', { type: 'application/pdf' })
      ]

      // 上传文件
      await Promise.all(
        files.map(file => uploadFile(file, { userId: 'user-123' }))
      )

      const options = {
        userId: 'user-123',
        page: 1,
        limit: 10
      }

      const result = await listFiles(options)

      expect(result.success).toBe(true)
      expect(result.files).toHaveLength(3)
      expect(result.total).toBe(3)
      expect(result.page).toBe(1)
      expect(result.totalPages).toBe(1)
    })

    it('应该支持按类型过滤', async () => {
      const files = [
        new File(['test1'], 'file1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'file2.pdf', { type: 'application/pdf' })
      ]

      await Promise.all(
        files.map(file => uploadFile(file, { userId: 'user-123' }))
      )

      const options = {
        userId: 'user-123',
        mimeType: 'image/jpeg'
      }

      const result = await listFiles(options)

      expect(result.files).toHaveLength(1)
      expect(result.files[0].mimeType).toBe('image/jpeg')
    })

    it('应该支持分页', async () => {
      const files = Array.from({ length: 15 }, (_, i) =>
        new File([`test${i}`], `file${i}.jpg`, { type: 'image/jpeg' })
      )

      await Promise.all(
        files.map(file => uploadFile(file, { userId: 'user-123' }))
      )

      const page1 = await listFiles({ userId: 'user-123', page: 1, limit: 10 })
      const page2 = await listFiles({ userId: 'user-123', page: 2, limit: 10 })

      expect(page1.files).toHaveLength(10)
      expect(page2.files).toHaveLength(5)
      expect(page1.total).toBe(15)
      expect(page2.total).toBe(15)
    })

    it('应该支持排序', async () => {
      const files = [
        new File(['test1'], 'a.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'b.jpg', { type: 'image/jpeg' }),
        new File(['test3'], 'c.jpg', { type: 'image/jpeg' })
      ]

      await Promise.all(
        files.map(file => uploadFile(file, { userId: 'user-123' }))
      )

      const result = await listFiles({
        userId: 'user-123',
        sortBy: 'originalName',
        sortOrder: 'asc'
      })

      expect(result.files[0].originalName).toBe('a.jpg')
      expect(result.files[1].originalName).toBe('b.jpg')
      expect(result.files[2].originalName).toBe('c.jpg')
    })
  })

  describe('searchFiles - 文件搜索', () => {
    it('应该按文件名搜索', async () => {
      const files = [
        new File(['test1'], 'avatar.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'banner.png', { type: 'image/png' }),
        new File(['test3'], 'avatar-old.jpg', { type: 'image/jpeg' })
      ]

      await Promise.all(
        files.map(file => uploadFile(file, { userId: 'user-123' }))
      )

      const options: FileSearchOptions = {
        userId: 'user-123',
        query: 'avatar',
        searchBy: ['originalName', 'customName', 'description', 'tags']
      }

      const result = await searchFiles(options)

      expect(result.files).toHaveLength(2)
      expect(result.files.every(f => f.originalName.includes('avatar'))).toBe(true)
    })

    it('应该按标签搜索', async () => {
      const file1 = new File(['test1'], 'file1.jpg', { type: 'image/jpeg' })
      const file2 = new File(['test2'], 'file2.jpg', { type: 'image/jpeg' })

      await uploadFile(file1, { userId: 'user-123', tags: ['profile', 'user'] })
      await uploadFile(file2, { userId: 'user-123', tags: ['banner', 'site'] })

      const options: FileSearchOptions = {
        userId: 'user-123',
        query: 'profile',
        searchBy: ['tags']
      }

      const result = await searchFiles(options)

      expect(result.files).toHaveLength(1)
      expect(result.files[0].tags).toContain('profile')
    })

    it('应该支持高级搜索条件', async () => {
      const files = [
        new File(['test1'], 'file1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'file2.png', { type: 'image/png' }),
        new File(['test3'], 'file3.pdf', { type: 'application/pdf' })
      ]

      await Promise.all(
        files.map(file => uploadFile(file, { userId: 'user-123' }))
      )

      const options: FileSearchOptions = {
        userId: 'user-123',
        query: 'file',
        mimeType: 'image/*',
        dateFrom: new Date(Date.now() - 24 * 60 * 60 * 1000), // 最近24小时
        dateTo: new Date(),
        minSize: 1,
        maxSize: 10
      }

      const result = await searchFiles(options)

      expect(result.files).toHaveLength(2) // 只有图片文件
      expect(result.files.every(f => f.mimeType.startsWith('image/'))).toBe(true)
    })
  })

  describe('getFileUrl - 获取文件URL', () => {
    it('应该返回文件的访问URL', async () => {
      const fileData = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const uploadResult = await uploadFile(fileData, {
        userId: 'user-123',
        isPublic: true
      })

      const url = await getFileUrl(uploadResult.fileId)

      expect(url).toBeDefined()
      expect(url).toContain(uploadResult.fileId)
      expect(url).toContain('test.jpg')
    })

    it('应该生成带签名的临时URL', async () => {
      const fileData = new File(['test'], 'private.jpg', { type: 'image/jpeg' })
      const uploadResult = await uploadFile(fileData, {
        userId: 'user-123',
        isPublic: false
      })

      const url = await getFileUrl(uploadResult.fileId, {
        expiresIn: 3600, // 1小时
        userId: 'user-123'
      })

      expect(url).toBeDefined()
      expect(url).toContain('signature=')
      expect(url).toContain('expires=')
    })

    it('应该拒绝访问不存在的文件', async () => {
      await expect(getFileUrl('nonexistent-file-id'))
        .rejects.toThrow('文件不存在')
    })
  })

  describe('processImageFile - 图片处理', () => {
    it('应该调整图片尺寸', async () => {
      const imageData = 'fake-large-image-data'
      const fileData = new File([imageData], 'large.jpg', { type: 'image/jpeg' })
      const uploadResult = await uploadFile(fileData, { userId: 'user-123' })

      const options: FileProcessingOptions = {
        width: 200,
        height: 200,
        quality: 80,
        format: 'jpeg'
      }

      const result = await processImageFile(uploadResult.fileId, options)

      expect(result.success).toBe(true)
      expect(result.processedFileId).toBeDefined()
      expect(result.width).toBe(200)
      expect(result.height).toBe(200)
      expect(result.size).toBeLessThan(uploadResult.size)
    })

    it('应该支持图片格式转换', async () => {
      const fileData = new File(['test'], 'image.png', { type: 'image/png' })
      const uploadResult = await uploadFile(fileData, { userId: 'user-123' })

      const options: FileProcessingOptions = {
        format: 'webp',
        quality: 90
      }

      const result = await processImageFile(uploadResult.fileId, options)

      expect(result.success).toBe(true)
      expect(result.format).toBe('webp')
      expect(result.mimeType).toBe('image/webp')
    })

    it('应该支持图片压缩', async () => {
      const largeImageData = 'fake-large-compressible-data'
      const fileData = new File([largeImageData], 'large.jpg', { type: 'image/jpeg' })
      const uploadResult = await uploadFile(fileData, { userId: 'user-123' })

      const options: FileProcessingOptions = {
        quality: 60,
        optimize: true
      }

      const result = await processImageFile(uploadResult.fileId, options)

      expect(result.success).toBe(true)
      expect(result.compressionRatio).toBeGreaterThan(0)
      expect(result.size).toBeLessThan(uploadResult.size)
    })
  })

  describe('generateThumbnail - 生成缩略图', () => {
    it('应该为图片生成缩略图', async () => {
      const fileData = new File(['test'], 'image.jpg', { type: 'image/jpeg' })
      const uploadResult = await uploadFile(fileData, { userId: 'user-123' })

      const result = await generateThumbnail(uploadResult.fileId, {
        width: 150,
        height: 150,
        quality: 80
      })

      expect(result.success).toBe(true)
      expect(result.thumbnailId).toBeDefined()
      expect(result.thumbnailUrl).toBeDefined()
      expect(result.width).toBe(150)
      expect(result.height).toBe(150)
    })

    it('应该支持多个尺寸的缩略图', async () => {
      const fileData = new File(['test'], 'image.jpg', { type: 'image/jpeg' })
      const uploadResult = await uploadFile(fileData, { userId: 'user-123' })

      const sizes = [
        { name: 'small', width: 100, height: 100 },
        { name: 'medium', width: 200, height: 200 },
        { name: 'large', width: 400, height: 400 }
      ]

      const results = await Promise.all(
        sizes.map(size => generateThumbnail(uploadResult.fileId, size))
      )

      results.forEach((result, index) => {
        expect(result.success).toBe(true)
        expect(result.width).toBe(sizes[index].width)
        expect(result.height).toBe(sizes[index].height)
      })
    })

    it('应该拒绝为非图片文件生成缩略图', async () => {
      const fileData = new File(['test'], 'document.pdf', { type: 'application/pdf' })
      const uploadResult = await uploadFile(fileData, { userId: 'user-123' })

      const result = await generateThumbnail(uploadResult.fileId, { width: 150, height: 150 })

      expect(result.success).toBe(false)
      expect(result.error).toContain('不支持的文件类型')
    })
  })

  describe('compressFile - 文件压缩', () => {
    it('应该压缩图片文件', async () => {
      const imageData = 'fake-compressible-image-data'
      const fileData = new File([imageData], 'image.jpg', { type: 'image/jpeg' })
      const uploadResult = await uploadFile(fileData, { userId: 'user-123' })

      const result = await compressFile(uploadResult.fileId, {
        quality: 70,
        method: 'lossy'
      })

      expect(result.success).toBe(true)
      expect(result.compressedFileId).toBeDefined()
      expect(result.originalSize).toBe(uploadResult.size)
      expect(result.compressedSize).toBeLessThan(uploadResult.size)
      expect(result.compressionRatio).toBeGreaterThan(0)
    })

    it('应该压缩PDF文件', async () => {
      const pdfData = 'fake-pdf-data-with-redundancy'
      const fileData = new File([pdfData], 'document.pdf', { type: 'application/pdf' })
      const uploadResult = await uploadFile(fileData, { userId: 'user-123' })

      const result = await compressFile(uploadResult.fileId, {
        method: 'lossless',
        optimizeImages: true
      })

      expect(result.success).toBe(true)
      expect(result.compressedFileId).toBeDefined()
    })

    it('应该支持批量压缩', async () => {
      const files = [
        new File(['test1'], 'image1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'image2.jpg', { type: 'image/jpeg' })
      ]

      const uploadResults = await Promise.all(
        files.map(file => uploadFile(file, { userId: 'user-123' }))
      )

      const results = await Promise.all(
        uploadResults.map(result => compressFile(result.fileId, { quality: 70 }))
      )

      results.forEach(result => {
        expect(result.success).toBe(true)
        expect(result.compressedFileId).toBeDefined()
      })
    })
  })

  describe('moveFile - 文件移动', () => {
    it('应该移动文件到新路径', async () => {
      const fileData = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const uploadResult = await uploadFile(fileData, {
        userId: 'user-123',
        category: 'temp'
      })

      const result = await moveFile(uploadResult.fileId, {
        newCategory: 'avatar',
        newCustomName: 'profile-pic',
        userId: 'user-123'
      })

      expect(result.success).toBe(true)
      expect(result.newPath).toBeDefined()

      // 验证文件在新位置
      const metadata = await getFileMetadata(uploadResult.fileId)
      expect(metadata.category).toBe('avatar')
      expect(metadata.customName).toBe('profile-pic')
    })

    it('应该拒绝移动到无效路径', async () => {
      const fileData = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const uploadResult = await uploadFile(fileData, { userId: 'user-123' })

      const result = await moveFile(uploadResult.fileId, {
        newCategory: 'invalid-category',
        userId: 'user-123'
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('无效的目标路径')
    })
  })

  describe('copyFile - 文件复制', () => {
    it('应该复制文件到新路径', async () => {
      const fileData = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const uploadResult = await uploadFile(fileData, { userId: 'user-123' })

      const result = await copyFile(uploadResult.fileId, {
        newCategory: 'backup',
        newCustomName: 'copy-of-test',
        userId: 'user-123'
      })

      expect(result.success).toBe(true)
      expect(result.newFileId).toBeDefined()
      expect(result.newFileId).not.toBe(uploadResult.fileId)

      // 验证原文件仍然存在
      const originalMetadata = await getFileMetadata(uploadResult.fileId)
      expect(originalMetadata).toBeDefined()

      // 验证复制的文件
      const copyMetadata = await getFileMetadata(result.newFileId)
      expect(copyMetadata.category).toBe('backup')
      expect(copyMetadata.customName).toBe('copy-of-test')
    })

    it('应该复制时保留元数据', async () => {
      const fileData = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const uploadResult = await uploadFile(fileData, {
        userId: 'user-123',
        description: 'Original description',
        tags: ['tag1', 'tag2']
      })

      const result = await copyFile(uploadResult.fileId, {
        newCategory: 'copy',
        userId: 'user-123'
      })

      const copyMetadata = await getFileMetadata(result.newFileId)
      expect(copyMetadata.description).toBe('Original description')
      expect(copyMetadata.tags).toContain('tag1')
      expect(copyMetadata.tags).toContain('tag2')
    })
  })

  describe('getFileStats - 文件统计', () => {
    it('应该返回用户的文件统计信息', async () => {
      const files = [
        new File(['test1'], 'image1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'image2.png', { type: 'image/png' }),
        new File(['test3'], 'document.pdf', { type: 'application/pdf' })
      ]

      await Promise.all(
        files.map(file => uploadFile(file, { userId: 'user-123' }))
      )

      const stats: FileStats = await getFileStats('user-123')

      expect(stats.totalFiles).toBe(3)
      expect(stats.totalSize).toBe(12) // 3 files × 4 bytes
      expect(stats.fileTypes['image/jpeg']).toBe(1)
      expect(stats.fileTypes['image/png']).toBe(1)
      expect(stats.fileTypes['application/pdf']).toBe(1)
      expect(stats.categoryStats).toBeDefined()
      expect(stats.uploadDates).toBeDefined()
    })

    it('应该支持系统级统计', async () => {
      const stats: FileStats = await getFileStats()

      expect(stats.totalFiles).toBeGreaterThanOrEqual(0)
      expect(stats.totalSize).toBeGreaterThanOrEqual(0)
      expect(stats.fileTypes).toBeDefined()
      expect(stats.userStats).toBeDefined()
    })
  })

  describe('cleanupOrphanedFiles - 清理孤立文件', () => {
    it('应该清理没有元数据的文件', async () => {
      // 模拟孤立文件
      const statsBefore = await getFileStats()

      const result = await cleanupOrphanedFiles({
        dryRun: false,
        olderThan: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24小时前
      })

      expect(result.success).toBe(true)
      expect(result.cleanedFiles).toBeDefined()
      expect(result.freedSpace).toBeGreaterThanOrEqual(0)
      expect(result.cleanedAt).toBeDefined()
    })

    it('应该支持预览模式', async () => {
      const result = await cleanupOrphanedFiles({
        dryRun: true,
        olderThan: new Date(Date.now() - 24 * 60 * 60 * 1000)
      })

      expect(result.success).toBe(true)
      expect(result.preview).toBe(true)
      expect(result.wouldCleanFiles).toBeDefined()
    })
  })

  describe('backupFiles - 文件备份', () => {
    it('应该创建文件备份', async () => {
      const files = [
        new File(['test1'], 'backup1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'backup2.jpg', { type: 'image/jpeg' })
      ]

      const uploadResults = await Promise.all(
        files.map(file => uploadFile(file, { userId: 'user-123' }))
      )

      const fileIds = uploadResults.map(r => r.fileId)

      const result = await backupFiles({
        fileIds,
        backupType: 'full',
        destination: 'cloud-storage',
        userId: 'user-123'
      })

      expect(result.success).toBe(true)
      expect(result.backupId).toBeDefined()
      expect(result.backupSize).toBeGreaterThan(0)
      expect(result.fileCount).toBe(2)
      expect(result.createdAt).toBeDefined()
    })

    it('应该支持增量备份', async () => {
      const result = await backupFiles({
        backupType: 'incremental',
        since: new Date(Date.now() - 24 * 60 * 60 * 1000), // 最近24小时
        userId: 'user-123'
      })

      expect(result.success).toBe(true)
      expect(result.backupType).toBe('incremental')
    })
  })

  describe('restoreFiles - 文件恢复', () => {
    it('应该从备份恢复文件', async () => {
      // 先创建备份
      const fileData = new File(['test'], 'restore-test.jpg', { type: 'image/jpeg' })
      const uploadResult = await uploadFile(fileData, { userId: 'user-123' })

      const backupResult = await backupFiles({
        fileIds: [uploadResult.fileId],
        backupType: 'full',
        userId: 'user-123'
      })

      // 删除原文件
      await deleteFile(uploadResult.fileId, 'user-123')

      // 从备份恢复
      const restoreResult = await restoreFiles({
        backupId: backupResult.backupId,
        fileIds: [uploadResult.fileId],
        restoreTo: 'original-location',
        userId: 'user-123'
      })

      expect(restoreResult.success).toBe(true)
      expect(restoreResult.restoredFiles).toHaveLength(1)
      expect(restoreResult.restoredAt).toBeDefined()

      // 验证文件已恢复
      const metadata = await getFileMetadata(uploadResult.fileId)
      expect(metadata).toBeDefined()
      expect(metadata.originalName).toBe('restore-test.jpg')
    })

    it('应该支持选择性恢复', async () => {
      const result = await restoreFiles({
        backupId: 'backup-123',
        fileIds: ['file-1', 'file-2'],
        restoreTo: 'new-location',
        overwrite: false
      })

      expect(result.success).toBe(true)
      expect(result.restoredFiles).toBeDefined()
      expect(result.skippedFiles).toBeDefined()
    })
  })

  describe('性能测试', () => {
    it('应该在合理时间内上传文件', async () => {
      const startTime = Date.now()

      const fileData = new File(['test'], 'performance-test.jpg', { type: 'image/jpeg' })
      await uploadFile(fileData, { userId: 'user-123' })

      const duration = Date.now() - startTime

      expect(duration).toBeLessThan(5000) // 5秒内完成
    })

    it('应该支持并发文件上传', async () => {
      const files = Array.from({ length: 10 }, (_, i) =>
        new File([`test${i}`], `file${i}.jpg`, { type: 'image/jpeg' })
      )

      const startTime = Date.now()

      const results = await Promise.all(
        files.map(file => uploadFile(file, { userId: 'user-123' }))
      )

      const duration = Date.now() - startTime

      expect(results.every(r => r.success)).toBe(true)
      expect(duration).toBeLessThan(10000) // 10秒内完成10个文件
    })

    it('应该在合理时间内搜索大量文件', async () => {
      // 创建大量文件
      const files = Array.from({ length: 100 }, (_, i) =>
        new File([`test${i}`], `file${i}.jpg`, { type: 'image/jpeg' })
      )

      await Promise.all(
        files.map(file => uploadFile(file, { userId: 'user-123' }))
      )

      const startTime = Date.now()

      const result = await searchFiles({
        userId: 'user-123',
        query: 'file',
        limit: 50
      })

      const duration = Date.now() - startTime

      expect(result.files.length).toBe(50)
      expect(duration).toBeLessThan(2000) // 2秒内完成搜索
    })
  })

  describe('错误处理测试', () => {
    it('应该处理网络错误', async () => {
      const fileData = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

      // 模拟网络错误
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'))

      const result = await uploadFile(fileData, { userId: 'user-123' })

      expect(result.success).toBe(false)
      expect(result.error).toContain('网络错误')
    })

    it('应该处理存储空间不足', async () => {
      const largeData = new Array(100 * 1024 * 1024).fill('a').join('') // 100MB
      const fileData = new File([largeData], 'huge.jpg', { type: 'image/jpeg' })

      const result = await uploadFile(fileData, { userId: 'user-123' })

      expect(result.success).toBe(false)
      expect(result.error).toContain('存储空间不足')
    })

    it('应该处理文件损坏', async () => {
      const corruptedData = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]) // 损坏的JPEG头部
      const fileData = new File([corruptedData], 'corrupted.jpg', { type: 'image/jpeg' })

      const result = await uploadFile(fileData, { userId: 'user-123' })

      expect(result.success).toBe(false)
      expect(result.error).toContain('文件损坏')
    })
  })
})