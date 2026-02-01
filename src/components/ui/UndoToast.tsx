// ============================================
// 幕末歴史アプリ - Undoトースト
// 削除操作後に表示するUndo用のトースト
// ============================================

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/theme';
import { useBakumatsuStore } from '../../store/useBakumatsuStore';

const TOAST_DURATION = 5000; // 5秒間表示

export default function UndoToast() {
  const lastDeletedEvent = useBakumatsuStore((state) => state.lastDeletedEvent);
  const undoDeleteEvent = useBakumatsuStore((state) => state.undoDeleteEvent);
  const clearDeletedEvent = useBakumatsuStore((state) => state.clearDeletedEvent);
  
  const [slideAnim] = useState(new Animated.Value(100));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (lastDeletedEvent) {
      // トーストを表示
      setIsVisible(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();

      // 自動で非表示
      const timer = setTimeout(() => {
        hideToast();
      }, TOAST_DURATION);

      return () => clearTimeout(timer);
    }
  }, [lastDeletedEvent]);

  const hideToast = () => {
    Animated.timing(slideAnim, {
      toValue: 100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
      clearDeletedEvent();
    });
  };

  const handleUndo = () => {
    undoDeleteEvent();
    Animated.timing(slideAnim, {
      toValue: 100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
    });
  };

  if (!isVisible || !lastDeletedEvent) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.content}>
        <Ionicons name="trash" size={18} color={COLORS.textSecondary} />
        <Text style={styles.message} numberOfLines={1}>
          「{lastDeletedEvent.title}」を削除しました
        </Text>
        <Pressable style={styles.undoButton} onPress={handleUndo}>
          <Text style={styles.undoButtonText}>元に戻す</Text>
        </Pressable>
        <Pressable style={styles.closeButton} onPress={hideToast}>
          <Ionicons name="close" size={18} color={COLORS.textMuted} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: SPACING.md,
    right: SPACING.md,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundElevated,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    gap: SPACING.sm,
  },
  message: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
  },
  undoButton: {
    backgroundColor: COLORS.accentGold,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
  },
  undoButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '700',
    color: '#FFF',
  },
  closeButton: {
    padding: 4,
  },
});

