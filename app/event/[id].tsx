// ============================================
// 幕末歴史アプリ - イベント詳細画面
// インスタ風没入型 + ピン記録機能
// ============================================

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ImageBackground,
    Linking,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddEventModal from '../../src/components/ui/AddEventModal';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../src/constants/theme';
import { useBakumatsuStore } from '../../src/store/useBakumatsuStore';
import { Person, PERSONS, PinRank, RANK_COLORS, RANK_LABELS, Source } from '../../src/types/bakumatsu';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// recordSection: marginHorizontal(SPACING.lg*2) + padding(SPACING.lg*2) + gap(SPACING.sm*2)
const PHOTO_SIZE = (SCREEN_WIDTH - SPACING.lg * 4 - SPACING.sm * 2) / 3;

// 和暦変換
function getJapaneseEra(year: number): string {
  if (year >= 1868) return `明治${year - 1867}年`;
  if (year >= 1865) return `慶応${year - 1864}年`;
  if (year >= 1861) return `文久${year - 1860}年`;
  if (year >= 1860) return `万延${year - 1859}年`;
  if (year >= 1854) return `安政${year - 1853}年`;
  return `嘉永${year - 1847}年`;
}

const DEFAULT_BACKGROUND = require('../../assets/images/splash-icon.png');
const FUJI_BACKGROUND = require('../../assets/images/backgrounds/fuji.jpg');

// 藩別背景画像
const FACTION_BACKGROUNDS: Record<string, any> = {
  shinsengumi: require('../../assets/images/backgrounds/shinsengumi.png'),
  satsuma: require('../../assets/images/backgrounds/satsuma.jpg'),
  choshu: require('../../assets/images/backgrounds/choshu.jpg'),
  tosa: require('../../assets/images/backgrounds/tosa.jpg'),
  bakufu: require('../../assets/images/backgrounds/bakufu.jpg'),
};

