<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>UTSEUS</h3>
          <p>l'Université de Technologie Sino-Europenne<br>Université de Shanghai</p>
        </div>
        <div class="footer-section">
          <h4>Partenaires</h4>
          <ul>
            <li><a href="https://www.utc.fr/" target="_blank">UTC</a></li>
            <li><a href="https://www.utt.fr/" target="_blank">UTT</a></li>
            <li><a href="https://www.utbm.fr/" target="_blank">UTBM</a></li>
            <li><a href="https://www.francecompetences.fr/" target="_blank">RNCP</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>UTSEUS - l'Université de Technologie Sino-Europenne - Université de Shanghai</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: 1.5rem 0 1rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.footer-section h3,
.footer-section h4 {
  color: var(--color-text);
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
}

.footer-section p {
  color: var(--color-text-light);
  font-size: 0.85rem;
  line-height: 1.6;
  margin: 0;
}

.footer-section ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer-section li {
  margin-bottom: 0.375rem;
}

.footer-section a {
  color: var(--color-text-light);
  text-decoration: none;
  font-size: 0.85rem;
}

.footer-section a:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

.footer-bottom {
  border-top: 1px solid var(--color-border);
  padding-top: 0.875rem;
  text-align: center;
}

.footer-bottom p {
  color: var(--color-text-light);
  font-size: 0.8rem;
  margin: 0;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1rem;
  }
}
</style>
