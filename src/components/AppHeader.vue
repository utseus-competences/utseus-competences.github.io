<template>
  <header class="header">
    <div class="container header-content">
      <div class="logo">
        <router-link to="/">
          <h1>UTSEUS</h1>
          <span class="logo-subtitle">Career Competency System</span>
        </router-link>
      </div>
      <nav class="nav">
        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
          Home
        </router-link>
        <router-link to="/careers" class="nav-link" :class="{ active: $route.path === '/careers' }">
          Careers
        </router-link>
        <router-link to="/courses" class="nav-link" :class="{ active: $route.path === '/courses' }">
          Courses
        </router-link>
        <router-link to="/dashboard" class="nav-link" :class="{ active: $route.path === '/dashboard' }">
          Dashboard
        </router-link>
        <router-link to="/path" class="nav-link" :class="{ active: $route.path === '/path' }">
          Learning Path
        </router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: var(--shadow-md);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  color: white;
  text-decoration: none;
  display: flex;
  flex-direction: column;
}

.logo h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.logo-subtitle {
  font-size: 0.75rem;
  opacity: 0.9;
  font-weight: 400;
}

.nav {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  color: white;
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
