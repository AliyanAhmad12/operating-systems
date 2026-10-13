import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const NOTICE_IMAGE_SOURCE = require('../../assets/notice-image.png');

export default function NoticeImageCard({ isAlertActive }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let animationLoop;
    if (isAlertActive) {
      animationLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      animationLoop.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      if (animationLoop) animationLoop.stop();
    };
  }, [isAlertActive]);

  return (
    <View
      style={[
        styles.cardContainer,
        isAlertActive && styles.cardContainerActive,
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.badgeRow}>
          <MaterialCommunityIcons
            name="shield-alert-outline"
            size={16}
            color={isAlertActive ? COLORS.crimson : COLORS.amber}
          />
          <Text
            style={[
              styles.badgeText,
              { color: isAlertActive ? COLORS.crimson : COLORS.amber },
            ]}
          >
            {isAlertActive ? 'ACTIVE SYSTEM ADVISORY' : 'ADVISORY EMBLEM'}
          </Text>
        </View>

        <Text style={styles.assetPathTag}>assets/notice-image.png</Text>
      </View>

      {/* Emblem graphic wrapper */}
      <View style={styles.imageWrapper}>
        <Animated.View
          style={[
            styles.animatedContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Image
            source={NOTICE_IMAGE_SOURCE}
            style={styles.noticeImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.footerNote}>
          Replaceable asset in project root: <Text style={styles.boldWhite}>/assets/notice-image.png</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  cardContainerActive: {
    borderColor: COLORS.crimson,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    shadowColor: COLORS.crimson,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  assetPathTag: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontFamily: 'monospace',
    backgroundColor: COLORS.cardBgElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  imageWrapper: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  animatedContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticeImage: {
    width: 170,
    height: 170,
  },
  cardFooter: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    marginTop: 8,
    alignItems: 'center',
  },
  footerNote: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  boldWhite: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
});
