<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCryptoStore } from '@/stores/crypto'
import { ElMessage } from 'element-plus'
import { FileUtil } from '@/utils/crypto'

const cryptoStore = useCryptoStore()

// 初始化 Wasm 模块
onMounted(async () => {
  await cryptoStore.init()
})

const plaintext = ref('')
const ciphertext = ref('')
const decryptedText = ref('')
const showDecrypted = ref(false)

// 密钥显示控制
const showKey = ref(false)

// 密钥显示值（部分隐藏）
const displayKey = computed(() => {
  if (!cryptoStore.currentKey) return ''
  if (showKey.value) return cryptoStore.currentKey
  const key = cryptoStore.currentKey
  return key.substring(0, 8) + '****' + key.substring(key.length - 8)
})

// 生成新密钥
function generateKey() {
  cryptoStore.generateNewKey()
  ElMessage.success('密钥已生成')
}

// 加密
function encrypt() {
  if (!plaintext.value) {
    ElMessage.warning('请输入要加密的文本')
    return
  }
  if (!cryptoStore.hasKey) {
    ElMessage.warning('请先生成密钥')
    return
  }
  try {
    ciphertext.value = cryptoStore.encryptText(plaintext.value)
    ElMessage.success('加密成功')
  } catch (error) {
    ElMessage.error('加密失败')
    console.error(error)
  }
}

// 解密
function decrypt() {
  if (!ciphertext.value) {
    ElMessage.warning('请输入要解密的密文')
    return
  }
  if (!cryptoStore.hasKey) {
    ElMessage.warning('请先选择密钥')
    return
  }
  try {
    decryptedText.value = cryptoStore.decryptText(ciphertext.value)
    showDecrypted.value = true
    ElMessage.success('解密成功')
  } catch (error) {
    ElMessage.error('解密失败，请检查密钥是否正确')
    console.error(error)
  }
}

// 复制到剪贴板
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败')
  }
}

// 导出密钥文件
function exportKey() {
  if (!cryptoStore.currentKey) {
    ElMessage.warning('没有可导出的密钥')
    return
  }
  // 只导出纯密钥，方便导入
  const data = new TextEncoder().encode(cryptoStore.currentKey)
  FileUtil.downloadFile(data, 'wasm-password-key.key', 'text/plain')
  ElMessage.success('密钥文件已下载')
}

// 从文件导入密钥
async function importKey(uploadFile: any) {
  const file = uploadFile?.raw
  if (!file) return

  try {
    const content = await FileUtil.readFileAsText(file)
    // 支持两种格式：纯密钥 或 带格式的密钥文件
    let key = content.trim()
    const match = content.match(/Key:\s*(.+)/)
    if (match && match[1]) {
      key = match[1].trim()
    }
    cryptoStore.setKey(key)
    ElMessage.success('密钥已导入')
  } catch {
    ElMessage.error('无效的密钥文件格式')
  }
  return false
}

// 清空
function clearAll() {
  plaintext.value = ''
  ciphertext.value = ''
  decryptedText.value = ''
  showDecrypted.value = false
}
</script>

<template>
  <div class="password-page">
    <el-page-header @back="$router.push('/')">
      <template #content>
        <span class="text-large font-600 mr-3">密码加密</span>
      </template>
    </el-page-header>

    <el-divider />

    <!-- 密钥管理 -->
    <el-card class="key-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><Key /></el-icon>
          <span>密钥管理</span>
        </div>
      </template>

      <div class="key-actions">
        <el-button type="primary" @click="generateKey">
          <el-icon><Plus /></el-icon>
          生成新密钥
        </el-button>

        <el-button @click="exportKey" :disabled="!cryptoStore.hasKey">
          <el-icon><Download /></el-icon>
          导出密钥
        </el-button>

        <el-upload
          :show-file-list="false"
          :auto-upload="false"
          accept=".key,.txt"
          :on-change="importKey"
        >
          <el-button>
            <el-icon><Upload /></el-icon>
            导入密钥
          </el-button>
        </el-upload>
      </div>

      <div v-if="cryptoStore.hasKey" class="current-key">
        <span class="key-label">当前密钥：</span>
        <el-input
          :model-value="displayKey"
          readonly
          class="key-input"
        >
          <template #suffix>
            <el-icon
              class="cursor-pointer"
              @click="showKey = !showKey"
            >
              <View v-if="!showKey" />
              <Hide v-else />
            </el-icon>
            <el-icon
              class="cursor-pointer"
              @click="copyToClipboard(cryptoStore.currentKey)"
            >
              <CopyDocument />
            </el-icon>
          </template>
        </el-input>
      </div>
    </el-card>

    <!-- 加解密操作 -->
    <el-row :gutter="20" class="encrypt-section">
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <el-icon><Edit /></el-icon>
              <span>明文</span>
            </div>
          </template>

          <el-input
            v-model="plaintext"
            type="textarea"
            :rows="6"
            placeholder="输入要加密的文本..."
          />

          <div class="actions">
            <el-button type="primary" @click="encrypt" :disabled="!cryptoStore.hasKey">
              <el-icon><Lock /></el-icon>
              加密
            </el-button>
            <el-button @click="plaintext = ''">清空</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <el-icon><Document /></el-icon>
              <span>密文</span>
            </div>
          </template>

          <el-input
            v-model="ciphertext"
            type="textarea"
            :rows="6"
            placeholder="输入要解密的密文，或查看加密结果..."
          />

          <div class="actions">
            <el-button type="success" @click="decrypt" :disabled="!cryptoStore.hasKey">
              <el-icon><Unlock /></el-icon>
              解密
            </el-button>
            <el-button @click="copyToClipboard(ciphertext)" :disabled="!ciphertext">
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 解密结果 -->
    <el-card v-if="showDecrypted" class="result-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><CircleCheck /></el-icon>
          <span>解密结果</span>
        </div>
      </template>

      <el-input
        v-model="decryptedText"
        type="textarea"
        :rows="4"
        readonly
      />

      <div class="actions">
        <el-button @click="copyToClipboard(decryptedText)">
          <el-icon><CopyDocument /></el-icon>
          复制结果
        </el-button>
      </div>
    </el-card>

    <!-- 操作按钮 -->
    <div class="bottom-actions">
      <el-button @click="clearAll">清空全部</el-button>
    </div>
  </div>
</template>

<style scoped>
.password-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.key-card {
  margin-bottom: 20px;
}

.key-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.current-key {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.key-label {
  flex-shrink: 0;
}

.key-input {
  flex: 1;
  min-width: 0;
}

.encrypt-section {
  margin-bottom: 20px;
}

.actions {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.result-card {
  margin-bottom: 20px;
}

.bottom-actions {
  text-align: center;
  margin-top: 20px;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  color: #409EFF;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .password-page {
    padding: 16px;
  }

  .key-actions {
    gap: 8px;
  }

  .key-actions .el-button {
    flex: 1;
    min-width: 100px;
  }

  .current-key {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .key-input {
    width: 100%;
  }

  .encrypt-section .el-col {
    margin-bottom: 16px;
  }
}

@media (max-width: 480px) {
  .password-page {
    padding: 12px;
  }

  .card-header {
    font-size: 0.95rem;
  }

  .key-actions .el-button {
    font-size: 0.9rem;
    padding: 8px 12px;
  }
}
</style>
