# Custom Font Switcher

![Custom Font Switcher logo](icons/icon128.png)

Make website text feel like yours. Use your own TTF or choose a Google Font, preview it, and switch back whenever you like.

## Get the extension

The Chrome Web Store listing is being prepared. A store installation link will be added here after approval.

## How to use

1. Open Custom Font Switcher from Chrome's extensions menu.
2. Upload a `.ttf` file (up to 5 MB), or enter a Google Fonts name or link and click **Use Google Font**.
3. Keep the popup open until the import finishes. Your selected font is enabled automatically.

Example: `Inter` or `https://fonts.google.com/specimen/Inter`.

Use **Use on websites** to switch the font on or off. **Remove font** deletes the saved font and restores original website fonts. Your selection stays saved between browser sessions and works offline after import.

## What it changes

Regular text on most HTTP and HTTPS websites. It does not change Chrome menus, settings, the Chrome Web Store, the built-in PDF viewer, or text in images and videos. Some icons and layouts may be affected. Shadow DOM and canvas text are not supported, and some website styles can override the font.

Google imports use the regular style; bold and italic may be synthesized. CSS links use the first family and ignore weight and text parameters. Characters missing from a font use a fallback.

## Privacy

Installing from the store does not upload your fonts. Custom files, downloaded fonts, and your setting stay in local extension storage. Google Fonts imports contact Google, which receives the requested font and normal network information, including your IP address. No analytics, ads, or browsing-history collection.

Read the [privacy policy](PRIVACY.md). Use fonts you have permission to use. No font files are bundled. This project is not affiliated with or endorsed by Google.

## For developers

No dependencies or build step. To test the source, open `chrome://extensions`, enable Developer mode, select **Load unpacked**, and choose this folder. Reload the extension and refresh website tabs after changes.

- `popup.html`, `popup.css`, `popup.js`: interface and saved preferences.
- `google-fonts.js`: Google Fonts import and validation.
- `content.js`: applies saved fonts to pages.
- `manifest.json`: extension settings and permissions.
- `icons/`: extension logo sizes.
