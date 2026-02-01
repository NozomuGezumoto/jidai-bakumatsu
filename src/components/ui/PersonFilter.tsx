// ============================================
// 幕末歴史アプリ - 人物フィルター
// 藩・所属ごとにグループ化して表示
// ============================================

import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { useBakumatsuStore } from '../../store/useBakumatsuStore';
import { FACTIONS, FactionId, PERSONS, Person, PersonId } from '../../types/bakumatsu';

interface PersonRowProps {
  person: Person;
  isSelected: boolean;
  onToggle: () => void;
}

function PersonRow({ person, isSelected, onToggle }: PersonRowProps) {
  // 「その他」の場合はカスタム所属名を表示
  const factionLabel = person.faction === 'other' && person.customFactionName 
    ? person.customFactionName 
    : null;

  return (
    <Pressable
      style={[styles.personRow, isSelected && styles.personRowSelected]}
      onPress={onToggle}
    >
      <View style={[styles.colorDot, { backgroundColor: person.color }]} />
      <View style={styles.personInfo}>
        <Text style={[styles.personName, isSelected && styles.personNameSelected]}>
          {person.nameKanji}
        </Text>
        {factionLabel && (
          <Text style={styles.customFactionLabel}>{factionLabel}</Text>
        )}
      </View>
      <View style={[styles.checkbox, isSelected && { backgroundColor: person.color, borderColor: person.color }]}>
        {isSelected && <Ionicons name="checkmark" size={14} color="#FFF" />}
      </View>
    </Pressable>
  );
}

// 藩ごとの表示順
const FACTION_ORDER: FactionId[] = ['satsuma', 'choshu', 'tosa', 'shinsengumi', 'bakufu', 'other'];

