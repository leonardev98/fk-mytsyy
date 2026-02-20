/**
 * Inline script that runs before paint to apply saved theme and avoid flash.
 * Default is light; if user had "dark" in localStorage, we add the class immediately.
 */
export function ThemeScript() {
  const script = `
    (function() {
      try {
        var t = localStorage.getItem('mytsyy_theme');
        if (t === 'dark') document.documentElement.classList.add('dark');
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
