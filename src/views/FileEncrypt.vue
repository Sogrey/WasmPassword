<script setup lang="ts">
import { ref } from 'vue'
import { useCryptoStore } from '@/stores/crypto'
import { ElMessage } from 'element-plus'
import { FileUtil } from '@/utils/crypto'

const cryptoStore = useCryptoStore()

// 当前 Tab
const activeTab = ref('encrypt')

// 加密相关
const fileList = ref<File[]>([])
const encryptedFiles = ref<{ name: string; data: Uint8Array; size: number }[]>([])
const isProcessing = ref(false)
const progress = ref(0)

// 解密相关
const decryptFileList = ref<File[]>([])
const decryptedFiles = ref<{ name: string; data: Uint8Array; size: number }[]>([])
const isDecryptProcessing = ref(false)
const decryptProgress = ref(0)

// 处理加密文件选择
function handleFileChange(uploadFile: any) {
  if (uploadFile?.raw) {
    fileList.value = [...fileList.value, uploadFile.raw]
  }
  return false
}

// 处理解密文件选择
function handleDecryptFileChange(uploadFile: any) {
  if (uploadFile?.raw) {
    decryptFileList.value = [...decryptFileList.value, uploadFile.raw]
  }
  return false
}

// 导入密钥文件
async function importKeyFile(uploadFile: any) {
  const file = uploadFile?.raw
  if (!file) return

  try {
    const content = await FileUtil.readFileAsText(file)
    let key = content.trim()
    const match = content.match(/Key:\s*(.+)/)
    if (match && match[1]) {
      key = match[1].trim()
    }
    cryptoStore.setKey(key)
    ElMessage.success('密钥导入成功')
  } catch {
    ElMessage.error('密钥文件格式错误')
  }
  return false
}