export default function EventDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const getEventById = useBakumatsuStore((state) => state.getEventById);
  const pinRecords = useBakumatsuStore((state) => state.pinRecords);
  const addPhoto = useBakumatsuStore((state) => state.addPhoto);
  const removePhoto = useBakumatsuStore((state) => state.removePhoto);
  const setNote = useBakumatsuStore((state) => state.setNote);
  const setRank = useBakumatsuStore((state) => state.setRank);
  const setCoverImage = useBakumatsuStore((state) => state.setCoverImage);
  const setMainBackground = useBakumatsuStore((state) => state.setMainBackground);
  const removeCustomEvent = useBakumatsuStore((state) => state.removeCustomEvent);
  const customPersons = useBakumatsuStore((state) => state.customPersons);
  const customEvents = useBakumatsuStore((state) => state.customEvents);
  const selectedYear = useBakumatsuStore((state) => state.selectedYear);

  const event = useMemo(() => getEventById(id || ''), [id, getEventById]);
  
  // pinRecordsを直接購読して、変更時に再レンダリングされるようにする
  const pinRecord = id ? pinRecords[id] : undefined;

  // カスタムイベントかどうか
  const isCustomEvent = id?.startsWith('custom-') || false;

  // 全人物（ビルトイン + カスタム）
  const allPersons = useMemo(() => {
    return { ...PERSONS, ...customPersons } as Record<string, Person>;
  }, [customPersons]);

  const [noteText, setNoteText] = useState(pinRecord?.note || '');
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // 編集モーダルを開く
  const handleOpenEditModal = useCallback(() => {
    setShowEditModal(true);
  }, []);

  // 編集モーダルを閉じる
  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false);
  }, []);

  // 写真を追加
  const handleAddPhoto = useCallback(async () => {
    if (!id) return;
    
    const currentPhotos = pinRecord?.photos || [];
    if (currentPhotos.length >= 3) {
      Alert.alert('上限に達しました', '写真は最大3枚までです');
      return;
    }

    Alert.alert(
      '写真を追加',
      '',
      [
        {
          text: 'カメラで撮影',
          onPress: async () => {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) return;
            
            const result = await ImagePicker.launchCameraAsync({
              quality: 0.8,
              allowsEditing: true,
              aspect: [4, 3],
            });
            
            if (!result.canceled && result.assets[0]) {
              addPhoto(id, result.assets[0].uri);
            }
          },
        },
        {
          text: 'ライブラリから選択',
          onPress: async () => {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) return;
            
            const result = await ImagePicker.launchImageLibraryAsync({
              quality: 0.8,
              allowsEditing: true,
              aspect: [4, 3],
            });
            
            if (!result.canceled && result.assets[0]) {
              addPhoto(id, result.assets[0].uri);
            }
          },
        },
        { text: 'キャンセル', style: 'cancel' },
      ]
    );
  }, [id, pinRecord, addPhoto]);

  // 背景画像を選択して変更
  const selectAndSetImage = useCallback(async (
    setter: (eventId: string, uri: string | undefined) => void,
    aspect: [number, number]
  ) => {
    if (!id) return;

    Alert.alert(
      '画像を選択',
      '',
      [
        {
          text: 'カメラで撮影',
          onPress: async () => {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) return;
            
            const result = await ImagePicker.launchCameraAsync({
              quality: 0.8,
              allowsEditing: true,
              aspect,
            });
            
            if (!result.canceled && result.assets[0]) {
              setter(id, result.assets[0].uri);
            }
          },
        },
        {
          text: 'ライブラリから選択',
          onPress: async () => {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) return;
            
            const result = await ImagePicker.launchImageLibraryAsync({
              quality: 0.8,
              allowsEditing: true,
              aspect,
            });
            
            if (!result.canceled && result.assets[0]) {
              setter(id, result.assets[0].uri);
            }
          },
        },
        { text: 'キャンセル', style: 'cancel' },
      ]
    );
  }, [id]);

  // 背景画像を変更
  const handleChangeCoverImage = useCallback(() => {
    if (!id) return;

    const options: any[] = [
      {
        text: '上の背景を変更',
        onPress: () => {
          if (pinRecord?.coverImage) {
            Alert.alert(
              '上の背景',
              '',
              [
                { text: '新しい画像を選択', onPress: () => selectAndSetImage(setCoverImage, [16, 9]) },
                { text: 'デフォルトに戻す', onPress: () => setCoverImage(id, undefined) },
                { text: 'キャンセル', style: 'cancel' },
              ]
            );
          } else {
            selectAndSetImage(setCoverImage, [16, 9]);
          }
        },
      },
      {
        text: '下の背景を変更',
        onPress: () => {
          if (pinRecord?.mainBackground) {
            Alert.alert(
              '下の背景',
              '',
              [
                { text: '新しい画像を選択', onPress: () => selectAndSetImage(setMainBackground, [9, 16]) },
                { text: 'デフォルトに戻す', onPress: () => setMainBackground(id, undefined) },
                { text: 'キャンセル', style: 'cancel' },
              ]
            );
          } else {
            selectAndSetImage(setMainBackground, [9, 16]);
          }
        },
      },
      { text: 'キャンセル', style: 'cancel' },
    ];

    Alert.alert('背景画像を変更', '', options);
  }, [id, pinRecord, setCoverImage, setMainBackground, selectAndSetImage]);

  // 写真を削除
  const handleRemovePhoto = useCallback((photoUri: string) => {
    if (!id) return;
    Alert.alert(
      '写真を削除',
      'この写真を削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => removePhoto(id, photoUri),
        },
      ]
    );
  }, [id, removePhoto]);

  // メモを保存
  const handleNoteBlur = useCallback(() => {
    if (!id) return;
    setNote(id, noteText);
  }, [id, noteText, setNote]);

  // ランクを設定
  const handleSetRank = useCallback((rank: PinRank) => {
    if (!id) return;
    // 同じランクをタップしたら解除
    if (pinRecord?.rank === rank) {
      setRank(id, undefined);
    } else {
      setRank(id, rank);
    }
  }, [id, pinRecord, setRank]);

  // 外部リンクを開く
  const handleOpenSource = async (source: Source) => {
    try {
      const supported = await Linking.canOpenURL(source.url);
      if (supported) {
        await Linking.openURL(source.url);
      }
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  // カスタムイベントを削除
  const handleDeleteEvent = useCallback(() => {
    if (!id || !isCustomEvent || !event) return;

    Alert.alert(
      'イベントを削除',
      `「${event.title}」を削除しますか？\nこの操作は取り消せます。`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            removeCustomEvent(id);
            router.back();
          },
        },
      ]
    );
  }, [id, isCustomEvent, event, removeCustomEvent, router]);

  if (!id) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>イベントが見つかりません</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>戻る</Text>
        </Pressable>
      </View>
    );
  }

  const primaryPerson = event.persons.length > 0 ? allPersons[event.persons[0]] : null;
  const primaryPersonColor = primaryPerson?.color || COLORS.primary;
  const primaryFaction = primaryPerson?.faction;

  // 背景画像を選択（優先順位：カスタム背景 > イベント背景 > 藩背景 > ソース画像 > デフォルト）
  const getCoverImageSource = () => {
    // 1. ユーザーが設定したカスタム背景（最優先）
    if (pinRecord?.coverImage) {
      return { uri: pinRecord.coverImage };
    }
    // 2. イベント固有の背景
    if (event.coverImage) {
      return { uri: event.coverImage };
    }
    // 3. 藩・所属に基づく背景
    if (primaryFaction && FACTION_BACKGROUNDS[primaryFaction]) {
      return FACTION_BACKGROUNDS[primaryFaction];
    }
    // 4. ソースの画像
    if (event.sources[0]?.imageUrl) {
      return { uri: event.sources[0].imageUrl };
    }
    // 5. デフォルト
    return DEFAULT_BACKGROUND;
  };
  
  const coverImageSource = getCoverImageSource();

  const photos = pinRecord?.photos || [];

  // 下部背景画像を取得（カスタム背景があればそれを使用、なければfuji.jpg）
  const mainBackgroundSource = pinRecord?.mainBackground 
    ? { uri: pinRecord.mainBackground }
    : FUJI_BACKGROUND;

  return (
    <ImageBackground
      source={mainBackgroundSource}
      style={styles.container}
      resizeMode="cover"
    >
      {/* 全体に薄暗いオーバーレイ */}
      <View style={styles.backgroundOverlay} />

      {/* Hero領域 */}
      <ImageBackground
        source={coverImageSource}
        style={styles.heroBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            'transparent',
            'transparent',
            'rgba(15, 15, 20, 0.3)',
            'transparent',
          ]}
          locations={[0, 0.5, 0.85, 1]}
          style={styles.heroGradient}
        />
        <View
          style={[
            styles.personBadge,
            { backgroundColor: primaryPersonColor },
          ]}
        >
          <Text style={styles.personBadgeText}>⚔</Text>
        </View>
      </ImageBackground>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
        </Pressable>
        <View style={styles.headerRightButtons}>
          {/* 背景変更ボタン（全イベント共通） */}
          <Pressable onPress={handleChangeCoverImage} style={styles.headerImageButton}>
            <Ionicons name="image-outline" size={20} color="#FFF" />
          </Pressable>
          {/* 編集・削除ボタン（カスタムイベントのみ） */}
          {isCustomEvent && (
            <>
              <Pressable onPress={handleOpenEditModal} style={styles.headerEditButton}>
                <Ionicons name="pencil" size={20} color="#FFF" />
              </Pressable>
              <Pressable onPress={handleDeleteEvent} style={styles.headerDeleteButton}>
                <Ionicons name="trash-outline" size={22} color="#FFF" />
              </Pressable>
            </>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Content Card */}
        <View style={styles.contentCard}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>{event.year}</Text>
            <Text style={styles.dateEraText}>{getJapaneseEra(event.year)}</Text>
          </View>

          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.placeRow}>
            <Ionicons name="location" size={16} color={COLORS.accentGold} />
            <Text style={styles.placeName}>{event.placeName}</Text>
          </View>

          <View style={styles.tagsSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.tagsRow}>
                {event.persons.map((personId) => {
                  const person = allPersons[personId];
                  if (!person) return null;
                  return (
                    <View
                      key={personId}
                      style={[
                        styles.personTag,
                        { 
                          backgroundColor: `${person.color}40`,
                          borderColor: person.color,
                        },
                      ]}
                    >
                      <Text style={[styles.personTagText, { color: person.color }]}>
                        {person.nameKanji}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summary}>{event.summary}</Text>
          </View>
        </View>

        {/* ===== ピン記録セクション ===== */}
        <View style={styles.recordSection}>
          <Text style={styles.recordSectionTitle}>あなたの記録</Text>

          {/* 写真 */}
          <View style={styles.photosSection}>
            <View style={styles.photosRow}>
              {photos.map((photoUri, index) => (
                <Pressable
                  key={index}
                  onPress={() => setFullscreenPhoto(photoUri)}
                  onLongPress={() => handleRemovePhoto(photoUri)}
                >
                  <Image
                    source={{ uri: photoUri }}
                    style={styles.photoThumbnail}
                  />
                </Pressable>
              ))}
              {photos.length < 3 && (
                <Pressable style={styles.addPhotoButton} onPress={handleAddPhoto}>
                  <Ionicons name="add" size={24} color="#FFF" />
                  <Text style={styles.addPhotoText}>写真を追加</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* 感想テキスト */}
          <View style={styles.noteSection}>
            <TextInput
              style={styles.noteInput}
              placeholder="この場所で何を感じた？"
              placeholderTextColor="#FFF"
              value={noteText}
              onChangeText={setNoteText}
              onBlur={handleNoteBlur}
              multiline
              maxLength={140}
            />
            <Text style={styles.noteCount}>{noteText.length}/140</Text>
          </View>

          {/* ランク */}
          <View style={styles.rankSection}>
            <Text style={styles.rankLabel}>この場所は？</Text>
            <View style={styles.rankButtons}>
              {([1, 2, 3] as PinRank[]).map((rank) => {
                const isSelected = pinRecord?.rank === rank;
                return (
                  <Pressable
                    key={rank}
                    style={[
                      styles.rankButton,
                      isSelected && { 
                        borderColor: RANK_COLORS[rank],
                        backgroundColor: `${RANK_COLORS[rank]}20`,
                      },
                    ]}
                    onPress={() => handleSetRank(rank)}
                  >
                    <Text style={styles.rankStars}>
                      {'★'.repeat(rank)}
                    </Text>
                    <Text style={[
                      styles.rankButtonText,
                      isSelected && { color: RANK_COLORS[rank] },
                    ]}>
                      {RANK_LABELS[rank]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Source領域 */}
        {event.sources.length > 0 && (
          <View style={styles.sourceSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="book-outline" size={14} color={COLORS.accentGold} />
              <Text style={styles.sectionLabel}>情報ソース</Text>
            </View>

            {event.sources.map((source, index) => (
              <Pressable
                key={index}
                style={styles.sourceCard}
                onPress={() => handleOpenSource(source)}
              >
                {source.imageUrl && index === 0 && (
                  <Image
                    source={{ uri: source.imageUrl }}
                    style={styles.sourceImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.sourceContent}>
                  <View style={styles.sourceInfo}>
                    <Ionicons
                      name={source.type === 'wikipedia' ? 'logo-wikipedia' : 'link-outline'}
                      size={16}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.sourceTitle}>{source.title}</Text>
                  </View>
                  <Ionicons name="open-outline" size={16} color={COLORS.textSecondary} />
                </View>
              </Pressable>
            ))}
          </View>
        )}

        <View style={{ height: insets.bottom + SPACING.xxxl }} />
      </ScrollView>

      {/* フルスクリーン写真モーダル */}
      <Modal
        visible={!!fullscreenPhoto}
        transparent
        animationType="fade"
        onRequestClose={() => setFullscreenPhoto(null)}
      >
        <Pressable
          style={styles.fullscreenModal}
          onPress={() => setFullscreenPhoto(null)}
        >
          {fullscreenPhoto && (
            <Image
              source={{ uri: fullscreenPhoto }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          )}
          <Pressable
            style={[styles.closeModalButton, { top: insets.top + SPACING.md }]}
            onPress={() => setFullscreenPhoto(null)}
          >
            <Ionicons name="close" size={28} color={COLORS.textPrimary} />
          </Pressable>
        </Pressable>
      </Modal>

      {/* イベント編集モーダル */}
      {isCustomEvent && event && (
        <AddEventModal
          visible={showEditModal}
          onClose={handleCloseEditModal}
          initialLocation={{ lat: event.lat, lng: event.lng }}
          editEventId={id}
          currentYear={selectedYear}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 15, 20, 0)',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.4,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  personBadge: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.textPrimary,
  },
  personBadgeText: {
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    zIndex: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 22,
  },
  headerRightButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  headerImageButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 22,
  },
  headerEditButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.accentGold,
    borderRadius: 22,
  },
  headerDeleteButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C62828',
    borderRadius: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: SCREEN_HEIGHT * 0.3,
  },
  contentCard: {
    backgroundColor: 'rgba(15, 15, 20, 0.1)',
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  dateBadgeText: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  dateEraText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.accentGold,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.display,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    lineHeight: TYPOGRAPHY.fontSize.display * 1.3,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  placeName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.accentGold,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tagsSection: {
    marginBottom: SPACING.lg,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  personTag: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
  },
  personTagText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  summarySection: {
    marginBottom: SPACING.md,
  },
  summary: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.fontSize.lg * 1.7,
  },
  // ===== ピン記録セクション =====
  recordSection: {
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: 'rgba(15, 15, 20, 0.1)',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  recordSectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    color: COLORS.accentGold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  photosSection: {
    marginBottom: SPACING.lg,
  },
  photosRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  photoThumbnail: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: RADIUS.md,
  },
  addPhotoButton: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  addPhotoText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: '#FFF',
    marginTop: SPACING.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  noteSection: {
    marginBottom: SPACING.lg,
  },
  noteInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  noteCount: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  rankSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: SPACING.lg,
  },
  rankLabel: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  rankButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  rankButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  rankStars: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.accentGold,
    marginBottom: SPACING.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  rankButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: '#FFF',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // ===== Source =====
  sourceSection: {
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: 'rgba(15, 15, 20, 0.1)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  sectionLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.accentGold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sourceCard: {
    marginTop: SPACING.sm,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  sourceImage: {
    width: '100%',
    height: 100,
  },
  sourceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  sourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  sourceTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textPrimary,
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
  },
  backButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  // ===== Fullscreen Modal =====
  fullscreenModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.7,
  },
  closeModalButton: {
    position: 'absolute',
    right: SPACING.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
