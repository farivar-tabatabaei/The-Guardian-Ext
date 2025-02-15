# The Guardian - A Firefox Website Safety Indicator Extension

- A Firefox extension that displays a safety indicator icon in the URL bar, showing whether the current website is trusted or unknown. The extension maintains an up-to-date list of safe websites by synchronizing with a GitHub repository.
- The main idea behiend this extension was to have an indicator which makes the user sure a cyrillic letter is not used in the URL.
- For example the cyrillic "а" may look like an english "a" but thier values and not the same and they can be used to forward the user to unsafe websites.

## Features

- Visual safety indicator in the URL bar
- Automatic synchronization with GitHub repository
- Offline support with local storage caching
- Fallback mechanisms for reliability
- Daily updates of the safe websites list
- Lightweight and fast operation

## Installation

### For Users

1. Download the latest release from the releases page
2. Open Firefox and go to `about:addons`
3. Click the gear icon and select "Install Add-on From File"
4. Select the downloaded .xpi file
5. Grant the requested permissions

### For Developers

1. Clone the repository:

  ```bash
  git clone https://github.com/farivar-tabatabaei/the-guardian-ext
  cd the-guardian-ext
  ```

2. Set up the extension in Firefox:
    - Open Firefox and navigate to `about:debugging`
    - Click "This Firefox" in the left sidebar
    - Click "Load Temporary Add-on"
    - Select the `manifest.json` file from your extension directory

3. Configure GitHub repository:
   - Create a public GitHub repository
   - Add your `websites.json` file to the repository
   - Update the `GITHUB_RAW_URL` in `background.js` with your repository URL

## Project Structure

``` bash
the-guardian-ext/
├── manifest.json
├── background.js
├── websites.json
└── icons/
    ├── extension/
    ├── safe/
    ├── unknown/
    └── unsafe/
```

## Configuration

### websites.json Structure

```json
{
  "safe": [
    "google.com",
    "youtube.com",
    "facebook.com",
    "twitter.com",
    "instagram.com",
    "linkedin.com",
    "reddit.com",
    "claude.ai",
    "chatgpt.com",
    "openai.com",
    "shaparak.ir",
    "hostiran.net"
  ]
}
```

### Update Interval

The extension checks for updates every 24 hours by default. You can modify the update interval by changing the `UPDATE_INTERVAL` constant in `background.js`:

```javascript
const UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
```

## How It Works

1. When Firefox starts, the extension:
   - Loads the initial website list from local storage or bundled JSON
   - Checks GitHub for updates if the cached data is older than 24 hours
   - Stores updated data in local storage for offline use

2. For each website visit:
   - Extracts the domain from the URL
   - Checks against the list of safe websites
   - Displays appropriate icon in the URL bar:
     - Green checkmark: Safe website
     - Grey icon: Unknown website

3. The extension maintains reliability by:
   - Caching data locally to work offline
   - Using fallback mechanisms if GitHub is unreachable
   - Gracefully handling update failures

## Development

### Prerequisites

- Firefox Browser
- Basic knowledge of JavaScript and browser extensions
- GitHub account (for hosting the websites list)

### Building

1. Update the manifest.json with your extension details
2. Prepare icon files in the required sizes
3. Configure your GitHub repository URL in background.js
4. Test the extension locally
5. Package for distribution

### Testing

1. Load the extension in Firefox using about:debugging
2. Visit various websites to verify icon behavior
3. Test offline functionality by disabling network connection
4. Verify GitHub synchronization by updating the remote list

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Firefox Add-ons Documentation
- GitHub API
- Icons from [Add your icon source]

## Support

For support, please:

1. Check the issues page for known problems
2. Create a new issue if your problem isn't listed
3. Provide detailed information about your Firefox version and operating system

## Security Considerations

The extension:

- Only requests necessary permissions
- Uses HTTPS for GitHub communication
- Stores data locally in Firefox's secure storage
- Does not collect or transmit user data

## Version History

- 1.0.0 (2024-02-15)
  - Initial release
  - GitHub synchronization
  - Safe website indicators
