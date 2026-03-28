/**
 * Wasm 加密模块封装
 * 提供统一的加密、解密、密钥管理接口
 */

// Wasm 模块类型定义
interface WasmCrypto {
  generate_key(): Uint8Array
  encrypt(data: Uint8Array, key: Uint8Array): Uint8Array
  decrypt(encrypted: Uint8Array, key: Uint8Array): Uint8Array
  encrypt_string(plaintext: string, key: Uint8Array): string
  decrypt_string(ciphertext: string, key: Uint8Array): string
  key_to_hex(key: Uint8Array): string
  key_from_hex(hex_str: string): Uint8Array
  key_to_base64(key: Uint8Array): string
  key_from_base64(b64_str: string): Uint8Array
  sha256(data: Uint8Array): Uint8Array
  bytes_to_hex(bytes: Uint8Array): string
  hex_to_bytes(hex_str: string): Uint8Array
}

// 单例模式存储 Wasm 实例
let wasmInstance: WasmCrypto | null = null
let initPromise: Promise<void> | null = null

/**
 * 初始化 Wasm 模块
 */
export async function initWasm(): Promise<void> {
  if (wasmInstance) return
  if (initPromise) return initPromise

  initPromise = (async () => {
    const wasmModule = await import('../wasm/wasm_crypto.js')
    await wasmModule.default()
    wasmInstance = wasmModule as unknown as WasmCrypto
  })()

  return initPromise
}

/**
 * 确保 Wasm 已初始化
 */
function ensureWasm(): WasmCrypto {
  if (!wasmInstance) {
    throw new Error('Wasm module not initialized. Call initWasm() first.')
  }
  return wasmInstance
}

/**
 * 生成随机密钥
 * @returns Base64 编码的密钥字符串
 */
export function generateKey(): string {
  const wasm = ensureWasm()
  const key = wasm.generate_key()
  return wasm.key_to_base64(key)
}

/**
 * 加密文本
 * @param plaintext 明文
 * @param keyBase64 Base64 编码的密钥
 * @returns Base64 编码的密文
 */
export function encryptText(plaintext: string, keyBase64: string): string {
  const wasm = ensureWasm()
  const key = wasm.key_from_base64(keyBase64)
  return wasm.encrypt_string(plaintext, key)
}

/**
 * 解密文本
 * @param ciphertextBase64 Base64 编码的密文
 * @param keyBase64 Base64 编码的密钥
 * @returns 明文
 */
export function decryptText(ciphertextBase64: string, keyBase64: string): string {
  const wasm = ensureWasm()
  const key = wasm.key_from_base64(keyBase64)
  return wasm.decrypt_string(ciphertextBase64, key)
}

/**
 * 加密文件数据
 * @param data 文件数据
 * @param keyBase64 Base64 编码的密钥
 * @returns 加密后的数据
 */
export function encryptFile(data: Uint8Array, keyBase64: string): Uint8Array {
  const wasm = ensureWasm()
  const key = wasm.key_from_base64(keyBase64)
  return wasm.encrypt(data, key)
}

/**
 * 解密文件数据
 * @param encryptedData 加密的文件数据
 * @param keyBase64 Base64 编码的密钥
 * @returns 解密后的数据
 */
export function decryptFile(encryptedData: Uint8Array, keyBase64: string): Uint8Array {
  const wasm = ensureWasm()
  const key = wasm.key_from_base64(keyBase64)
  return wasm.decrypt(encryptedData, key)
}

/**
 * 计算 SHA-256 哈希
 * @param data 数据
 * @returns 十六进制哈希字符串
 */
export function hashSHA256(data: Uint8Array): string {
  const wasm = ensureWasm()
  const hash = wasm.sha256(data)
  return wasm.bytes_to_hex(hash)
}

/**
 * 密钥格式转换
 */
export const KeyFormat = {
  toHex(keyBase64: string): string {
    const wasm = ensureWasm()
    const key = wasm.key_from_base64(keyBase64)
    return wasm.key_to_hex(key)
  },
  toBase64(keyHex: string): string {
    const wasm = ensureWasm()
    const key = wasm.key_from_hex(keyHex)
    return wasm.key_to_base64(key)
  },
}

/**
 * 文件工具函数
 */
export const FileUtil = {
  /**
   * 将文件读取为 Uint8Array
   */
  readFileAsBytes(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer
        resolve(new Uint8Array(buffer))
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  },

  /**
   * 将文件读取为文本
   */
  readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve(reader.result as string)
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  },

  /**
   * 下载文件
   */
  downloadFile(data: Uint8Array, filename: string, mimeType: string = 'application/octet-stream') {
    // 创建新的 Uint8Array 副本以避免 SharedArrayBuffer 问题
    const dataArray = new Uint8Array(data)
    const blob = new Blob([dataArray], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  },

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  },
}
