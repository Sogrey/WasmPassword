# WasmPassword - 数字资产加解密工具

基于 WebAssembly 的数字资产加解密工具，实现数据不出浏览器的隐私计算方案。

## 功能特性

- **密码加密**：密码的加密存储与管理
- **文件加密**：支持文本、图片、视频及其他类型文件的加密
- **Wasm 加密引擎**：通过 WebAssembly 完成高性能加解密运算
- **本地优先**：数据不出浏览器，符合隐私合规要求
- **密钥管理**：生成、导入、导出 AES-256 密钥
- **响应式设计**：完美适配 PC 和移动端

## 技术栈

| 类别 | 技术方案 |
|------|---------|
| 前端框架 | Vue 3.5 + TypeScript |
| 状态管理 | Pinia |
| 路由 | Vue Router 5 |
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
3. 支持导出/导入密钥文件
4. 复制加密结果到剪贴板

### 文件加密

1. 拖拽或选择文件上传
2. 支持批量加密多个文件
3. 下载加密文件（自动添加 .encrypted 后缀）
4. 拖拽加密文件自动解密并下载

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

## License

MIT
