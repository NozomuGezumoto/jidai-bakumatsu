// ============================================
// 幕末歴史アプリ - イベントプレビューシート
// ピンタップ時に表示する簡易プレビュー
// ============================================

import React, { forwardRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/theme';
import { BakumatsuEvent, PERSONS, Person } from '../../types/bakumatsu';
import { useBakumatsuStore } from '../../store/useBakumatsuStore';

interface EventPreviewSheetProps {
  event: BakumatsuEvent | null;
  onClose: () => void;
  onOpenDetail: () => void;
  onEdit?: () => void; // 編集コールバック
}

const EventPreviewSheet = forwardRef<BottomSheet, EventPreviewSheetProps>(
  ({ event, onClose, onOpenDetail, onEdit }, ref) => {
    const snapPoints = useMemo(() => ['40%'], []);
    const removeCustomEvent = useBakumatsuStore((state) => state.removeCustomEvent);
    const customPersons = useBakumatsuStore((state) => state.customPersons);

    // 全人物（ビルトイン + カスタム）
    const allPersons = useMemo(() => {
      return { ...PERSONS, ...customPersons } as Record<string, Person>;
    }, [customPersons]);

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          onClose();
        }
      },
      [onClose]
    );

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    // カスタムイベントかどうか
    const isCustomEvent = event?.id.startsWith('custom-');

    // イベント削除
    const handleDelete = useCallback(() => {
      if (!event || !isCustomEvent) return;

      Alert.alert(
        'イベントを削除',
        `「${event.title}」を削除しますか？`,
        [
          { text: 'キャンセル', style: 'cancel' },
          {
            text: '削除',
            style: 'destructive',
            onPress: () => {
              removeCustomEvent(event.id);
              onClose();
            },
          },
        ]
      );
    }, [event, isCustomEvent, removeCustomEvent, onClose]);

    if (!event) return null;

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View style={styles.content}>
          {/* ヘッダー */}
          <View style={styles.header}>
            <View style={styles.yearBadge}>
              <Text style={styles.yearText}>{event.year}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </Pressable>
          </View>

          {/* タイトル */}
          <Text style={styles.title}>{event.title}</Text>

          {/* 場所 */}
          <View style={styles.placeRow}>
            <Ionicons name="location" size={14} color={COLORS.accentGold} />
            <Text style={styles.placeName}>{event.placeName}</Text>
          </View>

          {/* 人物タグ */}
          <View style={styles.personsRow}>
            {event.persons.map((personId) => {
              const person = allPersons[personId];
              if (!person) return null;
              return (
                <View
                  key={personId}
                  style={[styles.personTag, { backgroundColor: person.color }]}
                >
                  <Text style={styles.personTagText}>{person.nameKanji}</Text>
                </View>
              );
            })}
          </View>

          {/* サマリー（省略） */}
          <Text style={styles.summary} numberOfLines={2}>
            {event.summary}
          </Text>

          {/* ボタン行 */}
          <View style={styles.buttonRow}>
            {/* 詳細ボタン */}
            <Pressable style={styles.detailButton} onPress={onOpenDetail}>
              <Text style={styles.detailButtonText}>詳細を見る</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.textPrimary}
              />
            </Pressable>

            {/* 編集ボタン（カスタムイベントのみ） */}
            {isCustomEvent && onEdit && (
              <Pressable style={styles.editButton} onPress={onEdit}>
                <Ionicons name="pencil-outline" size={20} color="#FFF" />
              </Pressable>
            )}

            {/* 削除ボタン（カスタムイベントのみ） */}
            {isCustomEvent && (
              <Pressable style={styles.deleteButton} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={20} color="#FFF" />
              </Pressable>
            )}
          </View>
        </View>
      </BottomSheet>
    );
  }
);

EventPreviewSheet.displayName = 'EventPreviewSheet';

export default EventPreviewSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: COLORS.backgroundElevated,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  handleIndicator: {
    backgroundColor: COLORS.textMuted,
    width: 40,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  yearBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  yearText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  placeName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.accentGold,
  },
  personsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  personTag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
  },
  personTagText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  summary: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.fontSize.md * 1.6,
    marginBottom: SPACING.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  detailButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  detailButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  editButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.accentGold,
    borderRadius: RADIUS.lg,
  },
  deleteButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C62828',
    borderRadius: RADIUS.lg,
  },
});

