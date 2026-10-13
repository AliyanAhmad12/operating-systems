import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../constants/theme';

export default function AudioControls({
  isAlertActive,
  onToggleAlert,
  audioStatus,
}) {
  const handlePress = async () => {
    try {
      if (Platform.OS !== 'web') {
        if (isAlertActive) {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
      }
    } catch (e) {}
    onToggleAlert();
  };

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Main Trigger Button */}
      <TouchableOpacity
        style={[
          styles.mainButton,
          isAlertActive ? styles.stopButton : styles.startButton,
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContentRow}>
          <MaterialIcons
            name={isAlertActive ? 'stop' : 'warning'}
            size={28}
            color="#ffffff"
          />
          <View style={styles.buttonTextWrapper}>
            <Text style={styles.buttonMainText}>
              {isAlertActive ? 'CEASE ALERT (STOP AUDIO)' : 'ACTIVATE OS NOTICE ALERT'}
            </Text>
            <Text style={styles.buttonSubText}>
              {isAlertActive
                ? 'Stops alarm.mp3 and clears ongoing background notification'
                : 'Plays custom alarm.mp3 continuously at maximum OS volume ceiling'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Acoustic & Platform Telemetry Grid */}
      <View style={styles.telemetryGrid}>
        <View style={styles.telemetryCard}>
          <View style={styles.cardLabelRow}>
            <Ionicons name="volume-high" size={14} color={COLORS.cyan} />
            <Text style={styles.cardLabel}>AUDIO GAIN</Text>
          </View>
          <Text style={styles.cardValue}>100% (1.0)</Text>
          <Text style={styles.cardSub}>OS System Ceiling</Text>
        </View>

        <View style={styles.telemetryCard}>
          <View style={styles.cardLabelRow}>
            <Ionicons name="repeat" size={14} color={COLORS.amber} />
            <Text style={styles.cardLabel}>LOOP MODE</Text>
          </View>
          <Text style={styles.cardValue}>CONTINUOUS</Text>
          <Text style={styles.cardSub}>Auto-restarting</Text>
        </View>

        <View style={styles.telemetryCard}>
          <View style={styles.cardLabelRow}>
            <FontAwesome5 name="clock" size={12} color={COLORS.emerald} />
            <Text style={styles.cardLabel}>RUNTIME</Text>
          </View>
          <Text style={styles.cardValue}>
            {formatSeconds(audioStatus?.playbackSeconds || 0)}
          </Text>
          <Text style={styles.cardSub}>{isAlertActive ? 'Active Stream' : 'Standby'}</Text>
        </View>

        <View style={styles.telemetryCard}>
          <View style={styles.cardLabelRow}>
            <Ionicons name="shield-checkmark" size={14} color={COLORS.textSecondary} />
            <Text style={styles.cardLabel}>BACKGROUND</Text>
          </View>
          <Text style={styles.cardValue}>ENABLED</Text>
          <Text style={styles.cardSub}>
            {Platform.OS === 'ios' ? 'UIBackgroundModes' : 'Foreground Service'}
          </Text>
        </View>
      </View>

      {/* Safety Notice regarding hardware buttons */}
      <View style={styles.safetyNoticeBox}>
        <Ionicons name="information-circle-outline" size={16} color={COLORS.textSecondary} />
        <Text style={styles.safetyNoticeText}>
          Safety Guideline: Device power buttons and system hardware volume controls remain fully functional under operating system safety standards.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
  },
  mainButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: COLORS.crimson,
    shadowColor: COLORS.crimson,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  stopButton: {
    backgroundColor: '#b91c1c',
    borderWidth: 2,
    borderColor: '#fca5a5',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 14,
    elevation: 8,
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonTextWrapper: {
    flex: 1,
  },
  buttonMainText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  buttonSubText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 2,
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  telemetryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.cardBgElevated,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
  },
  cardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  cardSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  safetyNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    padding: 10,
    borderRadius: 8,
  },
  safetyNoticeText: {
    flex: 1,
    fontSize: 10,
    color: COLORS.textMuted,
    lineHeight: 14,
  },
});
