# WasmPassword - 数字资产加解密工具

## 项目概述

基于 WebAssembly 的数字资产加解密工具，实现数据不出浏览器的隐私计算方案。

### 核心功能

- **密码加密**：密码的加密存储与管理
- **文件加密**：支持文本、图片、视频及其他类型文件的加密
- **Wasm 加密引擎**：通过 WebAssembly 完成高性能加解密运算
- **本地优先**：数据不出浏览器，符合隐私合规要求

---

## 技术选型

| 类别 | 技术方案 | 说明 |
|------|---------|------|
| **前端框架** | Vue 3.5 + TypeScript | 已初始化 |
| **状态管理** | Pinia | 已安装 |
| **路由** | Vue Router 5 | 已安装 |
| **构建工具** | Vite 7.3 | 原生支持 .wasm |
| **Wasm 方案** | Rust + wasm-pack | 生态最成熟 |
| **加密算法** | AES-256-GCM / ChaCha20-Poly1305 | 安全性高 |
| **UI 框架** | Element Plus | 已安装 |

---

## 环境检查清单

### ✅ 已安装

- [x] Node.js v22.22.1（要求 >=22.12.0）
- [x] npm 10.9.4
- [x] Vue 3.5.30
- [x] Vite 7.3.1
- [x] TypeScript 5.9.3
- [x] Pinia 3.0.4
- [x] Vue Router 5.0.3

### ✅ 已安装（Wasm 工具链）

- [x] **Rust** - 编译 Wasm 模块
- [x] **wasm-pack** - Rust 到 Wasm 的构建工具

### ✅ 已安装（前端依赖）

- [x] **Element Plus** - UI 组件库
- [x] **@element-plus/icons-vue** - 图标库

---

## 当前项目状态

**✅ 基础功能已完成**

- [x] Wasm 加密模块（AES-256-GCM）
- [x] 密钥生成与管理
- [x] 密码加密页面
- [x] 文件加密页面
- [x] 首页导航

**⏳ 待优化**

- [ ] Web Worker 支持（大文件加密不阻塞 UI）
- [ ] 大文件分块加密
- [ ] 加密进度显示优化
- [ ] 单元测试
- [ ] 生产环境配置

---

## 环境安装指南

### 1. 安装 Rust（Rustup 版本 - 必选）

> ⚠️ **重要**：Wasm 开发必须使用 **Rustup** 版本，不能使用 winget 安装的 `Rustlang.Rust.MSVC`！

**Windows 系统**：

1. 下载 Rustup 安装程序：
   - 官网：https://rustup.rs/
   - 直接下载：https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe

2. 运行 `rustup-init.exe`，选择 `1) 默认安装`

3. 安装 Wasm 编译目标：
   ```powershell
   rustup target add wasm32-unknown-unknown
   ```

4. 验证安装：
   ```powershell
   rustc --version
   cargo --version
   rustup --version
   ```

### 2. 安装 wasm-pack

```bash
cargo install wasm-pack
```

验证安装：
```bash
wasm-pack --version
```

### 3. 安装前端依赖

```bash
npm install
```

---

## 项目结构规划

```
WasmPassword/
├── src/
│   ├── views/              # 页面组件
│   │   ├── Home.vue        # 首页
│   │   ├── Password.vue    # 密码加密
│   │   ├── FileEncrypt.vue # 文件加密
│   │   └── Settings.vue    # 设置页
│   ├── components/         # 通用组件
│   │   ├── EncryptPanel.vue
│   │   ├── FileDrop.vue
│   │   └── ResultDisplay.vue
│   ├── stores/             # Pinia 状态管理
│   │   └── crypto.ts
│   ├── utils/              # 工具函数
│   │   └── helpers.ts
│   ├── wasm/               # Wasm 模块（构建产物）
│   │   └── crypto_wasm.js
│   ├── router/             # 路由配置
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── wasm-crypto/            # Rust Wasm 源码
│   ├── src/
│   │   └── lib.rs          # 加解密核心逻辑
│   ├── Cargo.toml
│   └── pkg/                # wasm-pack 构建输出
├── public/
├── DEVELOPMENT.md          # 本文档
└── package.json
```

---

## 开发计划

### 阶段一：环境搭建与基础架构（Day 1）✅ 已完成

- [x] 安装 Rust 和 wasm-pack
- [x] 创建 Rust Wasm 项目（wasm-crypto）
- [x] 实现基础加解密函数（AES-256-GCM）
- [x] 配置 Vite 支持 Wasm 模块
- [x] 安装 UI 框架（Element Plus）

