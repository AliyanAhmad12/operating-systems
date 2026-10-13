import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function PlatformInfoModal({ visible, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <MaterialCommunityIcons
                name="cellphone-cog"
                size={22}
                color={COLORS.amber}
              />
              <Text style={styles.modalTitle}>OS Platform Architecture Differences</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {/* Current Host Banner */}
            <View style={styles.currentHostBanner}>
              <Text style={styles.hostLabel}>CURRENT RUNTIME HOST:</Text>
              <Text style={styles.hostValue}>
                {Platform.OS === 'ios' ? 'APPLE iOS (Sandbox & AVAudioSession)' : 'GOOGLE ANDROID (Linux Kernel & Services)'}
              </Text>
            </View>

            {/* Difference 1: Volume Control */}
            <View style={styles.topicCard}>
              <View style={styles.topicHeader}>
                <FontAwesome5 name="volume-up" size={16} color={COLORS.cyan} />
                <Text style={styles.topicTitle}>1. System Volume Control Restrictions</Text>
              </View>

              <View style={styles.diffRow}>
                <View style={styles.platformBadgeiOS}>
                  <Text style={styles.badgeText}>APPLE iOS</Text>
                </View>
                <Text style={styles.diffText}>
                  iOS Sandbox strictly forbids programmatic control of the master hardware volume slider. The app sets its internal audio pipeline to 1.0 (100% gain). By using AVAudioSession with "playsInSilentMode", audio plays through the physical hardware silent/mute toggle switch.
                </Text>
              </View>

              <View style={styles.diffRow}>
                <View style={styles.platformBadgeAndroid}>
                  <Text style={styles.badgeText}>ANDROID</Text>
                </View>
                <Text style={styles.diffText}>
                  Android separates audio into stream types (Alarm, Music, Notification). In modern Android, apps set relative stream volume to 1.0. Do Not Disturb (DND) bypass requires system settings override.
                </Text>
              </View>
            </View>

            {/* Difference 2: Background Audio Execution */}
            <View style={styles.topicCard}>
              <View style={styles.topicHeader}>
                <FontAwesome5 name="cog" size={16} color={COLORS.emerald} />
                <Text style={styles.topicTitle}>2. Background Audio & Task Lifecycle</Text>
              </View>

              <View style={styles.diffRow}>
                <View style={styles.platformBadgeiOS}>
                  <Text style={styles.badgeText}>APPLE iOS</Text>
                </View>
                <Text style={styles.diffText}>
                  Supported via "UIBackgroundModes: ['audio']". When the app enters the background or the screen is locked, the audio engine continues running without suspension. Now Playing controls integrate with Lock Screen.
                </Text>
              </View>

              <View style={styles.diffRow}>
                <View style={styles.platformBadgeAndroid}>
                  <Text style={styles.badgeText}>ANDROID</Text>
                </View>
                <Text style={styles.diffText}>
                  Requires FOREGROUND_SERVICE with FOREGROUND_SERVICE_MEDIA_PLAYBACK and WAKE_LOCK. Android maintains a sticky notification to keep the process alive against aggressive battery killers (Doze Mode).
                </Text>
              </View>
            </View>

            {/* Difference 3: Power Buttons & App Termination */}
            <View style={styles.topicCard}>
              <View style={styles.topicHeader}>
                <FontAwesome5 name="power-off" size={16} color={COLORS.crimson} />
                <Text style={styles.topicTitle}>3. Power Buttons & Termination Safeguards</Text>
              </View>
              <Text style={styles.summaryText}>
                Neither iOS nor Android permits consumer applications to disable the physical power button, block device shutdown, or disable OS gesture navigation. In accordance with platform security and user safety standards, our app provides a prominent, always-accessible "Cease Alert" stop button.
              </Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.closeModalBtn} onPress={onClose}>
              <Text style={styles.closeModalBtnText}>Close Guidelines</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 14,
    marginBottom: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  modalScroll: {
    marginBottom: 16,
  },
  currentHostBanner: {
    backgroundColor: COLORS.cardBgElevated,
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.cyan,
    marginBottom: 14,
  },
  hostLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  hostValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  topicCard: {
    backgroundColor: COLORS.cardBgElevated,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
    marginBottom: 14,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  topicTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  diffRow: {
    marginTop: 8,
  },
  platformBadgeiOS: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  platformBadgeAndroid: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  diffText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  summaryText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  closeModalBtn: {
    backgroundColor: COLORS.cardBgElevated,
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeModalBtnText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
});