// 加密文件
async function encryptFiles() {
  if (!cryptoStore.hasKey) {
    ElMessage.warning('请先导入密钥')
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
async function decryptFiles() {
  if (!cryptoStore.hasKey) {
    ElMessage.warning('请先导入密钥')
    return
  }
  if (decryptFileList.value.length === 0) {
    ElMessage.warning('请选择要解密的文件')
    return
  }

  isDecryptProcessing.value = true
  decryptProgress.value = 0

  try {
    const total = decryptFileList.value.length
    for (let i = 0; i < total; i++) {
      const file = decryptFileList.value[i]!
      const data = await FileUtil.readFileAsBytes(file)
      const decrypted = await cryptoStore.decryptFile(data)

      let filename = file.name
      if (filename.endsWith('.encrypted')) {
        filename = filename.slice(0, -10)
      } else {
        filename = 'decrypted_' + filename
      }

      decryptedFiles.value.push({
        name: filename,
        data: decrypted,
        size: decrypted.length,
      })
      decryptProgress.value = Math.round(((i + 1) / total) * 100)
    }
    ElMessage.success('所有文件解密成功')
  } catch (error) {
    ElMessage.error('解密失败，请检查密钥是否正确')
    console.error(error)
  } finally {
    isDecryptProcessing.value = false
  }
}

// 下载文件
function downloadFile(file: { name: string; data: Uint8Array }) {
  FileUtil.downloadFile(file.data, file.name)
  ElMessage.success('文件已下载')
}

// 一键下载全部加密文件
function downloadAllEncrypted() {
  if (encryptedFiles.value.length === 0) return
  encryptedFiles.value.forEach((file) => {
    FileUtil.downloadFile(file.data, file.name)
  })
  ElMessage.success(`已下载 ${encryptedFiles.value.length} 个文件`)
}

// 一键下载全部解密文件
function downloadAllDecrypted() {
  if (decryptedFiles.value.length === 0) return
  decryptedFiles.value.forEach((file) => {
    FileUtil.downloadFile(file.data, file.name)
  })
  ElMessage.success(`已下载 ${decryptedFiles.value.length} 个文件`)
}

// 清空加密列表
function clearEncryptFiles() {
  fileList.value = []
  encryptedFiles.value = []
  progress.value = 0
}

// 清空解密列表
function clearDecryptFiles() {
  decryptFileList.value = []
  decryptedFiles.value = []
  decryptProgress.value = 0
}

// 移除单个加密文件
function removeEncryptFile(index: number) {
  fileList.value.splice(index, 1)
}

function removeEncrypted(index: number) {
  encryptedFiles.value.splice(index, 1)
}

// 移除单个解密文件
function removeDecryptFile(index: number) {
  decryptFileList.value.splice(index, 1)
}

function removeDecrypted(index: number) {
  decryptedFiles.value.splice(index, 1)
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

    <!-- 密钥状态 -->
    <el-card v-if="!cryptoStore.hasKey" shadow="never" class="key-card">
      <div class="key-import">
        <el-icon size="24" color="#e6a23c"><Warning /></el-icon>
        <div class="key-import-text">
          <p>请先导入密钥文件</p>
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            accept=".key,.txt"
            :on-change="importKeyFile"
          >
            <el-button type="primary" size="small">
              <el-icon><Key /></el-icon>
              导入密钥文件
            </el-button>
          </el-upload>
          <el-button size="small" @click="$router.push('/password')">
            前往生成密钥
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card v-else shadow="never" class="key-card">
      <div class="key-status">
        <el-icon color="#67c23a"><CircleCheck /></el-icon>
        <span>密钥已就绪</span>
        <el-button size="small" @click="cryptoStore.clearKey">更换密钥</el-button>
      </div>
    </el-card>

    <!-- Tab 切换 -->
    <el-tabs v-model="activeTab" class="file-tabs">
      <!-- 加密 Tab -->
      <el-tab-pane label="文件加密" name="encrypt">
        <el-card shadow="never" class="upload-card">
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

          <!-- 待加密文件列表 -->
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
                    @click="removeEncryptFile($index)"
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
              <el-button @click="clearEncryptFiles">清空</el-button>
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
              <div class="card-header-left">
                <el-icon><Document /></el-icon>
                <span>加密文件 ({{ encryptedFiles.length }})</span>
              </div>
              <el-button type="primary" size="small" @click="downloadAllEncrypted">
                <el-icon><Download /></el-icon>
                一键下载全部
              </el-button>
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
                <el-button type="primary" size="small" @click="downloadFile(row)">
                  下载
                </el-button>
                <el-button type="danger" size="small" link @click="removeEncrypted($index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 解密 Tab -->
      <el-tab-pane label="文件解密" name="decrypt">
        <el-card shadow="never" class="upload-card">
          <el-upload
            drag
            multiple
            :auto-upload="false"
            :on-change="handleDecryptFileChange"
            :file-list="[]"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              拖拽加密文件到此处，或 <em>点击选择</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 .encrypted 文件，可多选
              </div>
            </template>
          </el-upload>

          <!-- 待解密文件列表 -->
          <div v-if="decryptFileList.length > 0" class="file-list">
            <el-divider>待解密文件 ({{ decryptFileList.length }})</el-divider>
            <el-table :data="decryptFileList" stripe size="small">
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
                    @click="removeDecryptFile($index)"
                  >
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="actions">
              <el-button
                type="success"
                @click="decryptFiles"
                :loading="isDecryptProcessing"
                :disabled="!cryptoStore.hasKey"
              >
                <el-icon><Unlock /></el-icon>
                开始解密
              </el-button>
              <el-button @click="clearDecryptFiles">清空</el-button>
            </div>
          </div>

          <!-- 解密进度条 -->
          <el-progress
            v-if="isDecryptProcessing"
            :percentage="decryptProgress"
            :stroke-width="10"
            style="margin-top: 20px"
          />
        </el-card>

        <!-- 解密结果 -->
        <el-card v-if="decryptedFiles.length > 0" shadow="never" class="result-card">
          <template #header>
            <div class="card-header">
              <div class="card-header-left">
                <el-icon><Document /></el-icon>
                <span>解密文件 ({{ decryptedFiles.length }})</span>
              </div>
              <el-button type="primary" size="small" @click="downloadAllDecrypted">
                <el-icon><Download /></el-icon>
                一键下载全部
              </el-button>
            </div>
          </template>

          <el-table :data="decryptedFiles" stripe>
            <el-table-column prop="name" label="文件名" />
            <el-table-column label="大小" width="120">
              <template #default="{ row }">
                {{ formatSize(row.size) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row, $index }">
                <el-button type="primary" size="small" @click="downloadFile(row)">
                  下载
                </el-button>
                <el-button type="danger" size="small" link @click="removeDecrypted($index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
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
  justify-content: space-between;
  gap: 8px;
  font-weight: bold;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-tabs {
  margin-top: 20px;
}

.upload-card,
.result-card,
.key-card {
  margin-bottom: 20px;
}

.key-import {
  display: flex;
  align-items: center;
  gap: 16px;
}

.key-import-text {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.key-import-text p {
  margin: 0;
  color: #e6a23c;
  font-weight: 500;
}

.key-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.key-status span {
  color: #67c23a;
  font-weight: 500;
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

::deep(.el-upload-dragger) {
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
