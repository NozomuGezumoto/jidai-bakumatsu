// ============================================
// 幕末歴史アプリ - イベント追加モーダル
// 地図長押しで起動、人物の新規作成も可能
// ============================================

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { useBakumatsuStore } from '../../store/useBakumatsuStore';
import { FACTIONS, FactionId, PERSONS, PersonId, YEAR_RANGE } from '../../types/bakumatsu';

interface AddEventModalProps {
  visible: boolean;
  onClose: () => void;
  initialLocation?: { lat: number; lng: number };
  editEventId?: string; // 編集モード用
  onSelectLocation?: () => void; // 位置選択モードへ
  currentYear?: number; // 現在選択中の年
}

// 新規人物用の色選択肢
const PERSON_COLORS = [
  '#E85D75', '#4A90D9', '#9B59B6', '#2E7D32', '#1565C0',
  '#F57C00', '#6A1B9A', '#00695C', '#D84315', '#E91E63',
  '#5D4037', '#37474F', '#0277BD', '#C2185B', '#7B1FA2',
];

const FACTION_ORDER: FactionId[] = ['satsuma', 'choshu', 'tosa', 'shinsengumi', 'bakufu', 'other'];

// 一時的な新規人物の型
interface TempPerson {
  id: string;
  name: string;
  nameKanji: string;
  color: string;
  faction: FactionId;
  customFactionName?: string; // 「その他」の場合のカスタム所属名
}

