(() => {
  let generation = 0;
  let faces = [];
  let style;
  let revision = 0;
  // Target text elements, leaving pseudo-element icon fonts and SVGs alone.
  const selectors = 'body, p, a, span, div, section, article, header, footer, main, nav, aside, h1, h2, h3, h4, h5, h6, li, ul, ol, dl, dt, dd, blockquote, figcaption, label, input, textarea, select, option, button, table, th, td, caption, summary, details, strong, b, em, small, time, code, pre';
  async function apply(state) {
    const current = ++generation;
    style?.remove();
    style = null;
    faces.forEach(face => document.fonts.delete(face));
    faces = [];
    if (!state?.enabled || !state.font) return;
    try {
      const loaded = await Promise.all((state.font.faces || [state.font]).map(part => {
        const bytes = Uint8Array.from(atob(part.data), c => c.charCodeAt(0));
        return new FontFace('__FontSwitcherUserFont__', bytes, part.unicodeRange ? {unicodeRange: part.unicodeRange} : {}).load();
      }));
      if (current !== generation) return;
      faces = loaded;
      faces.forEach(face => document.fonts.add(face));
      style = document.createElement('style');
      style.textContent = `${selectors} { font-family: "__FontSwitcherUserFont__", sans-serif !important; }`;
      (document.head || document.documentElement).append(style);
    } catch (error) { console.warn('Font Switcher: unable to apply font.', error); }
  }
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.fontSwitcher) {
      revision++;
      void apply(changes.fontSwitcher.newValue);
    }
  });
  const initialRevision = revision;
  chrome.storage.local.get('fontSwitcher').then(result => {
    if (revision === initialRevision) void apply(result.fontSwitcher);
  }).catch(error => console.warn('Font Switcher: unable to read settings.', error));
})();
