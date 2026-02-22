// ============================================
// IMPROVED PORTFOLIO SCRIPT - DANI
// Features: theme toggle, typing, better game with power-ups!
// ============================================

(function() {
  // ---------- THEME TOGGLE ----------
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
  });
})();