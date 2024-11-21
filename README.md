# Blanko

A Zen Browser extension that ensures proper background colors on web pages with transparent backgrounds.

## Features

- Automatically detects and fixes transparent backgrounds
- Respects existing color schemes and dark modes
- Lightweight and performance-friendly
- Simple setup process

## Installation

### From Firefox Add-ons

will be added soon.

### Manual Installation (Development)

1. Clone this repository
2. Open Firefox Developer Edition
3. Navigate to `about:debugging#/runtime/this-firefox`
4. Click "Load Temporary Add-on"
5. Select any file in the extension directory

### Post-Installation Setup

1. Navigate to `about:config`
2. Search for `browser.tabs.allow_transparent_browser`
3. Set it to `true`

## Privacy & Permissions

This extension requires the following permissions:

- `tabs`: Required to detect and modify background colors
- `<all_urls>`: Required to fix backgrounds on any website

The extension:

- Does not collect any user data
- Does not communicate with external servers
- Only modifies background colors when necessary

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Support

If you encounter any issues, please file them in the GitHub issues section.
