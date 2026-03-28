<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="app-container">
    <!-- PC端导航栏 -->
    <nav class="navbar">
      <RouterLink to="/" class="logo" @click="closeMobileMenu">
        <el-icon :size="24"><Lock /></el-icon>
        <span class="logo-text">WasmPassword</span>
      </RouterLink>

      <!-- PC端链接 -->
      <div class="nav-links">
        <RouterLink to="/" class="nav-link">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </RouterLink>
        <RouterLink to="/password" class="nav-link">
          <el-icon><Key /></el-icon>
          <span>密码加密</span>
        </RouterLink>
        <RouterLink to="/file" class="nav-link">
          <el-icon><Document /></el-icon>
          <span>文件加密</span>
        </RouterLink>
      </div>

      <!-- 移动端汉堡按钮 -->
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <el-icon :size="24">
          <Close v-if="isMobileMenuOpen" />
          <Menu v-else />
        </el-icon>
      </button>
    </nav>

    <!-- 移动端菜单 -->
    <div class="mobile-menu" :class="{ open: isMobileMenuOpen }">
      <RouterLink
        to="/"
        class="mobile-nav-link"
        :class="{ active: route.path === '/' }"
        @click="closeMobileMenu"
      >
        <el-icon :size="20"><HomeFilled /></el-icon>
        <span>首页</span>
      </RouterLink>
      <RouterLink
        to="/password"
        class="mobile-nav-link"
        :class="{ active: route.path === '/password' }"
        @click="closeMobileMenu"
      >
        <el-icon :size="20"><Key /></el-icon>
        <span>密码加密</span>
      </RouterLink>
      <RouterLink
        to="/file"
        class="mobile-nav-link"
        :class="{ active: route.path === '/file' }"
        @click="closeMobileMenu"
      >
        <el-icon :size="20"><Document /></el-icon>
        <span>文件加密</span>
      </RouterLink>
    </div>

    <!-- 遮罩层 -->
    <div
      v-if="isMobileMenuOpen"
      class="mobile-menu-overlay"
      @click="closeMobileMenu"
    ></div>

    <main class="main-content">
      <RouterView />
    </main>

    <footer class="footer">
      <p>WasmPassword - 数据不出浏览器，安全合规</p>
      <p class="footer-tech">Powered by WebAssembly + Rust</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 导航栏 */
.navbar {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #409EFF;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  color: #606266;
  transition: all 0.3s;
}

.nav-link:hover {
  background: #f5f7fa;
  color: #409EFF;
}

.nav-link.router-link-exact-active {
  background: #ecf5ff;
  color: #409EFF;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #606266;
}

.mobile-menu {
  display: none;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  z-index: 99;
  padding: 8px 0;
  transform: translateY(-100%);
  opacity: 0;
  transition: all 0.3s ease;
}

.mobile-menu.open {
  transform: translateY(0);
  opacity: 1;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  text-decoration: none;
  color: #606266;
  transition: all 0.2s;
}

.mobile-nav-link:hover,
.mobile-nav-link.active {
  background: #f5f7fa;
  color: #409EFF;
}

.mobile-menu-overlay {
  display: none;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 98;
}

.main-content {
  flex: 1;
  background: #f5f7fa;
}

.footer {
  background: #fff;
  border-top: 1px solid #e4e7ed;
  padding: 20px;
  text-align: center;
  color: #909399;
  font-size: 0.9rem;
}

.footer p {
  margin: 4px 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .mobile-menu {
    display: block;
  }

  .mobile-menu-overlay {
    display: block;
  }

  .logo-text {
    font-size: 1.1rem;
  }

  .footer {
    padding: 16px;
    font-size: 0.85rem;
  }

  .footer-tech {
    display: none;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0 12px;
  }

  .logo {
    font-size: 1rem;
  }

  .footer {
    padding: 12px;
    font-size: 0.8rem;
  }
}
</style>
