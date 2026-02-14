# CLEAR Platform Mobile App

React Native / Expo mobile application for the CLEAR Platform.

## Features

- **PlainSpeak AI**: Translate legal documents into plain language
- **ProcessMap**: Navigate 15+ government processes with step tracking
- **Complexity Calculator**: Score any process using 8-dimension methodology
- **User Accounts**: Sync data across devices (requires Supabase)
- **Offline Support**: Core features work without internet

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on specific platform
npx expo start --ios
npx expo start --android
npx expo start --web
```

## Project Structure

```
clear-mobile/
├── App.js                 # Main app with navigation
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── src/
│   ├── screens/          # Screen components
│   │   ├── HomeScreen.js
│   │   ├── PlainSpeakScreen.js
│   │   ├── ProcessMapScreen.js
│   │   ├── ProcessDetailScreen.js
│   │   ├── CalculatorScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── SettingsScreen.js
│   │   └── LoginScreen.js
│   ├── store/            # State management
│   │   └── settingsStore.js
│   ├── components/       # Reusable components
│   └── utils/            # Helper functions
└── assets/               # Images, fonts, etc.
```

## Screens

### Home
- Platform overview and stats
- Quick access to all tools
- Mission statement

### PlainSpeak
- Text input with paste support
- Document picker (basic)
- Three reading levels
- Risk score display
- Copy to clipboard

### ProcessMap
- Browse 15+ processes
- Category filtering
- Search functionality
- Difficulty indicators

### Process Detail
- Step-by-step guide
- Progress tracking
- Tap to complete steps
- Tips and warnings

### Calculator
- 8 dimension scoring
- Weighted index calculation
- Benchmark comparison
- Process naming

### Profile
- Usage statistics
- API status display
- Settings access
- Quick links

### Settings
- API key management
- Notification preferences
- Data export/clear
- About info

## Configuration

### API Key

1. Open Settings screen
2. Enter your Anthropic API key
3. Key is stored securely with expo-secure-store

Without an API key, the app runs in demo mode with simulated translations.

### Supabase (Optional)

To enable user accounts and cloud sync:

1. Create a Supabase project
2. Run the schema from `supabase-schema.sql`
3. Update `app.json` with your credentials:

```json
{
  "extra": {
    "supabaseUrl": "https://your-project.supabase.co",
    "supabaseAnonKey": "your-anon-key"
  }
}
```

## Building for Production

### Expo Go (Testing)
```bash
npx expo start
```
Scan QR code with Expo Go app.

### Development Build
```bash
npx expo run:ios
npx expo run:android
```

### Production Build
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## Dependencies

- **expo**: ~50.0.0
- **react-native**: 0.73.2
- **@react-navigation/native**: ^6.1.9
- **@react-navigation/bottom-tabs**: ^6.5.11
- **@supabase/supabase-js**: ^2.39.0
- **zustand**: ^4.4.7
- **expo-secure-store**: ~12.8.1
- **expo-document-picker**: ~11.10.1
- **expo-clipboard**: ~5.0.1

## Design

- Dark theme optimized
- Consistent with web platform
- Native feel with smooth animations
- Accessibility considerations

## License

MIT License - Part of the CLEAR Platform

## Links

- Web Platform: https://clear-platform.netlify.app
- GitHub: https://github.com/sillinous/clear-platform
- Coalition: https://clear-platform.netlify.app/coalition
