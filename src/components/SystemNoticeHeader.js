import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function SystemNoticeHeader({ isAlertActive, onOpenPermissions, onOpenPlatformInfo }) {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toTimeString().split(' ')[0] +
        ' UTC' +
        (now.getTimezoneOffset() <= 0 ? '+' : '-') +
        Math.abs(now.getTimezoneOffset() / 60)
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Top telemetry bar */}
      <View style={styles.telemetryBar}>
        <View style={styles.statusIndicatorWrapper}>
          <View
            style={[
              styles.ledDot,
              isAlertActive ? styles.ledDotActive : styles.ledDotStandby,
            ]}
          />
          <Text style={styles.statusText}>
            {isAlertActive ? 'STATUS: CRITICAL BROADCAST' : 'STATUS: MONITORING STANDBY'}
          </Text>
        </View>

        <Text style={styles.timeText}>{timeString}</Text>
      </View>

      {/* Main Header title */}
      <View style={styles.titleSection}>
        <View style={styles.titleIconRow}>
          <MaterialCommunityIcons
            name={isAlertActive ? 'alert-octagon' : 'shield-alert'}
            size={28}
            color={isAlertActive ? COLORS.crimson : COLORS.amber}
          />
          <Text style={styles.title}>Operating System Notice</Text>
        </View>

        <Text style={styles.subtitle}>
          HOST RUNTIME: {Platform.OS.toUpperCase()} {Platform.Version ? `(v${Platform.Version})` : ''} • PROTOCOL SEC-9
        </Text>
      </View>

      {/* Action shortcuts */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.pillButton}
          onPress={onOpenPermissions}
          activeOpacity={0.7}
        >
          <Feather name="check-circle" size={13} color={COLORS.cyan} />
          <Text style={styles.pillText}>Permissions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.pillButton}
          onPress={onOpenPlatformInfo}
          activeOpacity={0.7}
        >
          <Feather name="info" size={13} color={COLORS.amber} />
          <Text style={[styles.pillText, { color: COLORS.amber }]}>OS Restrictions</Text>
        </TouchableOpacity>
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
  telemetryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
    marginBottom: 12,
  },
  statusIndicatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ledDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 8,
  },
  ledDotStandby: {
    backgroundColor: COLORS.emerald,
  },
  ledDotActive: {
    backgroundColor: COLORS.crimson,
    shadowColor: COLORS.crimson,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: COLORS.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  timeText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  titleSection: {
    marginBottom: 12,
  },
  titleIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBgElevated,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.cyan,
    marginLeft: 6,
  },
});
