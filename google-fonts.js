// Accept family names, Google Fonts specimen links, and CSS API links.
function googleFamily(value) {
  let name = value.trim();
  if (/^https?:\/\//i.test(name)) {
    const url = new URL(name);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) throw new Error('Use a secure Google Fonts link.');
    if (url.hostname === 'fonts.google.com') {
      name = url.pathname.startsWith('/specimen/') ? decodeURIComponent(url.pathname.slice(10)).replace(/\+/g, ' ') : url.searchParams.get('family');
    } else if (url.hostname === 'fonts.googleapis.com') {
      name = url.searchParams.get('family');
    } else throw new Error('Use a link from fonts.google.com, or enter a font name.');
  }
  name = (name || '').split(':')[0].trim();
  if (!name || name.length > 100 || !/^[\p{L}\p{N} .-]+$/u.test(name)) throw new Error('Enter one font name, such as Inter, or its Google Fonts link.');
  return name;
}
function googleSources(css) {
  const faces = [];
  for (const block of css.matchAll(/@font-face\s*\{([^}]+)\}/g)) {
    const urlText = block[1].match(/url\(\s*['"]?([^\s)'";]+)['"]?\s*\)/)?.[1];
    if (!urlText) continue;
    const url = new URL(urlText);
    if (url.protocol !== 'https:' || url.hostname !== 'fonts.gstatic.com' || url.port || url.username || url.password) throw new Error('Unexpected font download location.');
    const range = block[1].match(/unicode-range:\s*([^;\n}]+)/)?.[1].trim();
    faces.push({url: url.href, ...(range ? {unicodeRange: range} : {})});
  }
  if (!faces.length || faces.length > 150) throw new Error('Could not find this font. Try another family name.');
  return faces;
}
async function fontRequest(url) {
  const response = await fetch(url, {credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error', signal: AbortSignal.timeout(20000)});
  if (!response.ok) throw new Error('Could not download the font. Check its name and your connection.');
  return response;
}
function fontBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(binary);
}
async function downloadGoogleFont(value) {
  const name = googleFamily(value);
  const css = await (await fontRequest('https://fonts.googleapis.com/css2?family=' + encodeURIComponent(name) + '&display=swap')).text();
  const sources = googleSources(css);
  const faces = [];
  let total = 0;
  for (const source of sources) {
    const buffer = await (await fontRequest(source.url)).arrayBuffer();
    total += buffer.byteLength;
    if (total > 5 * 1024 * 1024) throw new Error('This font is too large. Choose another font or upload a smaller TTF.');
    const descriptors = source.unicodeRange ? {unicodeRange: source.unicodeRange} : {};
    await new FontFace('ValidateGoogleFont', buffer, descriptors).load();
    faces.push({data: fontBase64(buffer), ...descriptors});
  }
  return {name, source: 'google', faces};
}
