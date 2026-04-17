<template>
  <header class="header">
    <div class="container header-content">
      <div class="logo">
        <router-link to="/">
          <h1>UTSEUS Competences</h1>
        </router-link>
      </div>
      <nav class="nav">
        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
          Dashboard
        </router-link>
        <router-link to="/courses" class="nav-link" :class="{ active: $route.path === '/courses' }">
          Courses
        </router-link>
        <router-link to="/careers" class="nav-link" :class="{ active: $route.path === '/careers' }">
          Careers
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
  background: var(--color-primary);
  color: white;
  padding: 0.875rem 0;
  border-bottom: 1px solid var(--color-border);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  color: white;
  text-decoration: none;
}

.logo h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: white;
}

.nav {
  display: flex;
  gap: 0.25rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 400;
  transition: all 0.2s;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  color: white;
  background: rgba(255, 255, 255, 0.15);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 0.75rem;
  }

  .nav {
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }

  .nav-link {
    padding: 0.5rem 0.5rem;
    font-size: 0.85rem;
    flex: 1 1 auto;
    min-width: 80px;
    text-align: center;
  }
}
</style>
