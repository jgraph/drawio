# Draw.io iOS App

A native iOS application that provides mobile access to the Draw.io diagramming platform.

## Overview

This iOS app wraps the Draw.io web interface in a native iOS application, providing users with a seamless mobile experience for creating and editing diagrams on iPhone and iPad devices.

## Features

- **Native iOS Interface**: Built with SwiftUI for smooth, native iOS performance
- **Full Draw.io Functionality**: Access the complete Draw.io diagramming toolkit
- **WebView Integration**: Leverages WKWebView for optimal web content rendering
- **Responsive Design**: Optimized for both iPhone and iPad with support for all orientations
- **Dark Mode Support**: Automatically adapts to system appearance settings
- **Secure**: Implements App Transport Security for secure network connections

## Requirements

- iOS 15.0 or later
- Xcode 14.0 or later
- Swift 5.0 or later
- Active internet connection for accessing Draw.io web services

## Project Structure

```
ios/
├── DrawIO.xcodeproj/          # Xcode project file
│   └── project.pbxproj
└── DrawIO/                    # Source code directory
    ├── DrawIOApp.swift        # Main app entry point
    ├── ContentView.swift      # Main view with navigation
    ├── DiagramWebView.swift   # WebView wrapper for Draw.io
    ├── Info.plist            # App configuration
    ├── Assets.xcassets/      # Asset catalog (icons, colors)
    └── Preview Content/      # SwiftUI preview assets
```

## Building the App

### Using Xcode

1. Open the project:
   ```bash
   open ios/DrawIO.xcodeproj
   ```

2. Select your target device or simulator from the scheme selector

3. Press `Cmd + R` to build and run the app

### Using xcodebuild (Command Line)

Build for simulator:
```bash
cd ios
xcodebuild -project DrawIO.xcodeproj \
  -scheme DrawIO \
  -destination 'platform=iOS Simulator,name=iPhone 14' \
  build
```

Build for device (requires code signing):
```bash
cd ios
xcodebuild -project DrawIO.xcodeproj \
  -scheme DrawIO \
  -destination 'generic/platform=iOS' \
  build
```

## Architecture

### App Entry Point
`DrawIOApp.swift` - Defines the main app structure using SwiftUI's `@main` attribute.

### Main View
`ContentView.swift` - Implements the primary user interface with:
- Navigation bar with app title
- Loading indicator while content loads
- Action menu for additional features
- Integration of the web view component

### WebView Component
`DiagramWebView.swift` - Handles web content rendering:
- Configures WKWebView for optimal mobile experience
- Manages navigation and loading states
- Implements viewport meta tag for proper mobile scaling
- Handles navigation policies and error cases

## Configuration

### Bundle Identifier
The app uses `com.drawio.app` as the bundle identifier. Update this in:
- `ios/DrawIO.xcodeproj/project.pbxproj` (PRODUCT_BUNDLE_IDENTIFIER)

### App Display Name
The app is named "Draw.io" and can be changed in:
- `ios/DrawIO/Info.plist` (CFBundleDisplayName)

### Deployment Target
Currently set to iOS 15.0, configured in:
- `ios/DrawIO.xcodeproj/project.pbxproj` (IPHONEOS_DEPLOYMENT_TARGET)

## Development

### Adding Features

To add new features:

1. Create new Swift files in the `DrawIO` directory
2. Add them to the Xcode project using the "Add Files" option
3. Import necessary frameworks (SwiftUI, WebKit, etc.)
4. Update the UI in `ContentView.swift` as needed

### Debugging

Enable debug mode in Xcode:
1. Select the scheme
2. Edit Scheme → Run → Build Configuration → Debug
3. Set breakpoints in Swift code
4. Use Console for web debugging

### WebView Debugging

For debugging web content:
1. Enable Web Inspector on the device (Settings → Safari → Advanced)
2. Connect device to Mac
3. Open Safari → Develop → [Device Name] → [App Name]

## Testing

### Unit Tests
Create unit tests for business logic:
```bash
cd ios
xcodebuild test -project DrawIO.xcodeproj \
  -scheme DrawIO \
  -destination 'platform=iOS Simulator,name=iPhone 14'
```

### Manual Testing Checklist
- [ ] App launches successfully
- [ ] Draw.io web interface loads
- [ ] Diagrams can be created and edited
- [ ] Touch gestures work correctly (pinch, zoom, pan)
- [ ] Rotation works on both orientations
- [ ] Works on different device sizes (iPhone, iPad)
- [ ] Dark mode support

## Deployment

### TestFlight Distribution

1. Archive the app in Xcode (Product → Archive)
2. Upload to App Store Connect
3. Add build to TestFlight
4. Invite testers

### App Store Release

1. Prepare App Store listing in App Store Connect
2. Submit for review
3. Once approved, release to the App Store

### Required Assets for App Store
- App Icon (1024x1024px)
- Screenshots for all device types
- Privacy Policy URL
- App description and keywords
- Support URL

## Performance Optimization

The app implements several optimizations:
- Lazy loading of web content
- Efficient memory management with WKWebView
- Proper handling of view lifecycle events
- Optimized asset catalog for different screen sizes

## Security

Security features implemented:
- App Transport Security (ATS) enabled
- HTTPS-only connections to diagrams.net
- No arbitrary loads permitted
- Secure WebKit configuration

## Known Limitations

- Requires internet connection for full functionality
- Some advanced features may have limited mobile support
- File system integration limited to web app capabilities
- Cloud storage depends on Draw.io web service availability

## Troubleshooting

### App won't build
- Ensure Xcode is up to date
- Clean build folder (Cmd + Shift + K)
- Delete derived data

### Web content not loading
- Check internet connection
- Verify Info.plist network security settings
- Check Console for error messages

### Code signing issues
- Ensure valid Apple Developer account
- Update provisioning profiles
- Check bundle identifier uniqueness

## Contributing

This project follows the main Draw.io repository guidelines. See the main README.md for contribution policies.

## License

This iOS app follows the same licensing as the main Draw.io project. See the LICENSE file in the root directory.

## Support

For issues specific to the iOS app:
- Check the [GitHub Issues](https://github.com/jgraph/drawio/issues)
- Review the troubleshooting section above

For Draw.io functionality questions:
- Visit [diagrams.net support](https://www.diagrams.net/doc/)

## Version History

### 1.0.0 (Initial Release)
- Native iOS app with SwiftUI interface
- WKWebView integration with Draw.io web app
- Support for iPhone and iPad
- iOS 15.0+ compatibility
- Dark mode support
- Portrait and landscape orientations