### 阶段二：密码加密功能（Day 2-3）✅ 已完成

- [x] 设计密码加密界面
- [x] 实现密码输入、加密、解密流程
- [x] 实现加密结果导出（文本/文件）
- [x] 添加密钥管理功能

### 阶段三：文件加密功能（Day 4-5）✅ 已完成

- [x] 实现文件拖拽上传
- [x] 支持文件加密
- [x] 实现文件加密/解密下载
- [x] 支持多种文件类型

### 阶段四：优化与完善（Day 6-7）

- [ ] 性能优化（Web Worker 支持）
- [ ] 大文件分块加密
- [ ] 错误处理与用户提示完善
- [ ] 单元测试
- [ ] 文档完善

---

## Wasm 加解密 API 设计

```typescript
// wasm-crypto/src/lib.rs 暴露的接口

// 初始化 Wasm 模块
export function init(): Promise<void>;

// 生成随机密钥
export function generate_key(): Uint8Array;

// 加密数据
export function encrypt(data: Uint8Array, key: Uint8Array): Uint8Array;

// 解密数据
export function decrypt(encrypted: Uint8Array, key: Uint8Array): Uint8Array;

// 加密字符串
export function encrypt_string(plaintext: string, key: Uint8Array): string;

// 解密字符串
export function decrypt_string(ciphertext: string, key: Uint8Array): string;
```

---

## 安全考虑

1. **密钥管理**：密钥由用户本地生成，不传输到服务器
2. **加密算法**：使用 AES-256-GCM 或 ChaCha20-Poly1305
3. **数据存储**：所有数据仅存储在用户本地（IndexedDB / localStorage）
4. **无后端依赖**：纯前端应用，无需服务器

---

## 快速开始

### 前置要求

- Node.js >= 22.12.0
- Rust + wasm-pack（如需重新编译 Wasm 模块）
- Visual Studio Build Tools（Windows）

### 安装与运行

```bash
# 1. 安装前端依赖
npm install

# 2. 启动开发服务器
npm run dev
# 访问 http://localhost:5173
```

### 重新构建 Wasm 模块（可选）

如果修改了 `wasm-crypto/src/lib.rs`，需要重新构建：

```bash
cd wasm-crypto
wasm-pack build --target web --out-dir ../src/wasm
```

### 生产构建

```bash
npm run build
```

---

## 功能说明

### 1. 密码加密（/password）

- **生成密钥**：点击"生成新密钥"创建 AES-256 密钥
- **导出密钥**：将密钥保存为文件，方便备份
- **导入密钥**：从文件导入已有密钥
- **加密文本**：输入明文，点击加密生成密文
- **解密文本**：输入密文，点击解密还原明文

### 2. 文件加密（/file）

- **拖拽上传**：支持拖拽或点击选择文件
- **批量加密**：可同时加密多个文件
- **下载加密文件**：加密后自动生成 `.encrypted` 后缀
- **解密文件**：拖拽加密文件自动解密并下载

---

## 参考资料

