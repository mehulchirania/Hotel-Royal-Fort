// Applies the saved theme before first paint so a returning dark-mode visitor
// does not flash light. External (not inline) so the Content-Security-Policy
// can forbid inline scripts. Must match the default in src/context/theme.tsx.
(function () {
  try {
    if (localStorage.getItem('rf_theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
