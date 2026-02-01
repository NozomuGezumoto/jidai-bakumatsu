// ============================================
// 幕末歴史アプリ - イベント詳細画面
// 背景画像 + 半透明オーバーレイ + テキストシャドウ
// ============================================

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Pressable,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';
import { BakumatsuStackParamList, PERSONS } from '../types/bakumatsu';
import { useBakumatsuStore } from '../store/useBakumatsuStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<
  BakumatsuStackParamList,
  'EventDetail'
>;
type EventDetailRouteProp = RouteProp<BakumatsuStackParamList, 'EventDetail'>;

// 和暦変換
function getJapaneseEra(year: number): string {
  if (year >= 1868) return `明治${year - 1867}年`;
  if (year >= 1865) return `慶応${year - 1864}年`;
  if (year >= 1861) return `文久${year - 1860}年`;
  if (year >= 1860) return `万延${year - 1859}年`;
  if (year >= 1854) return `安政${year - 1853}年`;
  return `嘉永${year - 1847}年`;
}

// デフォルト背景画像（幕末風の和柄パターン）
const DEFAULT_BACKGROUND = require('../../assets/images/splash-icon.png');

export default function EventDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EventDetailRouteProp>();
  const insets = useSafeAreaInsets();

  const { eventId } = route.params;
  const getEventById = useBakumatsuStore((state) => state.getEventById);

  const event = useMemo(() => getEventById(eventId), [eventId, getEventById]);

  if (!event) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>イベントが見つかりません</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>戻る</Text>
        </Pressable>
      </View>
    );
  }

  const backgroundSource = event.imageUri
    ? { uri: event.imageUri }
    : DEFAULT_BACKGROUND;

  return (
    <View style={styles.container}>
      {/* 背景画像 */}
      <ImageBackground
        source={backgroundSource}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* 半透明グラデーションオーバーレイ */}
        <LinearGradient
          colors={[
            'rgba(15, 15, 20, 0.3)',
            'rgba(15, 15, 20, 0.7)',
            'rgba(15, 15, 20, 0.95)',
          ]}
          locations={[0, 0.3, 0.6]}
          style={styles.overlay}
        >
          {/* ヘッダー */}
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.headerButton}
            >
              <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 年号バッジ */}
            <View style={styles.yearSection}>
              <View style={styles.yearBadge}>
                <Text style={styles.yearNumber}>{event.year}</Text>
              </View>
              <Text style={styles.japaneseEra}>{getJapaneseEra(event.year)}</Text>
            </View>

            {/* タイトル */}
            <Text style={styles.title}>{event.title}</Text>

            {/* 場所 */}
            <View style={styles.placeRow}>
              <Ionicons name="location" size={18} color={COLORS.accentGold} />
              <Text style={styles.placeName}>{event.placeName}</Text>
            </View>

            {/* 人物タグ */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>関連人物</Text>
              <View style={styles.tagsContainer}>
                {event.persons.map((personId) => {
                  const person = PERSONS[personId];
                  return (
                    <View
                      key={personId}
                      style={[
                        styles.personTag,
                        { backgroundColor: person.color },
                      ]}
                    >
                      <Text style={styles.personTagText}>{person.nameKanji}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* サマリー */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>概要</Text>
              <Text style={styles.summary}>{event.summary}</Text>
            </View>

            {/* 位置情報 */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>位置情報</Text>
              <View style={styles.locationRow}>
                <Ionicons name="navigate" size={14} color={COLORS.textMuted} />
                <Text style={styles.locationText}>
                  {event.lat.toFixed(4)}, {event.lng.toFixed(4)}
                </Text>
              </View>
            </View>

            {/* 参考文献 */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>参考文献</Text>
              <View style={styles.sourcesContainer}>
                {event.sources.map((source, index) => (
                  <View key={index} style={styles.sourceItem}>
                    <Text style={styles.sourceNumber}>{index + 1}.</Text>
                    <Text style={styles.sourceText}>{source}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 下部余白 */}
            <View style={{ height: insets.bottom + SPACING.xxxl }} />
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SCREEN_HEIGHT * 0.15,
  },
  yearSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  yearBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  yearNumber: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  japaneseEra: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.accentGold,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.display,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: TYPOGRAPHY.fontSize.display * 1.3,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  placeName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.accentGold,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  personTag: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  personTagText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  summary: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.fontSize.lg * 1.8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  locationText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sourcesContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accentGold,
  },
  sourceItem: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  sourceNumber: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.accentGold,
    marginRight: SPACING.sm,
    fontWeight: '600',
  },
  sourceText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.fontSize.sm * 1.5,
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  backLink: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.primary,
  },
});

