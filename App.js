import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  AppState,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { COLORS, DEFAULT_NOTICE_MESSAGE } from './src/constants/theme';
import { AudioService } from './src/services/audioService';
import { NotificationService } from './src/services/notificationService';

import SystemNoticeHeader from './src/components/SystemNoticeHeader';
import NoticeImageCard from './src/components/NoticeImageCard';
import WarningContent from './src/components/WarningContent';
import AudioControls from './src/components/AudioControls';
import PermissionModal from './src/components/PermissionModal';
import PlatformInfoModal from './src/components/PlatformInfoModal';

export default function App() {
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [warningMessage, setWarningMessage] = useState(DEFAULT_NOTICE_MESSAGE);
  const [audioStatus, setAudioStatus] = useState(AudioService.getStatus());
  const [permissionsVisible, setPermissionsVisible] = useState(false);
  const [platformInfoVisible, setPlatformInfoVisible] = useState(false);

  const appState = useRef(AppState.currentState);

  // Initialize notifications channel & permissions check on mount
  useEffect(() => {
    NotificationService.initChannel();

    // Subscribe to AudioService state
    const unsubscribe = AudioService.subscribe((status) => {
      setAudioStatus(status);
      setIsAlertActive(status.isPlaying);
    });

    // Handle AppState changes (ensuring audio remains verified in background)
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appState.current = nextAppState;
    });

    return () => {
      unsubscribe();
      subscription.remove();
      AudioService.destroy();
      NotificationService.dismissAlertNotification();
    };
  }, []);

  const handleToggleAlert = async () => {
    if (isAlertActive) {
      // Cease Alert
      try {
        await AudioService.stopAlert();
        await NotificationService.dismissAlertNotification();
      } catch (err) {
        console.error('Error stopping alert:', err);
      }
    } else {
      // Start Alert
      try {
        // Request or check notification permissions before displaying ongoing notice
        await NotificationService.requestPermissions();
        await AudioService.startAlert();
        await NotificationService.showActiveAlertNotification(warningMessage);
      } catch (err) {
        console.error('Failed to initiate alert:', err);
        Alert.alert(
          'Playback Notice',
          'Failed to trigger audio stream. Please verify audio permissions or asset integrity: ' + err.message
        );
      }
    }
  };

  const handleUpdateMessage = async (newMessage) => {
    setWarningMessage(newMessage);
    // If an alert is actively running, update the background notification text live
    if (isAlertActive) {
      await NotificationService.showActiveAlertNotification(newMessage);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top System Notice Header & Telemetry */}
          <SystemNoticeHeader
            isAlertActive={isAlertActive}
            onOpenPermissions={() => setPermissionsVisible(true)}
            onOpenPlatformInfo={() => setPlatformInfoVisible(true)}
          />

          {/* Replaceable Emblem / Graphic Card */}
          <NoticeImageCard isAlertActive={isAlertActive} />

          {/* Customizable Warning Content & Editor */}
          <WarningContent
            message={warningMessage}
            onUpdateMessage={handleUpdateMessage}
            isAlertActive={isAlertActive}
          />

          {/* Master Emergency Audio Controls & Status Telemetry */}
          <AudioControls
            isAlertActive={isAlertActive}
            onToggleAlert={handleToggleAlert}
            audioStatus={audioStatus}
          />
        </ScrollView>
      </View>

      {/* Permission Explanation Modal */}
      <PermissionModal
        visible={permissionsVisible}
        onClose={() => setPermissionsVisible(false)}
      />

      {/* OS Restrictions & Platform Deep Dive Modal */}
      <PlatformInfoModal
        visible={platformInfoVisible}
        onClose={() => setPlatformInfoVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
});
