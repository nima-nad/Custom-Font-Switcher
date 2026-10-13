# Font Switcher

Use a custom TTF or a Google Font on websites. No build tools or account needed.

## Install or update

1. Extract the ZIP into a folder.
2. Open chrome://extensions and turn on Developer mode.
3. Choose Load unpacked and select the folder containing manifest.json. If already installed from that folder, click Reload instead.
4. Refresh your website tabs and open Font Switcher.

## Choose a font

- Upload a .ttf file (up to 5 MB), or
- Enter a Google Fonts name or link and click Use Google Font. Example: Inter or https://fonts.google.com/specimen/Inter.

Keep the popup open until the download finishes. Google imports use the regular style; bold and italic may be synthesized. CSS links use the first family and ignore custom weight/text parameters. The font is saved locally and works offline after import. Your existing custom font is retained when updating.

Switch off to restore website fonts. Remove font deletes the saved font.

## Limits

Changes website text, not Chrome menus, internal pages, the Chrome Web Store, or the PDF viewer. Some website icons and layouts may be affected. Shadow DOM, images, canvas text, and certain overriding styles are not supported. Missing characters use a fallback font.

## Privacy

Custom files never upload. Google imports contact fonts.googleapis.com and fonts.gstatic.com, so Google receives the requested font and normal connection information, including your IP address. No analytics or browsing-history collection. See PRIVACY.md.

Use fonts you have permission to use. No fonts are bundled with this extension.

## Files

manifest.json declares permissions; popup files provide the interface; google-fonts.js downloads and validates fonts; content.js applies them to websites. No dependencies or build step.

Before store submission, add icons and listing screenshots and publish the privacy policy at a public URL. The ZIP has manifest.json at its root.
