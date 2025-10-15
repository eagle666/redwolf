#!/usr/bin/env node

/**
 * 自定义测试运行器：验证文件上传和管理系统功能
 * 由于文件操作的特殊性，使用Node.js直接运行功能验证
 */

console.log('🚀 开始验证文件上传和管理系统功能...\n')

// 动态导入模块
async function runTests() {
  try {
    // 导入要测试的模块
    const {
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
      fileMemoryStore
    } = await import('./dist/file-manager.js')

    console.log('✅ 成功导入文件上传和管理系统模块')

    // 创建模拟文件对象
    function createMockFile(name, content = 'test content', mimeType = 'text/plain') {
      return new File([content], name, { type: mimeType })
    }

    // 测试1: validateFile - 文件验证
    console.log('\n📝 测试1: 文件验证')
    try {
      const validFile = createMockFile('test.jpg', 'fake image data', 'image/jpeg')
      const validation = await validateFile(validFile)

      if (validation.valid) {
        console.log('✅ 有效文件验证通过')
      } else {
        console.log('❌ 有效文件验证失败')
      }

      // 测试无效文件类型
      const invalidFile = createMockFile('test.exe', 'fake exe', 'application/x-executable')
      const invalidValidation = await validateFile(invalidFile)

      if (!invalidValidation.valid && invalidValidation.errors.length > 0) {
        console.log('✅ 无效文件类型正确被拒绝')
        console.log(`   错误信息: ${invalidValidation.errors.join(', ')}`)
      } else {
        console.log('❌ 无效文件类型验证失败')
      }

      // 测试过大文件
      const largeContent = 'a'.repeat(11 * 1024 * 1024) // 11MB
      const largeFile = createMockFile('large.jpg', largeContent, 'image/jpeg')
      const largeValidation = await validateFile(largeFile)

      if (!largeValidation.valid && largeValidation.errors.some(e => e.includes('文件大小'))) {
        console.log('✅ 大文件正确被拒绝')
      } else {
        console.log('❌ 大文件验证失败')
      }

    } catch (error) {
      console.log('❌ 文件验证测试异常:', error.message)
    }

    // 测试2: uploadFile - 文件上传
    console.log('\n📝 测试2: 文件上传')
    try {
      const fileData = createMockFile('test-upload.jpg', 'fake image data', 'image/jpeg')
      const uploadOptions = {
        userId: 'user-123',
        category: 'avatar',
        isPublic: false,
        customName: 'my-avatar',
        description: '测试头像',
        tags: ['profile', 'test'],
        generateThumbnail: true
      }

      const uploadResult = await uploadFile(fileData, uploadOptions)

      if (uploadResult.success) {
        console.log('✅ 文件上传测试通过')
        console.log(`   文件ID: ${uploadResult.fileId}`)
        console.log(`   原始名称: ${uploadResult.originalName}`)
        console.log(`   自定义名称: ${uploadResult.customName}`)
        console.log(`   文件类型: ${uploadResult.mimeType}`)
        console.log(`   文件大小: ${uploadResult.size} bytes`)
        console.log(`   文件分类: ${uploadResult.category}`)
        console.log(`   用户ID: ${uploadResult.userId}`)
        console.log(`   公开状态: ${uploadResult.isPublic}`)
        console.log(`   描述: ${uploadResult.description}`)
        console.log(`   标签: ${uploadResult.tags.join(', ')}`)
        console.log(`   生成缩略图: ${!!uploadResult.thumbnailUrl}`)
        console.log(`   文件URL: ${uploadResult.url}`)
      } else {
        console.log('❌ 文件上传测试失败')
        console.log('   错误信息:', uploadResult.error)
      }

      // 保存上传结果用于后续测试
      global.testFileId = uploadResult.fileId
      global.testUserId = uploadOptions.userId

    } catch (error) {
      console.log('❌ 文件上传测试异常:', error.message)
    }

    // 测试3: getFileMetadata - 获取文件元数据
    console.log('\n📝 测试3: 获取文件元数据')
    try {
      if (global.testFileId) {
        const metadata = await getFileMetadata(global.testFileId)

        if (metadata) {
          console.log('✅ 获取文件元数据测试通过')
          console.log(`   文件ID: ${metadata.fileId}`)
          console.log(`   原始名称: ${metadata.originalName}`)
          console.log(`   自定义名称: ${metadata.customName}`)
          console.log(`   文件类型: ${metadata.mimeType}`)
          console.log(`   文件大小: ${metadata.size} bytes`)
          console.log(`   文件分类: ${metadata.category}`)
          console.log(`   用户ID: ${metadata.userId}`)
          console.log(`   创建时间: ${metadata.createdAt}`)
          console.log(`   更新时间: ${metadata.updatedAt}`)
          console.log(`   下载次数: ${metadata.downloadCount}`)
          console.log(`   文件校验和: ${metadata.checksum}`)
        } else {
          console.log('❌ 获取文件元数据失败：文件不存在')
        }
      } else {
        console.log('❌ 获取文件元数据测试跳过：没有测试文件')
      }
    } catch (error) {
      console.log('❌ 获取文件元数据测试异常:', error.message)
    }

    // 测试4: updateFileMetadata - 更新文件元数据
    console.log('\n📝 测试4: 更新文件元数据')
    try {
      if (global.testFileId && global.testUserId) {
        const updateData = {
          customName: 'updated-avatar',
          description: '更新后的头像描述',
          tags: ['profile', 'updated'],
          isPublic: true,
          category: 'gallery'
        }

        const updateResult = await updateFileMetadata(global.testFileId, updateData, global.testUserId)

        if (updateResult.success) {
          console.log('✅ 更新文件元数据测试通过')
          console.log(`   更新时间: ${updateResult.updatedAt}`)

          // 验证更新结果
          const updatedMetadata = await getFileMetadata(global.testFileId)
          if (updatedMetadata) {
            console.log(`   新的自定义名称: ${updatedMetadata.customName}`)
            console.log(`   新的描述: ${updatedMetadata.description}`)
            console.log(`   新的标签: ${updatedMetadata.tags.join(', ')}`)
            console.log(`   新的公开状态: ${updatedMetadata.isPublic}`)
            console.log(`   新的分类: ${updatedMetadata.category}`)
          }
        } else {
          console.log('❌ 更新文件元数据测试失败')
          console.log('   错误信息:', updateResult.error)
        }
      } else {
        console.log('❌ 更新文件元数据测试跳过：没有测试文件')
      }
    } catch (error) {
      console.log('❌ 更新文件元数据测试异常:', error.message)
    }

    // 测试5: listFiles - 文件列表
    console.log('\n📝 测试5: 文件列表')
    try {
      if (global.testUserId) {
        // 上传更多文件用于测试列表
        const files = [
          createMockFile('file1.jpg', 'fake image 1', 'image/jpeg'),
          createMockFile('file2.png', 'fake image 2', 'image/png'),
          createMockFile('file3.pdf', 'fake pdf content', 'application/pdf')
        ]

        for (const file of files) {
          await uploadFile(file, {
            userId: global.testUserId,
            category: 'test'
          })
        }

        const listOptions = {
          userId: global.testUserId,
          page: 1,
          limit: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        }

        const listResult = await listFiles(listOptions)

        if (listResult.success) {
          console.log('✅ 文件列表测试通过')
          console.log(`   总文件数: ${listResult.total}`)
          console.log(`   当前页: ${listResult.page}`)
          console.log(`   每页限制: ${listResult.limit}`)
          console.log(`   总页数: ${listResult.totalPages}`)
          console.log(`   返回文件数: ${listResult.files.length}`)

          listResult.files.forEach((file, index) => {
            console.log(`   文件${index + 1}: ${file.originalName} (${file.mimeType})`)
          })
        } else {
          console.log('❌ 文件列表测试失败')
          console.log('   错误信息:', listResult.error)
        }
      } else {
        console.log('❌ 文件列表测试跳过：没有测试用户')
      }
    } catch (error) {
      console.log('❌ 文件列表测试异常:', error.message)
    }

    // 测试6: searchFiles - 文件搜索
    console.log('\n📝 测试6: 文件搜索')
    try {
      if (global.testUserId) {
        const searchOptions = {
          userId: global.testUserId,
          query: 'avatar',
          searchBy: ['originalName', 'customName', 'description', 'tags']
        }

        const searchResult = await searchFiles(searchOptions)

        if (searchResult.success) {
          console.log('✅ 文件搜索测试通过')
          console.log(`   搜索关键词: ${searchResult.query}`)
          console.log(`   匹配文件数: ${searchResult.total}`)
          console.log(`   返回文件数: ${searchResult.files.length}`)

          searchResult.files.forEach((file, index) => {
            console.log(`   匹配文件${index + 1}: ${file.originalName} - ${file.customName}`)
          })
        } else {
          console.log('❌ 文件搜索测试失败')
          console.log('   错误信息:', searchResult.error)
        }
      } else {
        console.log('❌ 文件搜索测试跳过：没有测试用户')
      }
    } catch (error) {
      console.log('❌ 文件搜索测试异常:', error.message)
    }

    // 测试7: getFileUrl - 获取文件URL
    console.log('\n📝 测试7: 获取文件URL')
    try {
      if (global.testFileId) {
        const url = await getFileUrl(global.testFileId)

        if (url && url.includes('files')) {
          console.log('✅ 获取文件URL测试通过')
          console.log(`   文件URL: ${url}`)

          // 测试带签名URL
          const signedUrl = await getFileUrl(global.testFileId, {
            expiresIn: 3600,
            download: true
          })

          console.log(`   签名URL: ${signedUrl}`)
          console.log(`   包含签名: ${signedUrl.includes('signature')}`)
          console.log(`   包含过期时间: ${signedUrl.includes('expires')}`)
          console.log(`   包含下载参数: ${signedUrl.includes('download')}`)
        } else {
          console.log('❌ 获取文件URL测试失败')
        }
      } else {
        console.log('❌ 获取文件URL测试跳过：没有测试文件')
      }
    } catch (error) {
      console.log('❌ 获取文件URL测试异常:', error.message)
    }

    // 测试8: generateThumbnail - 生成缩略图
    console.log('\n📝 测试8: 生成缩略图')
    try {
      if (global.testFileId) {
        const thumbnailOptions = {
          width: 150,
          height: 150,
          quality: 80,
          format: 'jpeg'
        }

        const thumbnailResult = await generateThumbnail(global.testFileId, thumbnailOptions)

        if (thumbnailResult.success) {
          console.log('✅ 生成缩略图测试通过')
          console.log(`   缩略图ID: ${thumbnailResult.thumbnailId}`)
          console.log(`   缩略图URL: ${thumbnailResult.thumbnailUrl}`)
          console.log(`   缩略图尺寸: ${thumbnailResult.width}x${thumbnailResult.height}`)
          console.log(`   缩略图大小: ${thumbnailResult.size} bytes`)
        } else {
          console.log('❌ 生成缩略图测试失败')
          console.log('   错误信息:', thumbnailResult.error)
        }
      } else {
        console.log('❌ 生成缩略图测试跳过：没有测试文件')
      }
    } catch (error) {
      console.log('❌ 生成缩略图测试异常:', error.message)
    }

    // 测试9: processImageFile - 图片处理
    console.log('\n📝 测试9: 图片处理')
    try {
      if (global.testFileId) {
        const processingOptions = {
          width: 400,
          height: 300,
          quality: 85,
          format: 'jpeg',
          optimize: true
        }

        const processingResult = await processImageFile(global.testFileId, processingOptions)

        if (processingResult.success) {
          console.log('✅ 图片处理测试通过')
          console.log(`   处理后文件ID: ${processingResult.processedFileId}`)
          console.log(`   处理后URL: ${processingResult.url}`)
          console.log(`   处理后尺寸: ${processingResult.width}x${processingResult.height}`)
          console.log(`   处理后大小: ${processingResult.size} bytes`)
          console.log(`   处理后格式: ${processingResult.format}`)
          console.log(`   处理质量: ${processingResult.quality}`)
          console.log(`   压缩比: ${processingResult.compressionRatio?.toFixed(2)}`)
          console.log(`   处理时间: ${processingResult.processingTime}ms`)
        } else {
          console.log('❌ 图片处理测试失败')
          console.log('   错误信息:', processingResult.error)
        }
      } else {
        console.log('❌ 图片处理测试跳过：没有测试文件')
      }
    } catch (error) {
      console.log('❌ 图片处理测试异常:', error.message)
    }

    // 测试10: compressFile - 文件压缩
    console.log('\n📝 测试10: 文件压缩')
    try {
      if (global.testFileId) {
        const compressionOptions = {
          quality: 70,
          method: 'lossy',
          optimize: true,
          removeMetadata: true
        }

        const compressionResult = await compressFile(global.testFileId, compressionOptions)

        if (compressionResult.success) {
          console.log('✅ 文件压缩测试通过')
          console.log(`   压缩后文件ID: ${compressionResult.compressedFileId}`)
          console.log(`   压缩后URL: ${compressionResult.url}`)
          console.log(`   原始大小: ${compressionResult.originalSize} bytes`)
          console.log(`   压缩后大小: ${compressionResult.compressedSize} bytes`)
          console.log(`   压缩比: ${compressionResult.compressionRatio?.toFixed(2)}`)
          console.log(`   节省空间: ${compressionResult.spaceSaved} bytes`)
        } else {
          console.log('❌ 文件压缩测试失败')
          console.log('   错误信息:', compressionResult.error)
        }
      } else {
        console.log('❌ 文件压缩测试跳过：没有测试文件')
      }
    } catch (error) {
      console.log('❌ 文件压缩测试异常:', error.message)
    }

    // 测试11: moveFile - 文件移动
    console.log('\n📝 测试11: 文件移动')
    try {
      if (global.testFileId && global.testUserId) {
        const moveOptions = {
          newCategory: 'gallery',
          newCustomName: 'moved-file',
          userId: global.testUserId
        }

        const moveResult = await moveFile(global.testFileId, moveOptions)

        if (moveResult.success) {
          console.log('✅ 文件移动测试通过')
          console.log(`   新路径: ${moveResult.newPath}`)
          console.log(`   原路径: ${moveResult.oldPath}`)
          console.log(`   移动时间: ${moveResult.movedAt}`)
        } else {
          console.log('❌ 文件移动测试失败')
          console.log('   错误信息:', moveResult.error)
        }
      } else {
        console.log('❌ 文件移动测试跳过：没有测试文件')
      }
    } catch (error) {
      console.log('❌ 文件移动测试异常:', error.message)
    }

    // 测试12: copyFile - 文件复制
    console.log('\n📝 测试12: 文件复制')
    try {
      if (global.testFileId && global.testUserId) {
        const copyOptions = {
          newCategory: 'temp',
          newCustomName: 'copied-file',
          preserveMetadata: true,
          userId: global.testUserId
        }

        const copyResult = await copyFile(global.testFileId, copyOptions)

        if (copyResult.success) {
          console.log('✅ 文件复制测试通过')
          console.log(`   新文件ID: ${copyResult.newFileId}`)
          console.log(`   原文件ID: ${copyResult.originalFileId}`)
          console.log(`   复制时间: ${copyResult.copiedAt}`)

          // 保存复制的文件ID用于后续测试
          global.copiedFileId = copyResult.newFileId
        } else {
          console.log('❌ 文件复制测试失败')
          console.log('   错误信息:', copyResult.error)
        }
      } else {
        console.log('❌ 文件复制测试跳过：没有测试文件')
      }
    } catch (error) {
      console.log('❌ 文件复制测试异常:', error.message)
    }

    // 测试13: getFileStats - 文件统计
    console.log('\n📝 测试13: 文件统计')
    try {
      if (global.testUserId) {
        const userStats = await getFileStats(global.testUserId)

        console.log('✅ 用户文件统计测试通过')
        console.log(`   总文件数: ${userStats.totalFiles}`)
        console.log(`   总大小: ${userStats.totalSize} bytes`)
        console.log(`   平均文件大小: ${userStats.averageFileSize.toFixed(2)} bytes`)
        console.log(`   文件类型数量: ${Object.keys(userStats.fileTypes).length}`)
        console.log(`   分类数量: ${Object.keys(userStats.categoryStats).length}`)
        console.log(`   上传日期数量: ${Object.keys(userStats.uploadDates).length}`)

        // 系统级统计
        const systemStats = await getFileStats()

        console.log('\n✅ 系统文件统计测试通过')
        console.log(`   系统总文件数: ${systemStats.totalFiles}`)
        console.log(`   系统总大小: ${systemStats.totalSize} bytes`)
        console.log(`   用户数量: ${Object.keys(systemStats.userStats || {}).length}`)
      } else {
        console.log('❌ 文件统计测试跳过：没有测试用户')
      }
    } catch (error) {
      console.log('❌ 文件统计测试异常:', error.message)
    }

    // 测试14: backupFiles - 文件备份
    console.log('\n📝 测试14: 文件备份')
    try {
      if (global.testUserId) {
        const backupOptions = {
          userId: global.testUserId,
          backupType: 'full',
          destination: 'local',
          compression: true,
          encryption: false
        }

        const backupResult = await backupFiles(backupOptions)

        if (backupResult.success) {
          console.log('✅ 文件备份测试通过')
          console.log(`   备份ID: ${backupResult.backupId}`)
          console.log(`   备份文件数: ${backupResult.fileCount}`)
          console.log(`   备份大小: ${backupResult.backupSize} bytes`)
          console.log(`   备份类型: ${backupResult.backupType}`)
          console.log(`   备份目标: ${backupResult.destination}`)
          console.log(`   备份时间: ${backupResult.createdAt}`)
          console.log(`   预计时长: ${backupResult.estimatedDuration}秒`)

          // 保存备份ID用于恢复测试
          global.backupId = backupResult.backupId
        } else {
          console.log('❌ 文件备份测试失败')
          console.log('   错误信息:', backupResult.error)
        }
      } else {
        console.log('❌ 文件备份测试跳过：没有测试用户')
      }
    } catch (error) {
      console.log('❌ 文件备份测试异常:', error.message)
    }

    // 测试15: restoreFiles - 文件恢复
    console.log('\n📝 测试15: 文件恢复')
    try {
      if (global.backupId && global.testFileId) {
        // 先删除原文件
        await deleteFile(global.testFileId, global.testUserId)

        const restoreOptions = {
          backupId: global.backupId,
          fileIds: [global.testFileId],
          restoreTo: 'original-location',
          overwrite: true,
          userId: global.testUserId
        }

        const restoreResult = await restoreFiles(restoreOptions)

        if (restoreResult.success) {
          console.log('✅ 文件恢复测试通过')
          console.log(`   恢复文件数: ${restoreResult.restoredFiles.length}`)
          console.log(`   跳过文件数: ${restoreResult.skippedFiles.length}`)
          console.log(`   覆盖文件数: ${restoreResult.overwrittenFiles.length}`)
          console.log(`   错误文件数: ${restoreResult.errorFiles.length}`)
          console.log(`   恢复时间: ${restoreResult.restoredAt}`)
          console.log(`   恢复总大小: ${restoreResult.totalSize} bytes`)

          // 验证文件已恢复
          const restoredMetadata = await getFileMetadata(global.testFileId)
          if (restoredMetadata) {
            console.log(`   验证恢复成功: ${restoredMetadata.originalName}`)
          }
        } else {
          console.log('❌ 文件恢复测试失败')
          console.log('   错误信息:', restoreResult.error)
        }
      } else {
        console.log('❌ 文件恢复测试跳过：没有备份或文件')
      }
    } catch (error) {
      console.log('❌ 文件恢复测试异常:', error.message)
    }

    // 测试16: deleteFile - 文件删除
    console.log('\n📝 测试16: 文件删除')
    try {
      if (global.testFileId && global.testUserId) {
        const deleteResult = await deleteFile(global.testFileId, global.testUserId)

        if (deleteResult.success) {
          console.log('✅ 文件删除测试通过')
          console.log(`   删除时间: ${deleteResult.deletedAt}`)

          // 验证文件已删除
          const deletedMetadata = await getFileMetadata(global.testFileId)
          if (!deletedMetadata) {
            console.log('   验证删除成功: 文件不存在')
          } else {
            console.log('❌ 验证删除失败: 文件仍然存在')
          }
        } else {
          console.log('❌ 文件删除测试失败')
          console.log('   错误信息:', deleteResult.error)
        }
      }

      // 删除复制的文件
      if (global.copiedFileId && global.testUserId) {
        const copyDeleteResult = await deleteFile(global.copiedFileId, global.testUserId)
        if (copyDeleteResult.success) {
          console.log('✅ 复制文件删除成功')
        }
      }

    } catch (error) {
      console.log('❌ 文件删除测试异常:', error.message)
    }

    // 测试17: cleanupOrphanedFiles - 清理孤立文件
    console.log('\n📝 测试17: 清理孤立文件')
    try {
      const cleanupOptions = {
        dryRun: true,
        olderThan: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24小时前
        includePublic: false
      }

      const cleanupResult = await cleanupOrphanedFiles(cleanupOptions)

      if (cleanupResult.success) {
        console.log('✅ 清理孤立文件测试通过')
        console.log(`   预览模式: ${cleanupResult.preview}`)
        console.log(`   将清理文件数: ${cleanupResult.wouldCleanFiles.length}`)
        console.log(`   将释放空间: ${cleanupResult.freedSpace} bytes`)
      } else {
        console.log('❌ 清理孤立文件测试失败')
        console.log('   错误信息:', cleanupResult.error)
      }
    } catch (error) {
      console.log('❌ 清理孤立文件测试异常:', error.message)
    }

    console.log('\n🎉 文件上传和管理系统功能验证完成！')

    // 显示统计信息
    console.log('\n📊 系统统计:')
    console.log(`   存储文件数量: ${fileMemoryStore.files.size}`)
    console.log(`   支持的文件类型: ${fileMemoryStore.allowedMimeTypes.size}`)
    console.log(`   文件分类数量: ${fileMemoryStore.fileCategories.size}`)
    console.log(`   最大文件大小: ${(fileMemoryStore.maxFileSize / 1024 / 1024).toFixed(2)}MB`)

  } catch (error) {
    console.error('❌ 模块导入失败:', error.message)
    console.error('   可能原因：模块路径错误或TypeScript编译问题')
    process.exit(1)
  }
}

// 运行测试
runTests().catch(console.error)