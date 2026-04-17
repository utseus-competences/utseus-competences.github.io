<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>UTSEUS</h3>
          <p>l'Université de technologie sino-européenne<br>Université de Shanghai</p>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/careers">Careers</router-link></li>
            <li><router-link to="/courses">Courses</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="https://github.com/utseus-competences/utseus-competences.github.io" target="_blank">GitHub</a></li>
            <li><router-link to="/dashboard">Analysis</router-link></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 UTSEUS Career Competency System. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: 2rem 0 1rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
  color: var(--color-text);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.footer-section p {
  color: var(--color-text-light);
  font-size: 0.9rem;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: var(--color-text-light);
  text-decoration: none;
  font-size: 0.9rem;
}

.footer-section a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  border-top: 1px solid var(--color-border);
  padding-top: 1rem;
  text-align: center;
}

.footer-bottom p {
  color: var(--color-text-light);
  font-size: 0.85rem;
  margin: 0;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>
