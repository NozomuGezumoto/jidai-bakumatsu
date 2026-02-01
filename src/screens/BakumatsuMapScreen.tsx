// ============================================
// 幕末歴史アプリ - メイン画面
// 地図 + 年号スライダー + 人物フィルター
// ============================================

import BottomSheet from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BakumatsuMap from '../components/map/BakumatsuMap';
import AddEventModal from '../components/ui/AddEventModal';
import EventPreviewSheet from '../components/ui/EventPreviewSheet';
import PersonFilter from '../components/ui/PersonFilter';
import UndoToast from '../components/ui/UndoToast';
import YearSlider from '../components/ui/YearSlider';
import { COLORS, SPACING } from '../constants/theme';
import { useBakumatsuStore } from '../store/useBakumatsuStore';
import { BakumatsuEvent, BakumatsuStackParamList } from '../types/bakumatsu';

type NavigationProp = NativeStackNavigationProp<BakumatsuStackParamList, 'Main'>;

export default function BakumatsuMapScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const previewSheetRef = useRef<BottomSheet>(null);

  const [selectedEvent, setSelectedEvent] = useState<BakumatsuEvent | null>(null);
  const [editEventId, setEditEventId] = useState<string | undefined>();

  // ストアからイベント追加UI状態を取得
  const isSelectingLocation = useBakumatsuStore((state) => state.isSelectingLocation);
  const pendingEventLocation = useBakumatsuStore((state) => state.pendingEventLocation);
  const showAddEventModal = useBakumatsuStore((state) => state.showAddEventModal);
  const setEventLocation = useBakumatsuStore((state) => state.setEventLocation);
  const cancelLocationSelection = useBakumatsuStore((state) => state.cancelLocationSelection);
  const closeAddEventModal = useBakumatsuStore((state) => state.closeAddEventModal);
  const startLocationSelection = useBakumatsuStore((state) => state.startLocationSelection);
  const currentYear = useBakumatsuStore((state) => state.selectedYear);

  const handleEventPress = useCallback((event: BakumatsuEvent) => {
    setSelectedEvent(event);
    previewSheetRef.current?.snapToIndex(0);
  }, []);

  const handlePreviewClose = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const handleOpenDetail = useCallback(() => {
    if (selectedEvent) {
      navigation.navigate('EventDetail', { eventId: selectedEvent.id });
    }
  }, [navigation, selectedEvent]);

  // 地図タップで位置選択（位置選択モード時）
  const handleMapPress = useCallback((coordinate: { lat: number; lng: number }) => {
    if (isSelectingLocation) {
      setEventLocation(coordinate);
    }
  }, [isSelectingLocation, setEventLocation]);

  // 位置選択モードを開始（モーダルから）
  const handleSelectLocation = useCallback(() => {
    closeAddEventModal();
    setTimeout(() => {
      startLocationSelection();
    }, 100);
  }, [closeAddEventModal, startLocationSelection]);

  // イベント編集
  const handleEditEvent = useCallback(() => {
    if (selectedEvent && selectedEvent.id.startsWith('custom-')) {
      setEditEventId(selectedEvent.id);
      previewSheetRef.current?.close();
      // 編集モードでモーダルを開く（位置は既存のまま）
      setEventLocation({ lat: selectedEvent.lat, lng: selectedEvent.lng });
    }
  }, [selectedEvent, setEventLocation]);

  // モーダルを閉じる
  const handleCloseModal = useCallback(() => {
    closeAddEventModal();
    setEditEventId(undefined);
  }, [closeAddEventModal]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        {/* フルスクリーンマップ */}
        <BakumatsuMap 
          onEventPress={handleEventPress}
          onMapPress={handleMapPress}
          temporaryPin={pendingEventLocation}
          isAddMode={isSelectingLocation}
          onCancelAddMode={cancelLocationSelection}
          onAddEvent={startLocationSelection}
        />

        {/* 上部コントロール */}
        <View 
          style={[styles.controlsContainer, { top: insets.top + SPACING.md }]}
          pointerEvents="box-none"
        >
          {/* 年号スライダー */}
          <YearSlider />

          {/* 人物フィルター */}
          <PersonFilter />
        </View>

        {/* イベントプレビューシート */}
        <EventPreviewSheet
          ref={previewSheetRef}
          event={selectedEvent}
          onClose={handlePreviewClose}
          onOpenDetail={handleOpenDetail}
          onEdit={handleEditEvent}
        />

        {/* イベント追加/編集モーダル */}
        <AddEventModal
          visible={showAddEventModal}
          onClose={handleCloseModal}
          initialLocation={pendingEventLocation || undefined}
          editEventId={editEventId}
          onSelectLocation={handleSelectLocation}
          currentYear={currentYear}
        />

        {/* Undoトースト */}
        <UndoToast />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  controlsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

