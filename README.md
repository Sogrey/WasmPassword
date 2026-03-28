# WasmPassword - 数字资产加解密工具

基于 WebAssembly 的数字资产加解密工具，实现数据不出浏览器的隐私计算方案。

## 在线演示

**GitHub Pages**: http://sogrey.top/WasmPassword

## 功能特性

- **密码加密**：密码的加密存储与管理
- **文件加密**：支持文本、图片、视频及其他类型文件的加密
- **文件解密**：支持批量解密，Tab 页切换加解密功能
- **Wasm 加密引擎**：通过 WebAssembly 完成高性能加解密运算
- **本地优先**：数据不出浏览器，符合隐私合规要求
- **密钥管理**：生成、导入、导出 AES-256 密钥
- **批量操作**：支持批量加解密，一键下载全部文件
- **响应式设计**：完美适配 PC 和移动端
- **Hash 路由**：解决刷新 404 问题，支持子路由直接访问

## 技术栈

| 类别 | 技术方案 |
|------|---------|
| 前端框架 | Vue 3.5 + TypeScript |
| 状态管理 | Pinia |
| 路由 | Vue Router 5 (Hash 模式) |
| 构建工具 | Vite 7.3 |
| Wasm 方案 | Rust + wasm-pack |
| 加密算法 | AES-256-GCM |
| UI 框架 | Element Plus |

## 快速开始

### 前置要求

- Node.js >= 22.12.0
- Rust + wasm-pack（如需重新编译 Wasm 模块）
- Visual Studio Build Tools（Windows）

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173

### 可用脚本

| 脚本 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 完整构建（环境检查 → Wasm → Vue） |
| `pnpm build:wasm` | 仅构建 Wasm 模块 |
| `pnpm check:wasm` | 检查 Wasm 构建环境 |

### 生产构建

执行完整构建：

```bash
pnpm build
```

**构建流程**：

```
> run-s build:wasm type-check "build-only {@}" --

> check:wasm                                    # 1. 环境检查
🔍 检查 Wasm 构建环境...
✅ rustup: rustup 1.29.0
✅ wasm32-unknown-unknown target: installed
✅ wasm-pack: wasm-pack 0.14.0
✅ 环境检查通过

> wasm-pack build --target web --out-dir ../src/wasm  # 2. 构建 Wasm
[INFO]: Compiling to Wasm...
[INFO]: :-) Your wasm pkg is ready to publish at src/wasm

> vue-tsc --build                               # 3. 类型检查

> vite build                                    # 4. 构建 Vue
✓ 1617 modules transformed.
dist/assets/wasm_crypto_bg-*.wasm    122.50 kB │ gzip: 47.11 kB
dist/assets/index-*.css              355.23 kB │ gzip: 48.00 kB
dist/assets/index-*.js             1,144.97 kB │ gzip: 368.65 kB
✓ built in 5.59s
```

**构建产物**：`dist/` 目录

### GitHub Pages 部署

项目已配置 GitHub Actions 自动部署：

1. 推送到 `main` 分支自动触发
2. 自动构建 Wasm 模块
3. 自动部署到 GitHub Pages

**设置 GitHub Pages**：
- 进入仓库 Settings → Pages
- Source 选择 `GitHub Actions`

**仓库地址**：https://github.com/Sogrey/WasmPassword

## 项目结构

```
WasmPassword/
├── src/
│   ├── views/              # 页面组件
│   │   ├── Home.vue        # 首页
│   │   ├── Password.vue    # 密码加密
│   │   └── FileEncrypt.vue # 文件加密
│   ├── components/         # 通用组件
│   ├── stores/             # Pinia 状态管理
│   │   └── crypto.ts
│   ├── utils/              # 工具函数
│   │   └── crypto.ts       # Wasm 工具封装
│   ├── wasm/               # Wasm 模块（构建产物）
│   ├── router/             # 路由配置
│   ├── App.vue
│   └── main.ts
├── wasm-crypto/            # Rust Wasm 源码
│   ├── src/
│   │   └── lib.rs          # 加解密核心逻辑
│   ├── Cargo.toml
│   └── pkg/                # wasm-pack 构建输出
├── public/
├── DEVELOPMENT.md          # 开发文档
└── package.json
```

## 功能说明

### 密码加密

1. 生成 AES-256 密钥
2. 输入明文，点击加密生成密文
3. 支持导出/导入密钥文件（.key 格式）
4. 复制加密结果到剪贴板
5. 密钥显示/隐藏切换

### 文件加密/解密

使用 Tab 页分隔加密和解密功能：

**文件加密**：
1. 拖拽或选择文件上传（支持多选）
2. 查看待加密文件列表
3. 批量加密，自动添加 .encrypted 后缀
4. 一键下载全部加密文件

**文件解密**：
1. 拖拽或选择加密文件上传（支持多选）
2. 查看待解密文件列表
3. 批量解密，自动移除 .encrypted 后缀
4. 一键下载全部解密文件

**密钥导入**：
- 文件加密页面支持直接导入密钥文件
- 无需返回密码加密页面即可开始使用

## 安全说明

- **密钥管理**：密钥由用户本地生成，不传输到服务器
- **加密算法**：使用 AES-256-GCM，安全性高
- **数据存储**：所有数据仅存储在用户本地
- **无后端依赖**：纯前端应用，无需服务器

## 响应式设计

项目完美适配 PC 和移动端：

- **PC 端**：顶部水平导航，双栏布局
- **移动端**：汉堡菜单导航，单栏堆叠布局
- **断点**：768px（平板）、480px（手机）
- **触摸优化**：移动端去除 hover 效果，提升触摸体验

## 路由说明

使用 Hash 模式路由，URL 格式为 `http://sogrey.top/WasmPassword/#/path`：

- `/` - 首页
- `/#/password` - 密码加密
- `/#/file` - 文件加密

> 使用 Hash 模式解决 GitHub Pages 刷新子路由 404 的问题

## 开发环境搭建

详细的环境搭建指南请参考 [DEVELOPMENT.md](./DEVELOPMENT.md)，包含：

- 环境检查清单
- 安装步骤
- 常见问题解答

## IDE 推荐

[VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 参考资料

- [WebAssembly 官方文档](https://webassembly.org/)
- [wasm-pack 指南](https://rustwasm.github.io/wasm-pack/)
- [Rust Crypto 库](https://github.com/RustCrypto)
- [Vite Wasm 支持](https://vitejs.dev/guide/features.html#webassembly)

## 更新日志

### v1.1.0 (2026-03-28)

**新增功能**：
- ✅ Tab 页分隔文件加密/解密功能
- ✅ 批量文件解密支持
- ✅ 一键下载全部文件按钮
- ✅ 文件加密页面直接导入密钥
- ✅ Wasm 环境检查脚本（`pnpm check:wasm`）
- ✅ 构建流程优化（环境检查 → Wasm → Vue）

**改进**：
- ✅ 统一密钥文件格式为 .key
- ✅ 支持纯密钥和带格式密钥文件导入
- ✅ 页面初始化时自动加载 Wasm 模块

### v1.0.0 (2026-03-28)

**新增功能**：
- ✅ AES-256-GCM 加密算法实现
- ✅ 密码加密页面
- ✅ 文件加密页面
- ✅ 密钥生成、导入、导出
- ✅ 响应式设计（PC/移动端）
- ✅ GitHub Actions CI/CD 自动部署

**Bug 修复**：
- ✅ 修复 TypeScript 类型错误
- ✅ 修复导入密钥文件错误
- ✅ 修复刷新子路由 404 问题
- ✅ 修复 @tsconfig/node24 兼容性问题

## License

MIT
