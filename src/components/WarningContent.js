import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { COLORS, NOTICE_PRESETS, DEFAULT_NOTICE_MESSAGE } from '../constants/theme';

export default function WarningContent({ message, onUpdateMessage, isAlertActive }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [draftMessage, setDraftMessage] = useState(message);

  const handleOpenModal = () => {
    setDraftMessage(message);
    setModalVisible(true);
  };

  const handleSave = () => {
    onUpdateMessage(draftMessage.trim() || DEFAULT_NOTICE_MESSAGE);
    setModalVisible(false);
  };

  const handleApplyPreset = (presetText) => {
    setDraftMessage(presetText);
  };

  return (
    <View style={styles.container}>
      {/* Warning Box Header */}
      <View style={styles.headerRow}>
        <View style={styles.severityBadge}>
          <MaterialCommunityIcons
            name="alert-decagram"
            size={16}
            color={COLORS.crimson}
          />
          <Text style={styles.severityText}>SECURITY LEVEL: SEV-1 CRITICAL</Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={handleOpenModal}
          activeOpacity={0.7}
        >
          <Feather name="edit-3" size={13} color={COLORS.cyan} />
          <Text style={styles.editText}>Customize</Text>
        </TouchableOpacity>
      </View>

      {/* Main Warning Box */}
      <View
        style={[
          styles.messageBox,
          isAlertActive && styles.messageBoxActive,
        ]}
      >
        <Text style={styles.messageText}>{message}</Text>
      </View>

      {/* Customization Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Feather name="edit" size={18} color={COLORS.cyan} />
                <Text style={styles.modalTitle}>Customize Alert Notice</Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                <Feather name="x" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.label}>Notice Text (Custom Message):</Text>
              <TextInput
                style={styles.textInput}
                value={draftMessage}
                onChangeText={setDraftMessage}
                multiline
                numberOfLines={4}
                placeholder="Enter alert warning message..."
                placeholderTextColor={COLORS.textMuted}
                textAlignVertical="top"
              />

              <Text style={[styles.label, { marginTop: 16 }]}>Quick Presets:</Text>
              <View style={styles.presetsGrid}>
                {NOTICE_PRESETS.map((preset) => (
                  <TouchableOpacity
                    key={preset.id}
                    style={styles.presetChip}
                    onPress={() => handleApplyPreset(preset.text)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.presetTitle}>{preset.title}</Text>
                    <Text style={styles.presetBadge}>{preset.badge}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveText}>Save Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.crimsonMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  severityText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.crimson,
    letterSpacing: 0.5,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.cardBgElevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
  },
  editText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.cyan,
  },
  messageBox: {
    backgroundColor: COLORS.cardBgElevated,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.amber,
  },
  messageBoxActive: {
    borderLeftColor: COLORS.crimson,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  messageText: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '85%',
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
    paddingBottom: 12,
    marginBottom: 16,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  modalScroll: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: COLORS.cardBgElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
    color: COLORS.textPrimary,
    padding: 12,
    fontSize: 13,
    minHeight: 90,
  },
  presetsGrid: {
    gap: 8,
  },
  presetChip: {
    backgroundColor: COLORS.cardBgElevated,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  presetTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  presetBadge: {
    fontSize: 10,
    color: COLORS.amber,
    marginTop: 2,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.cardBgElevated,
  },
  cancelText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: COLORS.crimson,
  },
  saveText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '700',
  },
});