export default function AddEventModal({ visible, onClose, initialLocation, editEventId, onSelectLocation, currentYear }: AddEventModalProps) {
  const addCustomEvent = useBakumatsuStore((state) => state.addCustomEvent);
  const updateCustomEvent = useBakumatsuStore((state) => state.updateCustomEvent);
  const addCustomPerson = useBakumatsuStore((state) => state.addCustomPerson);
  const customPersons = useBakumatsuStore((state) => state.customPersons);
  const customEvents = useBakumatsuStore((state) => state.customEvents);
  const getEventById = useBakumatsuStore((state) => state.getEventById);
  const selectedYear = useBakumatsuStore((state) => state.selectedYear);

  // 編集モードかどうか
  const isEditMode = !!editEventId;

  // イベント情報
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [year, setYear] = useState('1866');
  const [placeName, setPlaceName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [selectedPersons, setSelectedPersons] = useState<string[]>([]);
  
  // ソースURL
  const [sourceUrl, setSourceUrl] = useState('');
  
  // 位置が設定されているか（内部stateで管理）
  const [locationSelected, setLocationSelected] = useState(false);

  // 新規人物（未保存、イベント保存時にまとめて保存）
  const [pendingPersons, setPendingPersons] = useState<TempPerson[]>([]);

  // 新規人物作成モード
  const [showNewPerson, setShowNewPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonFaction, setNewPersonFaction] = useState<FactionId>('bakufu');
  const [newPersonColor, setNewPersonColor] = useState(PERSON_COLORS[0]);
  const [newPersonCustomFaction, setNewPersonCustomFaction] = useState(''); // その他の場合のカスタム所属名
  
  // ScrollView ref（自動スクロール用）
  const scrollViewRef = useRef<ScrollView>(null);

  // 編集モード：イベントデータを読み込む
  useEffect(() => {
    if (!visible || !isEditMode || !editEventId) return;

    const event = getEventById(editEventId);
    if (event) {
      setTitle(event.title);
      setSummary(event.summary);
      setYear(event.year.toString());
      setPlaceName(event.placeName);
      setLat(event.lat.toFixed(4));
      setLng(event.lng.toFixed(4));
      setSelectedPersons([...event.persons]);
      setLocationSelected(true);
      // ソース情報を読み込む
      if (event.sources && event.sources.length > 0) {
        setSourceUrl(event.sources[0].url || '');
      }
    }
  }, [visible, isEditMode, editEventId, getEventById]);

  // 新規モード：初期値を設定
  useEffect(() => {
    if (!visible || isEditMode) return;

    // 年は現在選択中の年を使用
    setYear((currentYear || selectedYear).toString());
    
    if (initialLocation) {
      // 位置が設定されている場合
      setLat(initialLocation.lat.toFixed(4));
      setLng(initialLocation.lng.toFixed(4));
      setLocationSelected(true);
    } else {
      // 位置が未設定
      setLat('');
      setLng('');
      setLocationSelected(false);
    }
  }, [visible, isEditMode, initialLocation, currentYear, selectedYear]);

  // イベントがある人物のみ表示（ビルトイン + イベントがあるカスタム人物）
  const availablePersons = useMemo(() => {
    // ビルトイン人物は常に表示
    const persons: Record<string, typeof PERSONS[keyof typeof PERSONS]> = { ...PERSONS };
    
    // カスタム人物はイベントがある場合のみ表示
    Object.entries(customPersons).forEach(([id, person]) => {
      const hasEvents = customEvents.some((e) => e.persons.includes(id as PersonId));
      if (hasEvents) {
        persons[id] = person;
      }
    });
    
    return persons;
  }, [customPersons, customEvents]);

  const togglePerson = (personId: string) => {
    setSelectedPersons((prev) => {
      if (prev.includes(personId)) {
        return prev.filter((p) => p !== personId);
      }
      return [...prev, personId];
    });
  };

  // 新規人物を追加（まだ保存しない、pendingPersonsに追加）
  const handleAddNewPerson = () => {
    if (!newPersonName.trim()) return;
    // 「その他」の場合はカスタム所属名が必要
    if (newPersonFaction === 'other' && !newPersonCustomFaction.trim()) return;

    const id = `custom-person-${Date.now()}`;
    const newPerson: TempPerson = {
      id,
      name: newPersonName.trim(),
      nameKanji: newPersonName.trim(),
      color: newPersonColor,
      faction: newPersonFaction,
      customFactionName: newPersonFaction === 'other' ? newPersonCustomFaction.trim() : undefined,
    };

    // pendingPersonsに追加
    setPendingPersons((prev) => [...prev, newPerson]);

    // 選択状態に追加
    setSelectedPersons((prev) => [...prev, id]);

    // リセット
    setNewPersonName('');
    setNewPersonFaction('bakufu');
    setNewPersonColor(PERSON_COLORS[0]);
    setNewPersonCustomFaction('');
    setShowNewPerson(false);
  };

  const handleSave = () => {
    if (!title.trim() || !placeName.trim()) {
      return;
    }

    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || yearNum < YEAR_RANGE.min || yearNum > YEAR_RANGE.max) {
      return;
    }

    // まず、pendingPersonsを保存（イベントと同時に確定）
    pendingPersons.forEach((person) => {
      // selectedPersonsに含まれている場合のみ保存
      if (selectedPersons.includes(person.id)) {
        addCustomPerson({
          id: person.id as PersonId,
          name: person.name,
          nameKanji: person.nameKanji,
          color: person.color,
          faction: person.faction,
          customFactionName: person.customFactionName,
        });
      }
    });

    // ソース情報を作成
    const sources = sourceUrl.trim() ? [{
      type: 'website' as const,
      title: sourceUrl.trim(),
      url: sourceUrl.trim(),
    }] : [];

    if (isEditMode && editEventId) {
      // 編集モード：既存イベントを更新
      updateCustomEvent(editEventId, {
        year: yearNum,
        title: title.trim(),
        summary: summary.trim(),
        placeName: placeName.trim(),
        lat: parseFloat(lat) || 35.0116,
        lng: parseFloat(lng) || 135.7681,
        persons: selectedPersons as PersonId[],
        sources,
      });
    } else {
      // 新規モード：イベントを追加
      addCustomEvent({
        year: yearNum,
        title: title.trim(),
        summary: summary.trim(),
        placeName: placeName.trim(),
        lat: parseFloat(lat) || 35.0116,
        lng: parseFloat(lng) || 135.7681,
        persons: selectedPersons as PersonId[],
        sources,
      });
    }

    handleClose();
  };

  const handleClose = () => {
    // リセット
    setTitle('');
    setSummary('');
    setYear('1866');
    setPlaceName('');
    setLat('');
    setLng('');
    setSelectedPersons([]);
    setPendingPersons([]);
    setShowNewPerson(false);
    setNewPersonName('');
    setNewPersonFaction('bakufu');
    setNewPersonColor(PERSON_COLORS[0]);
    setNewPersonCustomFaction('');
    setLocationSelected(false);
    setSourceUrl('');
    onClose();
  };

  const canSave = title.trim().length > 0 && placeName.trim().length > 0 && locationSelected;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <Pressable style={styles.overlay} onPress={handleClose}>
          <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
            {/* ヘッダー */}
            <View style={styles.header}>
              <Text style={styles.title}>{isEditMode ? 'イベントを編集' : 'イベントを追加'}</Text>
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </Pressable>
            </View>

            <ScrollView 
              ref={scrollViewRef}
              style={styles.form} 
              contentContainerStyle={styles.formContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
            {/* タイトル */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>タイトル *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="例: 池田屋事件"
                placeholderTextColor={COLORS.textMuted}
                maxLength={30}
              />
            </View>

            {/* 年 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>年 ({YEAR_RANGE.min}-{YEAR_RANGE.max})</Text>
              <TextInput
                style={[styles.input, styles.inputSmall]}
                value={year}
                onChangeText={setYear}
                placeholder="1866"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>

            {/* 場所名 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>場所名 *</Text>
              <TextInput
                style={styles.input}
                value={placeName}
                onChangeText={setPlaceName}
                placeholder="例: 京都三条"
                placeholderTextColor={COLORS.textMuted}
                maxLength={30}
              />
            </View>

            {/* 座標 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>位置 *</Text>
              {locationSelected && lat && lng ? (
                <View style={styles.locationSet}>
                  <Ionicons name="location" size={18} color={COLORS.accentGold} />
                  <Text style={styles.locationText}>
                    {lat}, {lng}
                  </Text>
                  {onSelectLocation && (
                    <Pressable onPress={onSelectLocation} style={styles.changeLocationButton}>
                      <Text style={styles.changeLocationText}>変更</Text>
                    </Pressable>
                  )}
                </View>
              ) : (
                <Pressable 
                  style={styles.selectLocationButton}
                  onPress={onSelectLocation}
                >
                  <Ionicons name="map-outline" size={20} color={COLORS.accentGold} />
                  <Text style={styles.selectLocationText}>地図をタップして位置を選択</Text>
                </Pressable>
              )}
            </View>

            {/* 概要 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>概要</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                value={summary}
                onChangeText={setSummary}
                placeholder="イベントの説明..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>

            {/* 参考URL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>参考URL（任意）</Text>
              <TextInput
                style={styles.input}
                value={sourceUrl}
                onChangeText={setSourceUrl}
                placeholder="https://..."
                placeholderTextColor={COLORS.textMuted}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 300);
                }}
              />
            </View>

            {/* 関連人物 */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>関連人物</Text>
                <Pressable 
                  style={styles.addPersonButton}
                  onPress={() => {
                    setShowNewPerson(true);
                    // 少し遅延させてスクロール（フォームが表示されるのを待つ）
                    setTimeout(() => {
                      scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                  }}
                >
                  <Ionicons name="person-add" size={16} color={COLORS.accentGold} />
                  <Text style={styles.addPersonButtonText}>新しい人物</Text>
                </Pressable>
              </View>
              
              <View style={styles.personList}>
                {/* 既存の人物 */}
                {Object.entries(availablePersons).map(([id, person]) => {
                  const isSelected = selectedPersons.includes(id);
                  return (
                    <Pressable
                      key={id}
                      style={[
                        styles.personButton,
                        isSelected && { backgroundColor: person.color, borderColor: person.color },
                      ]}
                      onPress={() => togglePerson(id)}
                    >
                      <Text
                        style={[
                          styles.personButtonText,
                          isSelected && styles.personButtonTextSelected,
                        ]}
                      >
                        {person.nameKanji}
                      </Text>
                    </Pressable>
                  );
                })}
                
                {/* 新規追加した人物（未保存） */}
                {pendingPersons.map((person) => {
                  const isSelected = selectedPersons.includes(person.id);
                  return (
                    <Pressable
                      key={person.id}
                      style={[
                        styles.personButton,
                        styles.pendingPersonButton,
                        isSelected && { backgroundColor: person.color, borderColor: person.color },
                      ]}
                      onPress={() => togglePerson(person.id)}
                    >
                      <Text
                        style={[
                          styles.personButtonText,
                          isSelected && styles.personButtonTextSelected,
                        ]}
                      >
                        {person.nameKanji}
                      </Text>
                      <Text style={styles.newBadge}>NEW</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 新規人物作成フォーム */}
            {showNewPerson && (
              <View style={styles.newPersonForm}>
                <Text style={styles.newPersonTitle}>新しい人物を作成</Text>
                
                <TextInput
                  style={styles.input}
                  value={newPersonName}
                  onChangeText={setNewPersonName}
                  placeholder="名前（例: 坂本龍馬）"
                  placeholderTextColor={COLORS.textMuted}
                  maxLength={20}
                />

                <Text style={styles.subLabel}>藩・所属</Text>
                <View style={styles.factionList}>
                  {FACTION_ORDER.map((factionId) => {
                    const faction = FACTIONS[factionId];
                    const isSelected = newPersonFaction === factionId;
                    return (
                      <Pressable
                        key={factionId}
                        style={[
                          styles.factionButton,
                          isSelected && { backgroundColor: faction.color },
                        ]}
                        onPress={() => setNewPersonFaction(factionId)}
                      >
                        <Text
                          style={[
                            styles.factionButtonText,
                            isSelected && styles.factionButtonTextSelected,
                          ]}
                        >
                          {faction.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {/* その他を選択した場合の入力欄 */}
                {newPersonFaction === 'other' && (
                  <TextInput
                    style={[styles.input, styles.customFactionInput]}
                    value={newPersonCustomFaction}
                    onChangeText={setNewPersonCustomFaction}
                    placeholder="所属名を入力（例: 会津藩、水戸藩）"
                    placeholderTextColor={COLORS.textMuted}
                    maxLength={20}
                  />
                )}

                <Text style={styles.subLabel}>マーカーの色</Text>
                <View style={styles.colorList}>
                  {PERSON_COLORS.map((color) => (
                    <Pressable
                      key={color}
                      style={[
                        styles.colorButton,
                        { backgroundColor: color },
                        newPersonColor === color && styles.colorButtonSelected,
                      ]}
                      onPress={() => setNewPersonColor(color)}
                    >
                      {newPersonColor === color && (
                        <Ionicons name="checkmark" size={14} color="#FFF" />
                      )}
                    </Pressable>
                  ))}
                </View>

                <View style={styles.newPersonActions}>
                  <Pressable 
                    style={styles.cancelButton}
                    onPress={() => {
                      setShowNewPerson(false);
                      setNewPersonCustomFaction('');
                    }}
                  >
                    <Text style={styles.cancelButtonText}>キャンセル</Text>
                  </Pressable>
                  <Pressable 
                    style={[
                      styles.addButton,
                      (!newPersonName.trim() || (newPersonFaction === 'other' && !newPersonCustomFaction.trim())) && styles.addButtonDisabled,
                    ]}
                    onPress={handleAddNewPerson}
                    disabled={!newPersonName.trim() || (newPersonFaction === 'other' && !newPersonCustomFaction.trim())}
                  >
                    <Text style={styles.addButtonText}>追加</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>

            {/* 保存ボタン */}
            <Pressable
              style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!canSave}
            >
              <Text style={styles.saveButtonText}>{isEditMode ? '変更を保存' : 'イベントを追加'}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '90%',
    paddingBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  form: {
    padding: SPACING.lg,
  },
  formContent: {
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputSmall: {
    width: 100,
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  selectLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.accentGold,
    borderStyle: 'dashed',
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
  },
  selectLocationText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.accentGold,
    fontWeight: '600',
  },
  locationSet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  changeLocationButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  changeLocationText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.accentGold,
    fontWeight: '600',
  },
  addPersonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addPersonButtonText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.accentGold,
    fontWeight: '600',
  },
  personList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  personButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  personButtonText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  personButtonTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  pendingPersonButton: {
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.accentGold,
    color: '#FFF',
    fontSize: 8,
    fontWeight: '700',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  // 新規人物フォーム
  newPersonForm: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.accentGold,
  },
  newPersonTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '700',
    color: COLORS.accentGold,
    marginBottom: SPACING.md,
  },
  subLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  factionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  factionButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  factionButtonText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  factionButtonTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  customFactionInput: {
    marginTop: SPACING.sm,
  },
  colorList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  colorButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorButtonSelected: {
    borderWidth: 2,
    borderColor: '#FFF',
  },
  newPersonActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  cancelButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  cancelButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
  },
  addButton: {
    backgroundColor: COLORS.accentGold,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  addButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  addButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: '#FFF',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  saveButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '700',
    color: '#FFF',
  },
});