export default function PersonFilter() {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedPersons = useBakumatsuStore((state) => state.selectedPersons);
  const setSelectedPersons = useBakumatsuStore((state) => state.setSelectedPersons);
  const getFilteredEvents = useBakumatsuStore((state) => state.getFilteredEvents);
  const customPersons = useBakumatsuStore((state) => state.customPersons);
  const startLocationSelection = useBakumatsuStore((state) => state.startLocationSelection);

  // モーダル内での一時的な選択状態
  const [tempSelectedPersons, setTempSelectedPersons] = useState<PersonId[]>([]);

  const customEvents = useBakumatsuStore((state) => state.customEvents);

  // 全人物（ビルトイン + イベントがあるカスタム人物）
  const allPersons = useMemo(() => {
    const persons: Record<string, Person> = { ...PERSONS };
    
    // カスタム人物はイベントがある場合のみ追加
    Object.entries(customPersons).forEach(([id, person]) => {
      const hasEvents = customEvents.some((e) => e.persons.includes(id as PersonId));
      if (hasEvents) {
        persons[id] = person;
      }
    });
    
    return persons;
  }, [customPersons, customEvents]);

  const filteredCount = getFilteredEvents().length;
  const isHistoryMode = selectedPersons.length === 0;
  const personIds = Object.keys(allPersons);

  // モーダルを開くときに現在の選択状態をコピー
  const openModal = () => {
    setTempSelectedPersons([...selectedPersons]);
    setModalVisible(true);
  };

  // モーダルを閉じるときに選択状態を反映
  const closeModal = () => {
    setSelectedPersons(tempSelectedPersons);
    setModalVisible(false);
  };

  // 一時的な選択をトグル
  const toggleTempPerson = (personId: PersonId) => {
    setTempSelectedPersons((prev) => {
      if (prev.includes(personId)) {
        return prev.filter((p) => p !== personId);
      } else {
        return [...prev, personId];
      }
    });
  };

  // 藩ごとに人物をグループ化
  const personsByFaction = useMemo(() => {
    const grouped: Record<FactionId, string[]> = {
      satsuma: [],
      choshu: [],
      tosa: [],
      shinsengumi: [],
      bakufu: [],
      other: [],
    };
    personIds.forEach((id) => {
      const person = allPersons[id];
      if (person && person.faction) {
        grouped[person.faction].push(id);
      }
    });
    return grouped;
  }, [personIds, allPersons]);

  // 選択中の人物を表示用にフォーマット
  const getSelectedLabel = () => {
    if (isHistoryMode) return '全員';
    if (selectedPersons.length <= 2) {
      return selectedPersons
        .filter((p) => allPersons[p]) // 無効なIDを除外
        .map((p) => allPersons[p].nameKanji)
        .join('・') || '全員';
    }
    return `${selectedPersons.length}人選択中`;
  };

  return (
    <>
      {/* メイン表示部分 - タップで開く */}
      <Pressable style={styles.container} onPress={openModal}>
        <View style={styles.header}>
          <Text style={styles.label}>人物</Text>
          {isHistoryMode ? (
            <Text style={styles.modeText}>歴史モード</Text>
          ) : (
            <Text style={styles.countText}>{filteredCount}件</Text>
          )}
        </View>

        <View style={styles.selectorRow}>
          {/* 選択中の人物のカラードット */}
          <View style={styles.dotsContainer}>
            {isHistoryMode ? (
              personIds.slice(0, 5).map((id) => (
                allPersons[id] ? (
                  <View key={id} style={[styles.miniDot, { backgroundColor: allPersons[id].color }]} />
                ) : null
              ))
            ) : (
              selectedPersons.map((id) => (
                allPersons[id] ? (
                  <View key={id} style={[styles.miniDot, { backgroundColor: allPersons[id].color }]} />
                ) : null
              ))
            )}
            {(isHistoryMode ? personIds.length > 5 : false) && (
              <Text style={styles.moreDots}>...</Text>
            )}
          </View>

          <Text style={styles.selectedLabel}>{getSelectedLabel()}</Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.textMuted} />
        </View>
      </Pressable>

      {/* 人物選択モーダル */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {/* モーダルヘッダー */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>人物を選択</Text>
              <Pressable onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </Pressable>
            </View>

            {/* 説明 */}
            <Text style={styles.modalHint}>
              選択なし = 全員の出来事を表示
            </Text>

            {/* 藩ごとにグループ化した人物リスト */}
            <ScrollView style={styles.personList} showsVerticalScrollIndicator={false}>
              {FACTION_ORDER.map((factionId) => {
                const faction = FACTIONS[factionId];
                const members = personsByFaction[factionId];
                if (members.length === 0) return null;

                return (
                  <View key={factionId} style={styles.factionGroup}>
                    {/* 藩ヘッダー */}
                    <View style={styles.factionHeader}>
                      <View style={[styles.factionBadge, { backgroundColor: faction.color }]}>
                        <Text style={styles.factionName}>{faction.name}</Text>
                      </View>
                    </View>

                    {/* 藩の人物（一時的な選択状態を使用） */}
                    {members.map((personId) => {
                      const person = allPersons[personId];
                      if (!person) return null;
                      return (
                        <PersonRow
                          key={personId}
                          person={person}
                          isSelected={tempSelectedPersons.includes(personId as PersonId)}
                          onToggle={() => toggleTempPerson(personId as PersonId)}
                        />
                      );
                    })}
                  </View>
                );
              })}
            </ScrollView>

            {/* フッター */}
            <View style={styles.modalFooter}>
              {/* 新規イベント追加ボタン */}
              <Pressable 
                style={styles.addEventButton}
                onPress={() => {
                  // まずモーダルを閉じてから、少し遅延させて位置選択モードを開始
                  setModalVisible(false);
                  setTimeout(() => {
                    startLocationSelection();
                  }, 300);
                }}
              >
                <Ionicons name="add-circle" size={22} color="#FFF" />
                <Text style={styles.addEventButtonText}>新しいイベントを追加</Text>
              </Pressable>
              
              <Text style={styles.footerText}>
                {tempSelectedPersons.length === 0
                  ? '選択なし = 全員表示'
                  : `${tempSelectedPersons.length}人選択中`}
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // メイン表示部分
  container: {
    backgroundColor: COLORS.mapOverlay,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    ...SHADOWS.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.accentGold,
    fontWeight: '600',
  },
  countText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  miniDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  moreDots: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginLeft: 2,
  },
  selectedLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },

  // モーダル
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  modalHint: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: SPACING.sm,
  },
  personList: {
    paddingHorizontal: SPACING.lg,
  },
  modalFooter: {
    paddingTop: SPACING.md,
    paddingBottom: 40, // Safe Area対応
    paddingHorizontal: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  addEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.accentGold,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
  },
  addEventButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '700',
    color: '#FFF',
  },

  // 藩グループ
  factionGroup: {
    marginBottom: SPACING.md,
  },
  factionHeader: {
    marginBottom: SPACING.xs,
  },
  factionBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  factionName: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
  },

  // 人物行
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingLeft: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: 2,
  },
  personRowSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.sm,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  personNameSelected: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  customFactionLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

