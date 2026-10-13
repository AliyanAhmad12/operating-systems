# Operating System Notice (Cross-Platform Mobile App)

A professional, high-priority **Operating System Notice** mobile application engineered for **Android and iOS (iPhone)** using **React Native & Expo SDK**.

The application features a polished system-alert interface, continuous background emergency audio playback at maximum operating system gain ceiling, customizable warning messages, a replaceable project asset image, a comprehensive permission walkthrough, and strict compliance with Apple iOS and Android operating system safety boundaries.

---

## Feature Overview

1. **Polished System Notice Interface:**
   - Dark-mode, critical system terminal styling with live telemetry clock, host kernel/API info, and pulsing alert LED indicators.
   - Built to simulate high-priority system advisories (similar to Android Recovery, Apple Emergency Broadcasts, or enterprise kernel security notifications).

2. **Customizable Notice Message & Presets:**
   - Display customizable text directly on screen.
   - Built-in in-app editor allows live customization and testing with quick presets (*Security Lockdown*, *Hardware Overheat*, *Evacuation Advisory*).
   - Dynamically updates active notification text when modified.

3. **Replaceable Project Assets:**
   - **Warning Emblem:** `assets/notice-image.png` - swap with any PNG/JPEG image without modifying code.
   - **Alarm Audio:** `assets/alarm.mp3` - continuous looping alarm synthesized and encoded at 192kbps MP3 stereo.

4. **Continuous Background Audio Playback:**
   - Built on `expo-audio` (modern Expo Core Audio API) with automatic `expo-av` fallback.
   - Sets audio session mode: `playsInSilentMode: true`, `shouldPlayInBackground: true`, and `interruptionMode: doNotMix`.
   - On iOS, integrates with lock screen Now Playing center via `setActiveForLockScreen(true)`.
   - On Android, triggers a persistent high-priority notification channel (`AndroidImportance.MAX`).

5. **Safety & Platform Safeguards Mandate:**
   - Prominent, always-visible **"Cease Alert (Stop Audio)"** emergency button.
   - Fully respects physical power buttons and OS gestures. No unauthorized hardware locks or anti-termination tricks.

---

## Project Architecture

```
├── assets/
│   ├── alarm.mp3                     # Continuous alarm audio track (replaceable)
│   ├── notice-image.png              # System warning emblem (replaceable)
│   ├── icon.png                      # App icon
│   ├── splash-icon.png               # Launch screen splash asset
│   └── android-icon-*.png            # Adaptive Android icons
├── src/
│   ├── constants/
│   │   └── theme.js                  # System alert palette, typography, and presets
│   ├── services/
│   │   ├── audioService.js           # Multi-engine audio manager (expo-audio & expo-av)
│   │   └── notificationService.js    # Android notification channel & sticky notification
│   └── components/
│       ├── SystemNoticeHeader.js     # Top telemetry, status LED, platform badge
│       ├── NoticeImageCard.js        # Emblem container with pulsing alert animation
│       ├── WarningContent.js         # Notice message display and modal editor
│       ├── AudioControls.js          # Master activate/cease button & telemetry stats
│       ├── PermissionModal.js        # In-depth permission explanation screen
│       └── PlatformInfoModal.js      # Technical iOS vs Android architectural comparison
├── App.js                            # Root container orchestrating state and layout
├── index.js                          # Expo entry point
├── app.json                          # App metadata, bundle IDs, plugins, permissions
└── package.json                      # Dependencies and scripts
```

---

## Operating System Differences & Limitations

| Aspect | Apple iOS (iPhone) | Google Android |
| :--- | :--- | :--- |
| **Volume Control** | **Hardware Button Sandbox:** iOS strictly forbids apps from programmatically overriding the physical master volume slider. The app sets its internal stream gain to `1.0` (100% maximum allowed gain). With `playsInSilentMode: true`, audio continues through the hardware mute switch. | **Stream-Based Gain:** Android divides audio into streams (Music, Alarm, Notification). App gain is set to `1.0`. Overriding physical volume rockers or system Do Not Disturb (DND) requires special user system settings grant. |
| **Background Execution** | **UIBackgroundModes:** Configured with `audio` in `Info.plist`. The app remains active while locked or minimized as long as the audio session is streaming. Lock screen controls display alert metadata. | **Foreground Service:** Uses `FOREGROUND_SERVICE_MEDIA_PLAYBACK` and `WAKE_LOCK`. A persistent high-importance notification keeps the Linux process alive against Android Doze Mode battery killers. |
| **App Termination & Power Buttons** | **OS Sandbox Rule:** Apple does not allow third-party apps to disable the physical side power button or prevent users from swiping up to kill the app in the app switcher. | **Linux Sandbox Rule:** Android does not permit third-party consumer apps to intercept power long-press or block user force-stop. An on-screen Stop button is provided. |

---

## Running, Testing, and Building

### 1. Run Development Server
```bash
# Start the Expo development server
npx expo start

# Run targeting Android emulator/device
npx expo start --android

# Run targeting iOS simulator (requires macOS)
npx expo start --ios
```

### 2. Diagnose and Validate Project
```bash
# Verify configuration and peer dependencies
npx expo-doctor

# Test bundling for iOS and Android
npx expo export
```

### 3. Build Standalone Android APK

#### Option A: Cloud Build with EAS (Recommended - works on Windows without Android Studio)
```bash
# Install EAS CLI if not already installed
npm install -g eas-cli

# Log in to your Expo account
npx eas-cli@latest login

# Configure project for build
npx eas-cli@latest build:configure

# Build a standalone installable Android APK (Preview Profile)
npx eas-cli@latest build -p android --profile preview
```

#### Option B: Local Android Build
```bash
# Generate native android/ directory
npx expo run:android
# Or generate native directory without running
npx expo prebuild --platform android

# Build release APK locally (requires Android SDK & Java JDK)
cd android
./gradlew assembleRelease
# Output APK: android/app/build/outputs/apk/release/app-release.apk
```

### 4. Build Standalone iOS App

#### Option A: Cloud Build with EAS (Recommended - works on Windows without a Mac)
```bash
# Build an ad-hoc or simulator iOS build in the cloud
npx eas-cli@latest build -p ios --profile preview
```

#### Option B: Local iOS Build (Requires a Mac with Xcode)
```bash
# Generate native ios/ directory and run on connected device or simulator
npx expo run:ios
```

---

## How to Replace Assets

1. **Replace the Alert Image:**
   - Save your new graphic as `assets/notice-image.png`.
   - The app automatically renders the new image at full resolution without needing code modifications.
2. **Replace the Alarm Sound:**
   - Save your custom audio file as `assets/alarm.mp3`.
   - The app automatically loads and continuously loops the file when the alert is triggered.