- [WebAssembly 官方文档](https://webassembly.org/)
- [wasm-pack 指南](https://rustwasm.github.io/wasm-pack/)
- [Rust Crypto 库](https://github.com/RustCrypto)
- [Vite Wasm 支持](https://vitejs.dev/guide/features.html#webassembly)

---

## 常见问题（QA）

### Q1: winget 安装 Rust 时网络错误 / 安装了错误版本

**问题描述**：

```powershell
winget install Rustlang.Rust.MSVC
# 报错：WinHttpSendRequest: 12029: 无法与服务器建立连接
# 0x80072efd : unknown error
```

> ⚠️ **注意**：通过 winget 安装的 `Rustlang.Rust.MSVC` 是 **非 Rustup 版本**，不支持 Wasm 开发！

**正确安装方法**：

**必须使用 Rustup 安装**（Wasm 开发必选）：
```powershell
# 方式一：下载 rustup-init.exe
# https://rustup.rs/
# 或直接下载：https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe

# 方式二：通过 winget 安装 Rustup（不是 Rustlang.Rust.MSVC）
winget install Rustlang.Rustup
```

运行安装器后，选择 `1) 默认安装` 即可。

---

### Q2: cargo install wasm-pack 报错 "linker `link.exe` not found"

**问题描述**：

```text
error: linker `link.exe` not found
  = note: program not found
note: the msvc targets depend on the msvc linker but `link.exe` was not found
note: please ensure that Visual Studio 2017 or later, or Build Tools for Visual Studio were installed with the Visual C++ option.
```

**原因**：Rust 在 Windows 上默认使用 MSVC 工具链，需要 Visual Studio 的 C++ 构建工具。

**解决方法**：

1. 下载 Visual Studio Build Tools：
   - https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - 或直接下载：https://aka.ms/vs/17/release/vs_BuildTools.exe

2. 运行安装器，勾选以下组件：
   - **MSVC v143 - VS 2022 C++ x64/x86 生成工具**
   - **Windows 10 SDK** 或 **Windows 11 SDK**

3. 安装完成后，**重启终端**，重新执行：
   ```powershell
   cargo install wasm-pack
   ```

> 💡 **提示**：Build Tools 是 Visual Studio 的轻量版本，仅包含编译工具，不包含 IDE，体积约 6-8 GB。

---

### Q3: 安装完成后 cargo 命令找不到

**问题描述**：

```powershell
cargo : 无法将"cargo"项识别为 cmdlet、函数、脚本文件或可运行程序的名称。
```

**解决方法**：

关闭当前终端窗口，重新打开新终端，环境变量即可生效。Rust 安装后会自动添加到 PATH。

验证安装：
```powershell
rustc --version
cargo --version
wasm-pack --version
rustup --version  # 确认 rustup 已安装
```

---

### Q4: wasm-pack build 报错 "wasm32-unknown-unknown target not found"

**问题描述**：

```text
Error: wasm32-unknown-unknown target not found in sysroot
It looks like Rustup is not being used. For non-Rustup setups, the wasm32-unknown-unknown target needs to be installed manually.
```

**原因**：

通过 `winget install Rustlang.Rust.MSVC` 安装的是 **非 Rustup 版本**，不包含 Wasm 编译目标管理功能。

> ⚠️ **重要**：开发 Wasm 项目必须使用 **Rustup** 版本的 Rust！

**解决方法**：

1. **卸载当前 Rust**（可选但推荐）：
   ```powershell
   winget uninstall Rustlang.Rust.MSVC
   ```

2. **安装 Rustup**（标准 Rust 工具链管理器）：
   - 下载：https://rustup.rs/
   - 或直接下载：https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe
   - 运行安装器，选择 `1) 默认安装`

3. **添加 Wasm 编译目标**：
   ```powershell
   # 重启终端后执行
   rustup target add wasm32-unknown-unknown
   ```

4. **验证安装**：
   ```powershell
   rustup show
   # 应显示：installed targets for active toolchain
   #         wasm32-unknown-unknown
   ```

5. **重新构建 Wasm 模块**：
   ```powershell
   cd wasm-crypto
   wasm-pack build --target web --out-dir ../src/wasm
   ```

> 💡 **提示**：Rustup 是 Rust 官方工具链管理器，可以轻松切换 Rust 版本和添加编译目标（如 Wasm、Android、iOS 等）。

---

### Q5: wasm-pack 下载 binaryen 失败

**问题描述**：

```text
Error: failed to download from https://github.com/WebAssembly/binaryen/releases/download/version_117/binaryen-version_117-x86_64-windows.tar.gz
```

**解决方法**：

禁用 `wasm-opt`（非必需优化工具），在 `Cargo.toml` 中添加：

```toml
[package.metadata.wasm-pack.profile.release]
wasm-opt = false
```

---

## 更新日志

### 2026-03-28

**已完成**：
- ✅ 项目初始化与环境搭建
- ✅ Rust Wasm 模块开发（AES-256-GCM 加密）
- ✅ Vue 3 项目结构搭建
- ✅ Element Plus UI 集成
- ✅ 密码加密页面（密钥管理、文本加解密）
- ✅ 文件加密页面（文件上传、加密下载、解密下载）
- ✅ 开发文档完善
- ✅ **响应式适配**（PC/移动端）

**响应式设计要点**：
- 移动端汉堡菜单导航
- 弹性布局（Flexbox）
- 媒体查询断点：768px、480px
- 触摸设备优化（去除 hover 效果）
- 移动端字体大小调整

**待优化**：
- ⏳ Web Worker 支持
- ⏳ 大文件分块加密
- ⏳ 单元测试

---

## 项目截图

启动开发服务器后访问 http://localhost:5173 查看：

1. **首页**：功能导航，技术栈展示
2. **密码加密**：密钥生成、文本加解密
3. **文件加密**：文件上传、批量加密、解密下载
