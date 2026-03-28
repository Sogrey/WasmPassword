# wasm-crypto

WebAssembly 加密模块，为 WasmPassword 提供 AES-256-GCM 加解密功能。

## 概述

`wasm-crypto` 是一个用 Rust 编写的 WebAssembly 加密模块，提供：

- **AES-256-GCM 加密**：对称加密算法，安全性高
- **SHA-256 哈希**：数据完整性校验
- **密钥管理**：密钥生成、格式转换
- **零依赖后端**：纯前端运行，数据不出浏览器

## 环境依赖

### 必需

- **Rust** >= 1.70（推荐使用 Rustup 安装）
- **wasm-pack**：Rust 到 WebAssembly 的构建工具

### 安装 Rust

**Windows**：

1. 下载并安装 [rustup-init.exe](https://rustup.rs/)
2. 运行安装器，选择 `1) 默认安装`
3. 重启终端

**macOS / Linux**：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 安装 wasm-pack

```bash
cargo install wasm-pack
```

### 添加 Wasm 编译目标

```bash
rustup target add wasm32-unknown-unknown
```

## 项目结构

```
wasm-crypto/
├── src/
│   └── lib.rs          # 加解密核心逻辑
├── Cargo.toml          # 项目配置
├── Cargo.lock          # 依赖锁定文件
└── README.md           # 本文档
```

## 开发

### 克隆项目

```bash
cd e:\woekspace\WasmPassword\wasm-crypto
```

### 运行测试

```bash
cargo test
```

### 检查代码

```bash
cargo check
cargo clippy
```

## 编译

### 构建为 WebAssembly

```bash
# 构建并输出到指定目录
wasm-pack build --target web --out-dir ../src/wasm
```

### 构建选项

| 参数 | 说明 |
|------|------|
| `--target web` | 输出为 ES Module（适用于 Vite） |
| `--target nodejs` | 输出为 Node.js 模块 |
| `--target bundler` | 输出为打包器格式（Webpack/Rollup） |
| `--out-dir <dir>` | 指定输出目录 |
| `--release` | 发布模式（默认） |
| `--dev` | 开发模式（包含调试信息） |

### 构建产物

构建完成后，输出目录包含：

```
src/wasm/
├── wasm_crypto.js          # JavaScript 绑定
├── wasm_crypto.d.ts        # TypeScript 类型定义
├── wasm_crypto_bg.wasm     # WebAssembly 二进制
├── wasm_crypto_bg.wasm.d.ts
└── package.json
```

## API 文档

### 密钥管理

#### `generate_key(): Vec<u8>`

生成 32 字节（256 位）随机密钥。

```javascript
import init, { generate_key } from './wasm/wasm_crypto.js'

await init()
const key = generate_key()  // Uint8Array(32)
```

#### `key_to_hex(key: Uint8Array): string`

将密钥转换为十六进制字符串。

```javascript
const hexKey = key_to_hex(key)  // "a1b2c3d4..."
```

#### `key_from_hex(hex_str: string): Vec<u8>`

从十六进制字符串解析密钥。

```javascript
const key = key_from_hex("a1b2c3d4...")
```

#### `key_to_base64(key: Uint8Array): string`

将密钥转换为 Base64 字符串。

```javascript
const base64Key = key_to_base64(key)  // "obLD1A=="
```

#### `key_from_base64(b64_str: string): Vec<u8>`

从 Base64 字符串解析密钥。

```javascript
const key = key_from_base64("obLD1A==")
```

### 数据加密

#### `encrypt(data: Uint8Array, key: Uint8Array): Vec<u8>`

加密二进制数据。

**返回格式**：`nonce(12字节) + ciphertext`

```javascript
const data = new TextEncoder().encode('Hello, World!')
const encrypted = encrypt(data, key)  // Uint8Array
```

#### `decrypt(encrypted: Uint8Array, key: Uint8Array): Vec<u8>`

解密二进制数据。

**输入格式**：`nonce(12字节) + ciphertext`

```javascript
const decrypted = decrypt(encrypted, key)
const text = new TextDecoder().decode(decrypted)  // "Hello, World!"
```

### 字符串加密

#### `encrypt_string(plaintext: string, key: Uint8Array): string`

加密字符串，返回 Base64 编码的密文。

```javascript
const ciphertext = encrypt_string('Hello, World!', key)
// "A1B2C3D4E5F6..."
```

#### `decrypt_string(ciphertext: string, key: Uint8Array): string`

解密 Base64 编码的密文，返回明文字符串。

```javascript
const plaintext = decrypt_string(ciphertext, key)
// "Hello, World!"
```

### 哈希函数

#### `sha256(data: Uint8Array): Vec<u8>`

计算 SHA-256 哈希值。

```javascript
const data = new TextEncoder().encode('Hello, World!')
const hash = sha256(data)  // Uint8Array(32)
```

### 工具函数

#### `bytes_to_hex(bytes: Uint8Array): string`

将字节数组转换为十六进制字符串。

```javascript
const hex = bytes_to_hex(new Uint8Array([1, 2, 3]))
// "010203"
```

#### `hex_to_bytes(hex_str: string): Vec<u8>`

将十六进制字符串转换为字节数组。

```javascript
const bytes = hex_to_bytes("010203")
// Uint8Array [1, 2, 3]
```

## 使用示例

### 完整示例

```javascript
import init, {
  generate_key,
  encrypt_string,
  decrypt_string,
  key_to_base64,
  key_from_base64
} from './wasm/wasm_crypto.js'

async function main() {
  // 初始化 Wasm 模块
  await init()

  // 生成密钥
  const key = generate_key()
  const keyBase64 = key_to_base64(key)
  console.log('密钥:', keyBase64)

  // 加密
  const plaintext = 'Hello, WebAssembly!'
  const ciphertext = encrypt_string(plaintext, key)
  console.log('密文:', ciphertext)

  // 解密
  const decrypted = decrypt_string(ciphertext, key)
  console.log('明文:', decrypted)
}

main()
```

### 文件加密示例

```javascript
async function encryptFile(file, keyBase64) {
  await init()

  const key = key_from_base64(keyBase64)
  const fileData = new Uint8Array(await file.arrayBuffer())
  const encrypted = encrypt(fileData, key)

  // 下载加密文件
  const blob = new Blob([encrypted], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name + '.encrypted'
  a.click()
  URL.revokeObjectURL(url)
}
```

## 错误处理

所有可能失败的函数返回 `Result<T, JsValue>`，在 JavaScript 中会抛出异常：

```javascript
try {
  const decrypted = decrypt_string(ciphertext, key)
} catch (error) {
  console.error('解密失败:', error)
}
```

常见错误：

| 错误信息 | 原因 |
|---------|------|
| `Key must be 32 bytes (256 bits)` | 密钥长度不正确 |
| `Invalid encrypted data: too short` | 加密数据格式错误 |
| `Base64 decode error` | Base64 编码格式错误 |
| `UTF-8 decode error` | 解密后数据不是有效的 UTF-8 |

## 性能优化

### 发布模式

`Cargo.toml` 中已配置优化选项：

```toml
[profile.release]
opt-level = "s"      # 优化文件大小
lto = true           # 链接时优化

[package.metadata.wasm-pack.profile.release]
wasm-opt = false     # 禁用 wasm-opt（避免下载 binaryen）
```

### 文件大小

当前 Wasm 模块大小约 **122 KB**（未压缩），gzip 后约 **47 KB**。

### 进一步优化

如需更小的文件大小：

```bash
# 安装 wasm-opt
cargo install wasm-opt

# 启用 wasm-opt
# 移除 Cargo.toml 中的 wasm-opt = false

# 重新构建
wasm-pack build --target web
```

## 安全说明

### 加密算法

- **AES-256-GCM**：NIST 推荐的认证加密算法
- **随机数生成**：使用 `rand` crate 的 CSPRNG
- **Nonce**：每次加密生成随机 12 字节 nonce

### 密钥管理

- 密钥由用户本地生成，不传输到服务器
- 密钥应安全存储（如 Keychain、加密存储）
- 不要在 URL、日志中暴露密钥

### 数据格式

加密数据格式：`nonce(12字节) + ciphertext + tag(16字节)`

```
+--------+------------------+------+
| Nonce  | Ciphertext       | Tag  |
| 12 B   | Variable length  | 16 B |
+--------+------------------+------+
```

## 依赖说明

| 依赖 | 版本 | 用途 |
|------|------|------|
| `wasm-bindgen` | 0.2 | WebAssembly 绑定 |
| `aes-gcm` | 0.10 | AES-256-GCM 加密 |
| `sha2` | 0.10 | SHA-256 哈希 |
| `rand` | 0.8 | 随机数生成 |
| `getrandom` | 0.2 | 随机数源（支持浏览器） |
| `base64` | 0.22 | Base64 编解码 |
| `hex` | 0.4 | 十六进制编解码 |
| `serde` | 1.0 | 序列化 |
| `web-sys` | 0.3 | Web API |

## 测试

### 单元测试

```bash
cargo test
```

### 测试覆盖

```bash
cargo tarpaulin --ignore-tests
```

### Wasm 测试

```bash
wasm-pack test --headless --firefox
```

## 故障排除

### `wasm32-unknown-unknown target not found`

**解决方法**：

```bash
rustup target add wasm32-unknown-unknown
```

### `linker 'link.exe' not found`

**解决方法**：

安装 Visual Studio Build Tools，选择：
- MSVC v143 - VS 2022 C++ x64/x86 生成工具
- Windows 10/11 SDK

### `failed to download binaryen`

**解决方法**：

已在 `Cargo.toml` 中禁用 `wasm-opt`。

## 许可证

MIT License

## 相关链接

- [WasmPassword 主项目](../README.md)
- [WebAssembly 官方文档](https://webassembly.org/)
- [wasm-pack 指南](https://rustwasm.github.io/wasm-pack/)
- [AES-GCM 规范](https://datatracker.ietf.org/doc/html/rfc5116)
