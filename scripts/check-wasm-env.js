#!/usr/bin/env node

import { execSync } from 'child_process'

const isWindows = process.platform === 'win32'

function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] })
  } catch {
    return null
  }
}

const checks = [
  {
    name: 'rustup',
    check: () => runCommand('rustup --version'),
    hint: '请安装 Rust: https://rustup.rs',
  },
  {
    name: 'wasm32-unknown-unknown target',
    check: () => {
      const output = runCommand('rustup target list --installed')
      if (output && output.includes('wasm32-unknown-unknown')) {
        return 'installed'
      }
      return null
    },
    hint: '请运行: rustup target add wasm32-unknown-unknown',
  },
  {
    name: 'wasm-pack',
    check: () => runCommand('wasm-pack --version'),
    hint: '请安装 wasm-pack: cargo install wasm-pack',
  },
]

let hasError = false

console.log('🔍 检查 Wasm 构建环境...\n')

for (const { name, check, hint } of checks) {
  const result = check()
  if (result) {
    console.log(`✅ ${name}: ${result.trim()}`)
  } else {
    console.log(`❌ ${name}: 未找到`)
    console.log(`   提示: ${hint}`)
    hasError = true
  }
}

if (hasError) {
  console.log('\n❌ 环境检查失败，请安装缺失的工具后重试')
  process.exit(1)
}

console.log('\n✅ 环境检查通过')
