import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { NotificationService } from '../services/notificationService';
import { COLORS } from '../constants/theme';

export default function PermissionModal({ visible, onClose }) {
  const [notificationGranted, setNotificationGranted] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (visible) {
      checkStatus();
    }
  }, [visible]);

  const checkStatus = async () => {
    setChecking(true);
    const granted = await NotificationService.checkPermissionStatus();
    setNotificationGranted(granted);
    setChecking(false);
  };

  const handleRequestPermissions = async () => {
    setChecking(true);
    const res = await NotificationService.requestPermissions();
    setNotificationGranted(res.granted);
    setChecking(false);
  };

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
                name="shield-account"
                size={22}
                color={COLORS.cyan}
              />
              <Text style={styles.modalTitle}>System Permission Transparency</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.introText}>
              In compliance with Android and Apple iOS platform guidelines, this application strictly requests only permissions vital for critical system alerts and audio continuity.
            </Text>

            {/* Permission 1: Background Audio */}
            <View style={styles.permCard}>
              <View style={styles.permCardHeader}>
                <Ionicons name="musical-notes" size={20} color={COLORS.emerald} />
                <View style={styles.permTextWrapper}>
                  <Text style={styles.permTitle}>1. Background Audio Playback</Text>
                  <Text style={styles.permStatusBadge}>NATIVE CAPABILITY CONFIGURED</Text>
                </View>
              </View>
              <Text style={styles.permDesc}>
                {Platform.OS === 'ios'
                  ? 'Configured via Apple UIBackgroundModes ("audio") in Info.plist. Enables continuous alarm playback when screen locks or app moves to background.'
                  : 'Configured via Android FOREGROUND_SERVICE_MEDIA_PLAYBACK and WAKE_LOCK. Keeps audio decoder active while the terminal is locked.'}
              </Text>
            </View>

            {/* Permission 2: Notifications */}
            <View style={styles.permCard}>
              <View style={styles.permCardHeader}>
                <Ionicons name="notifications" size={20} color={COLORS.amber} />
                <View style={styles.permTextWrapper}>
                  <Text style={styles.permTitle}>2. System Notifications</Text>
                  <Text
                    style={[
                      styles.permStatusBadge,
                      { color: notificationGranted ? COLORS.emerald : COLORS.amber },
                    ]}
                  >
                    {notificationGranted ? 'PERMISSION GRANTED' : 'ACTION REQUIRED'}
                  </Text>
                </View>
              </View>
              <Text style={styles.permDesc}>
                Required to display persistent emergency notifications in the notification drawer and lock screen during an active alert, enabling immediate stop control.
              </Text>
              {!notificationGranted && (
                <TouchableOpacity
                  style={styles.actionInlineBtn}
                  onPress={handleRequestPermissions}
                  disabled={checking}
                >
                  <Text style={styles.actionInlineBtnText}>
                    {checking ? 'Requesting...' : 'Grant Notification Permission'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Permission 3: Hardware Volume & DND Policy */}
            <View style={styles.permCard}>
              <View style={styles.permCardHeader}>
                <Ionicons name="volume-high" size={20} color={COLORS.cyan} />
                <View style={styles.permTextWrapper}>
                  <Text style={styles.permTitle}>3. Volume & Silent Mode Policy</Text>
                  <Text style={styles.permStatusBadge}>SYSTEM RESPECT MANDATE</Text>
                </View>
              </View>
              <Text style={styles.permDesc}>
                The application sets stream volume to 1.0 (100% of maximum OS permitted gain).
                
• iOS: Respects user physical hardware buttons; plays through ringer mute via AudioSession.
                
• Android: Respects Do-Not-Disturb and hardware volume rockers.
              </Text>
            </View>

            {/* Platform Constraints Card */}
            <View style={styles.legalBox}>
              <Text style={styles.legalTitle}>Platform Safety Guarantee</Text>
              <Text style={styles.legalText}>
                Neither iOS nor Android permits third-party applications to hijack physical power/sleep buttons or prevent users from task-switching or force-stopping the app. This application fully respects all host OS safeguards.
              </Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.doneButton} onPress={onClose}>
              <Text style={styles.doneButtonText}>Understood & Acknowledge</Text>
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
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  modalScroll: {
    marginBottom: 16,
  },
  introText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  permCard: {
    backgroundColor: COLORS.cardBgElevated,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
    marginBottom: 12,
  },
  permCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 6,
  },
  permTextWrapper: {
    flex: 1,
  },
  permTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  permStatusBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.emerald,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  permDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  actionInlineBtn: {
    backgroundColor: COLORS.amber,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  actionInlineBtnText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 12,
  },
  legalBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    marginTop: 4,
  },
  legalTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.crimson,
    marginBottom: 4,
  },
  legalText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  doneButton: {
    backgroundColor: COLORS.cyan,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 13,
  },
});
