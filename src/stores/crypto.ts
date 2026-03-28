import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as crypto from '@/utils/crypto'

export const useCryptoStore = defineStore('crypto', () => {
  // 密钥状态
  const currentKey = ref<string>('')
  const keyHistory = ref<string[]>([])

  // Wasm 初始化状态
  const isInitialized = ref(false)
  const isLoading = ref(false)
  const initError = ref<string | null>(null)

  // 计算属性
  const hasKey = computed(() => !!currentKey.value)

  /**
   * 初始化 Wasm 模块
   */
  async function init() {
    if (isInitialized.value) return
    if (isLoading.value) return

    isLoading.value = true
    initError.value = null

    try {
      await crypto.initWasm()
      isInitialized.value = true
      // 从 localStorage 恢复密钥历史
      const saved = localStorage.getItem('keyHistory')
      if (saved) {
        keyHistory.value = JSON.parse(saved)
      }
    } catch (error) {
      initError.value = error instanceof Error ? error.message : 'Wasm 初始化失败'
      console.error('Wasm init error:', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 生成新密钥
   */
  function generateNewKey(): string {
    const key = crypto.generateKey()
    currentKey.value = key
    // 添加到历史记录（最多保存 10 个）
    if (!keyHistory.value.includes(key)) {
      keyHistory.value.unshift(key)
      if (keyHistory.value.length > 10) {
        keyHistory.value.pop()
      }
      localStorage.setItem('keyHistory', JSON.stringify(keyHistory.value))
    }
    return key
  }

  /**
   * 设置当前密钥
   */
  function setKey(key: string) {
    currentKey.value = key
  }

  /**
   * 加密文本
   */
  function encryptText(plaintext: string): string {
    if (!currentKey.value) throw new Error('请先生成或导入密钥')
    return crypto.encryptText(plaintext, currentKey.value)
  }

  /**
   * 解密文本
   */
  function decryptText(ciphertext: string): string {
    if (!currentKey.value) throw new Error('请先选择密钥')
    return crypto.decryptText(ciphertext, currentKey.value)
  }

  /**
   * 加密文件
   */
  async function encryptFile(file: File): Promise<{ data: Uint8Array; hash: string }> {
    if (!currentKey.value) throw new Error('请先生成或导入密钥')
    const data = await crypto.FileUtil.readFileAsBytes(file)
    const hash = crypto.hashSHA256(data)
    const encrypted = crypto.encryptFile(data, currentKey.value)
    return { data: encrypted, hash }
  }

  /**
   * 解密文件
   */
  async function decryptFile(encryptedData: Uint8Array): Promise<Uint8Array> {
    if (!currentKey.value) throw new Error('请先选择密钥')
    return crypto.decryptFile(encryptedData, currentKey.value)
  }

  /**
   * 清除当前密钥
   */
  function clearKey() {
    currentKey.value = ''
  }

  /**
   * 清除历史密钥
   */
  function clearHistory() {
    keyHistory.value = []
    localStorage.removeItem('keyHistory')
  }

  return {
    // 状态
    currentKey,
    keyHistory,
    isInitialized,
    isLoading,
    initError,
    hasKey,

    // 方法
    init,
    generateNewKey,
    setKey,
    encryptText,
    decryptText,
    encryptFile,
    decryptFile,
    clearKey,
    clearHistory,
  }
})
