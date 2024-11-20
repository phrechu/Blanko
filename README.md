# Blanko

A lightweight browser extension for Zen Browser that ensures proper background colors on web pages and provides a clean new tab experience.

## Features

- Automatically adds white background to pages with transparent backgrounds
- Fast and efficient - runs at document start
- Minimal permissions required
- No tracking or data collection

## Installation

### Manual Installation

1. Download the extension files
2. Open Zen Browser
3. Go to `about:debugging#/runtime/this-firefox`
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the extension directory

### Required Configuration

For the extension to work properly, you need to manually set a browser preference:

1. Open a new tab and navigate to `about:config`
2. Accept the warning message
3. Search for `browser.tabs.allow_transparent_browser`
4. Set its value to `true` by double-clicking it

## Development

To modify or build the extension:

1. Clone this repository
2. Make your changes
3. Test in Zen Browser using the manual installation steps above

## Files Structure

blanko/
├── manifest.json # Extension manifest
├── background.js # Main extension logic
├── popup.html # Extension popup
├── setup.html # Setup instructions page
├── icons/ # Extension icons
│ ├── icon-48.svg
│ └── icon-96.svg
├── README.md # This file
└── LICENSE # MIT license

## Permissions

This extension requires:

- `tabs`: To detect new tabs and URL changes
- `<all_urls>`: To inject background colors where needed

## Browser Compatibility

- Zen Browser (Firefox-based): ✓
- Other Firefox-based browsers: Should work but untested
- Firefox: Should work but untested

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

[Phrechu](https://github.com/Phrechu).

## Version History

- 1.0.0: Initial release
  - Basic functionality
  - Background color injection
  - New tab handling
