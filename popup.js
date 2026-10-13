const fileInput = document.querySelector('#font-file');
const enabled = document.querySelector('#enabled');
const remove = document.querySelector('#remove');
const status = document.querySelector('#status');
let state = {};
let previewFaces = [];
let busy = false;
function message(text, error = false) {
  status.textContent = text;
  status.classList.toggle('error', error);
}
function bytesFromBase64(data) {
  return Uint8Array.from(atob(data), c => c.charCodeAt(0));
}
async function render() {
  enabled.checked = !!state.enabled;
  enabled.disabled = remove.disabled = busy || !state.font;
  document.querySelector('#font-name').textContent = state.font?.name || 'No font selected';
  for (const face of previewFaces) document.fonts.delete(face);
  previewFaces = [];
  document.querySelector('#sample').style.fontFamily = 'Georgia, serif';
  if (state.font) {
    previewFaces = await Promise.all((state.font.faces || [state.font]).map(part => new FontFace('ImportedPreview', bytesFromBase64(part.data), part.unicodeRange ? {unicodeRange: part.unicodeRange} : {}).load()));
    previewFaces.forEach(face => document.fonts.add(face));
    document.querySelector('#sample').style.fontFamily = 'ImportedPreview';
  }
}
fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  if (!file) return;
  setBusy(true);
  try {
    if (!/\.ttf$/i.test(file.name)) throw new Error('Please choose a .ttf font file.');
    if (file.size > 5 * 1024 * 1024) throw new Error('Choose a font smaller than 5 MB.');
    const buffer = await file.arrayBuffer();
    await new FontFace('ValidationFont', buffer).load();
    const data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = () => reject(new Error('Could not read the font.'));
      reader.readAsDataURL(file);
    });
    const next = {font: {name: file.name, data}, enabled: true};
    await chrome.storage.local.set({fontSwitcher: next});
    state = next;
    message('Font applied. Refresh tabs opened before installation.');
  } catch (error) {
    message(error.message || 'Could not load this font.', true);
  } finally {
    setBusy(false);
    fileInput.value = '';
    await render().catch(() => message('Could not preview this font.', true));
  }
});
enabled.addEventListener('change', async () => {
  try {
    const next = {...state, enabled: enabled.checked};
    await chrome.storage.local.set({fontSwitcher: next});
    state = next;
    message(state.enabled ? 'Custom font is on.' : 'Original website fonts restored.');
  } catch (error) { enabled.checked = !!state.enabled; message(error.message, true); }
});
remove.addEventListener('click', async () => {
  try {
    await chrome.storage.local.remove('fontSwitcher');
    state = {};
    await render();
    message('Font removed. Original website fonts restored.');
  } catch (error) { message(error.message, true); }
});
chrome.storage.local.get('fontSwitcher').then(async result => {
  state = result.fontSwitcher || {};
  await render();
}).catch(error => message(error.message, true));

function setBusy(value) {
  busy = value;
  fileInput.disabled = document.querySelector('#google-apply').disabled = document.querySelector('#google-link').disabled = value;
  enabled.disabled = remove.disabled = value || !state.font;
}
document.querySelector('#google-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (busy) return;
  setBusy(true);
  message('Downloading font… Keep this popup open.');
  try {
    const font = await downloadGoogleFont(document.querySelector('#google-link').value);
    const next = {font, enabled: true};
    await chrome.storage.local.set({fontSwitcher: next});
    state = next;
    await render();
    message('Font applied and saved for offline use.');
  } catch (error) {
    message(error.message || 'Could not download this font.', true);
  } finally { setBusy(false); }
});
