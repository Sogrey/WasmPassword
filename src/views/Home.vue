<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goPassword() {
  router.push('/password')
}

function goFile() {
  router.push('/file')
}
</script>

<template>
  <div class="home">
    <div class="hero">
      <el-icon :size="80" color="#409EFF">
        <Lock />
      </el-icon>
      <h1>WasmPassword</h1>
      <p class="subtitle">基于 WebAssembly 的数字资产加解密工具</p>
      <p class="description">数据不出浏览器，安全合规</p>
    </div>

    <div class="features">
      <el-card class="feature-card" shadow="hover" @click="goPassword">
        <template #header>
          <div class="card-header">
            <el-icon :size="32"><Key /></el-icon>
            <span>密码加密</span>
          </div>
        </template>
        <p>加密存储您的密码、密钥等敏感文本信息</p>
        <ul>
          <li>AES-256-GCM 加密算法</li>
          <li>本地密钥生成与管理</li>
          <li>一键复制加密结果</li>
        </ul>
      </el-card>

      <el-card class="feature-card" shadow="hover" @click="goFile">
        <template #header>
          <div class="card-header">
            <el-icon :size="32"><Document /></el-icon>
            <span>文件加密</span>
          </div>
        </template>
        <p>加密各类文件，保护您的数字资产</p>
        <ul>
          <li>支持所有文件类型</li>
          <li>大文件分块处理</li>
          <li>安全下载加密文件</li>
        </ul>
      </el-card>
    </div>

    <div class="tech-info">
      <el-divider />
      <h3>技术架构</h3>
      <el-space wrap>
        <el-tag type="info">Vue 3.5</el-tag>
        <el-tag type="success">WebAssembly</el-tag>
        <el-tag type="warning">Rust</el-tag>
        <el-tag type="danger">AES-256-GCM</el-tag>
      </el-space>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero {
  text-align: center;
  margin-bottom: 60px;
}

.hero h1 {
  font-size: 2.5rem;
  margin: 20px 0 10px;
  background: linear-gradient(120deg, #409EFF, #67C23A);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.subtitle {
  font-size: 1.2rem;
  color: #606266;
  margin-bottom: 8px;
}

.description {
  color: #909399;
  font-size: 0.9rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.feature-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.2rem;
  font-weight: bold;
}

.feature-card ul {
  padding-left: 20px;
  color: #606266;
  font-size: 0.9rem;
}

.feature-card li {
  margin: 8px 0;
}

.tech-info {
  text-align: center;
}

.tech-info h3 {
  margin-bottom: 16px;
  color: #606266;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .home {
    padding: 24px 16px;
  }

  .hero {
    margin-bottom: 40px;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .features {
    gap: 16px;
    margin-bottom: 32px;
  }

  .card-header {
    font-size: 1.1rem;
  }

  .feature-card ul {
    font-size: 0.85rem;
  }

  .tech-info h3 {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .home {
    padding: 20px 12px;
  }

  .hero {
    margin-bottom: 30px;
  }

  .hero h1 {
    font-size: 1.75rem;
    margin: 16px 0 8px;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .description {
    font-size: 0.85rem;
  }

  .features {
    gap: 12px;
    margin-bottom: 24px;
  }

  .card-header {
    font-size: 1rem;
  }
}

/* 触摸设备优化 */
@media (hover: none) {
  .feature-card:hover {
    transform: none;
  }

  .feature-card:active {
    transform: scale(0.98);
  }
}
</style>
