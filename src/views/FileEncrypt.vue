<script setup lang="ts">
import { ref } from 'vue'
import { useCryptoStore } from '@/stores/crypto'
import { ElMessage } from 'element-plus'
import { FileUtil } from '@/utils/crypto'

const cryptoStore = useCryptoStore()

const fileList = ref<File[]>([])
const encryptedFiles = ref<{ name: string; data: Uint8Array; size: number }[]>([])
const isProcessing = ref(false)
const progress = ref(0)

// 处理文件选择
function handleFileChange(file: File) {
  fileList.value = [...fileList.value, file]
  return false // 阻止自动上传
}

// 加密文件
async function encryptFiles() {
  if (!cryptoStore.hasKey) {
    ElMessage.warning('请先生成密钥')
    return
  }
  if (fileList.value.length === 0) {
    ElMessage.warning('请选择要加密的文件')
    return
  }

  isProcessing.value = true
  progress.value = 0

  try {
    const total = fileList.value.length
    for (let i = 0; i < total; i++) {
      const file = fileList.value[i]!
      const result = await cryptoStore.encryptFile(file)
      encryptedFiles.value.push({
        name: file.name + '.encrypted',
        data: result.data,
        size: result.data.length,
      })
      progress.value = Math.round(((i + 1) / total) * 100)
    }
    ElMessage.success('所有文件加密成功')
  } catch (error) {
    ElMessage.error('加密失败')
    console.error(error)
  } finally {
    isProcessing.value = false
  }
}

// 解密文件
async function decryptFile(file: File | undefined) {
  if (!file) return
  
  if (!cryptoStore.hasKey) {
    ElMessage.warning('请先选择密钥')
    return
  }

  isProcessing.value = true

  try {
    const data = await FileUtil.readFileAsBytes(file)
    const decrypted = await cryptoStore.decryptFile(data)

    // 移除 .encrypted 后缀
    let filename = file.name
    if (filename.endsWith('.encrypted')) {
      filename = filename.slice(0, -10)
    } else {
      filename = 'decrypted_' + filename
    }

    FileUtil.downloadFile(decrypted, filename)
    ElMessage.success('解密成功，文件已下载')
  } catch (error) {
    ElMessage.error('解密失败，请检查密钥是否正确')
    console.error(error)
  } finally {
    isProcessing.value = false
  }
}

// 下载加密文件
function downloadEncrypted(file: { name: string; data: Uint8Array }) {
  FileUtil.downloadFile(file.data, file.name)
  ElMessage.success('文件已下载')
}

// 清空列表
function clearFiles() {
  fileList.value = []
  encryptedFiles.value = []
  progress.value = 0
}

// 移除单个文件
function removeFile(index: number) {
  fileList.value.splice(index, 1)
}

function removeEncrypted(index: number) {
  encryptedFiles.value.splice(index, 1)
}

// 格式化文件大小
function formatSize(bytes: number): string {
  return FileUtil.formatFileSize(bytes)
}
</script>

<template>
  <div class="file-page">
    <el-page-header @back="$router.push('/')">
      <template #content>
        <span class="text-large font-600 mr-3">文件加密</span>
      </template>
    </el-page-header>

    <el-divider />

    <!-- 密钥检查 -->
    <el-alert
      v-if="!cryptoStore.hasKey"
      title="请先在密码加密页面生成或导入密钥"
      type="warning"
      show-icon
      :closable="false"
      style="margin-bottom: 20px"
    >
      <template #default>
        <el-button type="primary" size="small" @click="$router.push('/password')">
          前往生成密钥
        </el-button>
      </template>
    </el-alert>

    <!-- 文件上传 -->
    <el-card shadow="never" class="upload-card">
      <template #header>
        <div class="card-header">
          <el-icon><Upload /></el-icon>
          <span>选择文件</span>
        </div>
      </template>

      <el-upload
        drag
        multiple
        :auto-upload="false"
        :on-change="handleFileChange"
        :file-list="[]"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          拖拽文件到此处，或 <em>点击选择</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持所有文件类型，可多选
          </div>
        </template>
      </el-upload>

      <!-- 已选文件列表 -->
      <div v-if="fileList.length > 0" class="file-list">
        <el-divider>待加密文件 ({{ fileList.length }})</el-divider>
        <el-table :data="fileList" stripe size="small">
          <el-table-column prop="name" label="文件名" />
          <el-table-column label="大小" width="120">
            <template #default="{ row }">
              {{ formatSize(row.size) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="{ $index }">
              <el-button
                type="danger"
                size="small"
                link
                @click="removeFile($index)"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="actions">
          <el-button
            type="primary"
            @click="encryptFiles"
            :loading="isProcessing"
            :disabled="!cryptoStore.hasKey"
          >
            <el-icon><Lock /></el-icon>
            开始加密
          </el-button>
          <el-button @click="clearFiles">清空</el-button>
        </div>
      </div>

      <!-- 进度条 -->
      <el-progress
        v-if="isProcessing"
        :percentage="progress"
        :stroke-width="10"
        style="margin-top: 20px"
      />
    </el-card>

    <!-- 加密结果 -->
    <el-card v-if="encryptedFiles.length > 0" shadow="never" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon><Document /></el-icon>
          <span>加密文件 ({{ encryptedFiles.length }})</span>
        </div>
      </template>

      <el-table :data="encryptedFiles" stripe>
        <el-table-column prop="name" label="文件名" />
        <el-table-column label="大小" width="120">
          <template #default="{ row }">
            {{ formatSize(row.size) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row, $index }">
            <el-button type="primary" size="small" @click="downloadEncrypted(row)">
              下载
            </el-button>
            <el-button type="danger" size="small" link @click="removeEncrypted($index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 解密区域 -->
    <el-card shadow="never" class="decrypt-card">
      <template #header>
        <div class="card-header">
          <el-icon><Unlock /></el-icon>
          <span>解密文件</span>
        </div>
      </template>

      <el-upload
        drag
        :auto-upload="false"
        :show-file-list="false"
        :on-change="(uploadFile: any) => decryptFile(uploadFile?.raw)"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          拖拽加密文件到此处进行解密
        </div>
        <template #tip>
          <div class="el-upload__tip">
            解密后自动下载
          </div>
        </template>
      </el-upload>
    </el-card>
  </div>
</template>

<style scoped>
.file-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.upload-card,
.result-card,
.decrypt-card {
  margin-bottom: 20px;
}

.file-list {
  margin-top: 20px;
}

.actions {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

:deep(.el-upload-dragger) {
  padding: 40px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .file-page {
    padding: 16px;
  }

  :deep(.el-upload-dragger) {
    padding: 24px;
  }

  :deep(.el-upload__text) {
    font-size: 0.9rem;
  }

  :deep(.el-table) {
    font-size: 0.85rem;
  }

  .actions {
    gap: 8px;
  }

  .actions .el-button {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .file-page {
    padding: 12px;
  }

  .card-header {
    font-size: 0.95rem;
  }

  :deep(.el-upload-dragger) {
    padding: 20px;
  }

  :deep(.el-upload__text) {
    font-size: 0.85rem;
  }

  :deep(.el-icon--upload) {
    font-size: 48px;
  }

  :deep(.el-table) {
    font-size: 0.8rem;
  }

  :deep(.el-table th) {
    padding: 8px 0;
  }

  :deep(.el-table td) {
    padding: 8px 0;
  }
}

/* 触摸设备优化 */
@media (hover: none) {
  :deep(.el-upload-dragger:hover) {
    border-color: #d9d9d9;
  }
}
</style>
