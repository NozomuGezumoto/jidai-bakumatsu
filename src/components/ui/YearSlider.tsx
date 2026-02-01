// ============================================
// 幕末歴史アプリ - 年号スライダー
// イベントがある年のみ選択可能
// ============================================

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useBakumatsuStore } from '../../store/useBakumatsuStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH - SPACING.lg * 4;
const THUMB_SIZE = 32;
const TRACK_HEIGHT = 6;

// 和暦変換（簡易版）
function getJapaneseEra(year: number): string {
  if (year >= 1868) return `明治${year - 1867}年`;
  if (year >= 1865) return `慶応${year - 1864}年`;
  if (year >= 1861) return `文久${year - 1860}年`;
  if (year >= 1860) return `万延${year - 1859}年`;
  if (year >= 1854) return `安政${year - 1853}年`;
  return `嘉永${year - 1847}年`;
}

export default function YearSlider() {
  const selectedYear = useBakumatsuStore((state) => state.selectedYear);
  const setSelectedYear = useBakumatsuStore((state) => state.setSelectedYear);
  const selectedPersons = useBakumatsuStore((state) => state.selectedPersons);
  const getYearsWithEvents = useBakumatsuStore((state) => state.getYearsWithEvents);
  const goToPrevYear = useBakumatsuStore((state) => state.goToPrevYear);
  const goToNextYear = useBakumatsuStore((state) => state.goToNextYear);

  // イベントがある年のリスト（人物フィルター考慮）
  const yearsWithEvents = useMemo(() => {
    const years = getYearsWithEvents();
    // 空の場合はデフォルトの年を返す
    return years.length > 0 ? years : [selectedYear];
  }, [getYearsWithEvents, selectedPersons, selectedYear]);

  // インデックスベースでスライダーを計算
  const totalSteps = Math.max(0, yearsWithEvents.length - 1);
  const stepWidth = totalSteps > 0 ? SLIDER_WIDTH / totalSteps : SLIDER_WIDTH;

  // 現在の年のインデックス
  const currentIndex = useMemo(() => {
    if (yearsWithEvents.length === 0) return 0;
    const idx = yearsWithEvents.indexOf(selectedYear);
    return idx >= 0 ? idx : 0;
  }, [yearsWithEvents, selectedYear]);

  // インデックスからX位置を計算
  const indexToX = useCallback(
    (index: number) => index * stepWidth,
    [stepWidth]
  );

  // X位置からインデックスを計算
  const xToIndex = useCallback(
    (x: number) => {
      if (totalSteps === 0) return 0;
      const clampedX = Math.max(0, Math.min(SLIDER_WIDTH, x));
      const index = Math.round(clampedX / stepWidth);
      return Math.max(0, Math.min(totalSteps, index));
    },
    [stepWidth, totalSteps]
  );

  const translateX = useSharedValue(indexToX(currentIndex));

  const updateYearFromIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < yearsWithEvents.length) {
        setSelectedYear(yearsWithEvents[index]);
      }
    },
    [setSelectedYear, yearsWithEvents]
  );

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      const newX = Math.max(0, Math.min(SLIDER_WIDTH, event.x));
      translateX.value = newX;
      const newIndex = xToIndex(newX);
      runOnJS(updateYearFromIndex)(newIndex);
    })
    .onEnd(() => {
      // スナップ
      const snapX = indexToX(currentIndex);
      translateX.value = withSpring(snapX, {
        damping: 15,
        stiffness: 150,
      });
    });

  // 年が変わったらスライダー位置を更新
  React.useEffect(() => {
    const newX = indexToX(currentIndex);
    translateX.value = withSpring(newX, {
      damping: 15,
      stiffness: 150,
    });
  }, [currentIndex, indexToX, translateX]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value - THUMB_SIZE / 2 }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: translateX.value,
  }));

  // 前後ボタンの有効/無効
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalSteps;

  return (
    <View style={styles.container}>
      {/* 年表示 */}
      <View style={styles.yearDisplay}>
        <Pressable
          onPress={goToPrevYear}
          style={[styles.arrowButton, !canGoPrev && styles.arrowButtonDisabled]}
          disabled={!canGoPrev}
        >
          <Text style={[styles.arrowText, !canGoPrev && styles.arrowTextDisabled]}>
            ◀
          </Text>
        </Pressable>

        <View style={styles.yearTextContainer}>
          <Text style={styles.yearNumber}>{selectedYear}</Text>
          <Text style={styles.japaneseEra}>{getJapaneseEra(selectedYear)}</Text>
        </View>

        <Pressable
          onPress={goToNextYear}
          style={[styles.arrowButton, !canGoNext && styles.arrowButtonDisabled]}
          disabled={!canGoNext}
        >
          <Text style={[styles.arrowText, !canGoNext && styles.arrowTextDisabled]}>
            ▶
          </Text>
        </Pressable>
      </View>

      {/* スライダー */}
      <View style={styles.sliderContainer}>
        <GestureDetector gesture={gesture}>
          <View style={styles.sliderTrack}>
            {/* 背景トラック */}
            <View style={styles.trackBackground} />

            {/* 進行トラック */}
            <Animated.View style={[styles.trackProgress, progressStyle]} />

            {/* イベントがある年のマーカー（ドットのみ） */}
            {yearsWithEvents.map((year, index) => (
              <Pressable
                key={year}
                onPress={() => setSelectedYear(year)}
                style={[
                  styles.eventMarker,
                  {
                    left: indexToX(index) - 4,
                  },
                  year === selectedYear && styles.eventMarkerActive,
                ]}
              />
            ))}

            {/* サム（つまみ） */}
            <Animated.View style={[styles.thumb, thumbStyle]}>
              <Text style={styles.thumbText}>⚔</Text>
            </Animated.View>
          </View>
        </GestureDetector>

        {/* 年ラベル */}
        <View style={styles.yearLabels}>
          <Text style={styles.yearLabel}>
            {yearsWithEvents[0] || ''}
          </Text>
          <Text style={styles.yearLabelCenter}>
            {yearsWithEvents.length}年分
          </Text>
          <Text style={styles.yearLabel}>
            {yearsWithEvents[yearsWithEvents.length - 1] || ''}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.mapOverlay,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    ...SHADOWS.md,
  },
  yearDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  arrowButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButtonDisabled: {
    opacity: 0.3,
  },
  arrowText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  arrowTextDisabled: {
    color: COLORS.textMuted,
  },
  yearTextContainer: {
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
  },
  yearNumber: {
    fontSize: TYPOGRAPHY.fontSize.display,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  japaneseEra: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.accentGold,
    marginTop: 2,
  },
  sliderContainer: {
    paddingHorizontal: SPACING.md,
  },
  sliderTrack: {
    height: THUMB_SIZE + 30,
    justifyContent: 'center',
  },
  trackBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: TRACK_HEIGHT,
    backgroundColor: COLORS.surface,
    borderRadius: TRACK_HEIGHT / 2,
  },
  trackProgress: {
    position: 'absolute',
    left: 0,
    height: TRACK_HEIGHT,
    backgroundColor: COLORS.primary,
    borderRadius: TRACK_HEIGHT / 2,
  },
  eventMarker: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accentGold,
    top: (THUMB_SIZE + 30) / 2 - 4,
  },
  eventMarkerActive: {
    backgroundColor: COLORS.textPrimary,
    transform: [{ scale: 1.5 }],
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.textPrimary,
    ...SHADOWS.md,
  },
  thumbText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  yearLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  yearLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  yearLabelCenter: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
});
