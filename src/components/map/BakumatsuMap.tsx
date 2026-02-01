// ============================================
// 幕末歴史アプリ - メインマップ
// イベントピンを表示し、全イベントが画面内に収まるように自動調整
// ============================================

import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { LatLng, Marker } from 'react-native-maps';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { useBakumatsuStore } from '../../store/useBakumatsuStore';
import { BakumatsuEvent, Person, PersonId, PERSONS, RANK_COLORS } from '../../types/bakumatsu';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// 日本全体を見渡せる初期リージョン
const JAPAN_INITIAL_REGION = {
  latitude: 35.5,
  longitude: 136.5,
  latitudeDelta: 10,
  longitudeDelta: 10,
};

// Map style for dark theme (Google Maps)
const MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#64779e' }] },
  { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry.stroke', stylers: [{ color: '#334e87' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#023e58' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6f9ba5' }] },
  { featureType: 'poi', elementType: 'labels.text.stroke', stylers: [{ color: '#1d2c4d' }] },
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#023e58' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#3C7680' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
  { featureType: 'road', elementType: 'labels.text.stroke', stylers: [{ color: '#1d2c4d' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c6675' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#255763' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#b0d5ce' }] },
  { featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{ color: '#023e58' }] },
  { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
  { featureType: 'transit', elementType: 'labels.text.stroke', stylers: [{ color: '#1d2c4d' }] },
  { featureType: 'transit.line', elementType: 'geometry.fill', stylers: [{ color: '#283d6a' }] },
  { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#3a4762' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4e6d70' }] },
];

interface BakumatsuMapProps {
  onEventPress: (event: BakumatsuEvent) => void;
  onEventLongPress?: (event: BakumatsuEvent) => void;
  onMapPress?: (coordinate: { lat: number; lng: number }) => void;
  temporaryPin?: { lat: number; lng: number } | null;
  isAddMode?: boolean;
  onCancelAddMode?: () => void;
  onAddEvent?: () => void; // イベント追加ボタン
}

export default function BakumatsuMap({ 
  onEventPress, 
  onEventLongPress, 
  onMapPress, 
  temporaryPin,
  isAddMode,
  onCancelAddMode,
  onAddEvent,
}: BakumatsuMapProps) {
  const mapRef = useRef<MapView | null>(null);

  // ストアから直接状態を取得
  const selectedYear = useBakumatsuStore((state) => state.selectedYear);
  const selectedPersons = useBakumatsuStore((state) => state.selectedPersons);
  const events = useBakumatsuStore((state) => state.events);
  const customEvents = useBakumatsuStore((state) => state.customEvents);
  const customPersons = useBakumatsuStore((state) => state.customPersons);
  const pinRecords = useBakumatsuStore((state) => state.pinRecords);

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

  // 年と人物でフィルタリング（カスタムイベントも含む）
  const filteredEvents = useMemo(() => {
    const allEvents = [...events, ...customEvents];
    return allEvents.filter((event) => {
      const yearMatch = event.year === selectedYear;
      const personMatch =
        selectedPersons.length === 0 ||
        event.persons.some((p) => selectedPersons.includes(p));
      return yearMatch && personMatch;
    });
  }, [events, customEvents, selectedYear, selectedPersons]);

  // イベントの座標リストを作成
  const coordinates = useMemo((): LatLng[] => {
    return filteredEvents.map((event) => ({
      latitude: event.lat,
      longitude: event.lng,
    }));
  }, [filteredEvents]);

  // 全イベントが画面内に収まるようにマップを調整
  const fitToAllEvents = useCallback(() => {
    if (coordinates.length === 0) return;

    if (coordinates.length === 1) {
      // 1件だけの場合はその地点にズーム（少し広めに）
      mapRef.current?.animateToRegion(
        {
          latitude: coordinates[0].latitude,
          longitude: coordinates[0].longitude,
          latitudeDelta: 3,
          longitudeDelta: 3,
        },
        600
      );
    } else {
      // 複数件の場合は全て収まるように調整
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: {
          top: SCREEN_HEIGHT * 0.35, // 上部UIの余白
          right: 50,
          bottom: 100,
          left: 50,
        },
        animated: true,
      });
    }
  }, [coordinates]);

  // 年またはフィルターが変わったときに全イベントを表示
  useEffect(() => {
    // 少し遅延させてマップの準備を待つ
    const timer = setTimeout(() => {
      fitToAllEvents();
    }, 100);

    return () => clearTimeout(timer);
  }, [filteredEvents, fitToAllEvents]);

  // マップをリセット（日本全体を表示）
  const handleResetToCenter = useCallback(() => {
    mapRef.current?.animateToRegion(JAPAN_INITIAL_REGION, 500);
  }, []);

  // マーカー押下（タップ）
  const handleMarkerPress = useCallback(
    (event: BakumatsuEvent) => {
      onEventPress(event);

      // イベント位置へアニメ移動
      mapRef.current?.animateToRegion(
        {
          latitude: event.lat,
          longitude: event.lng,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        },
        500
      );
    },
    [onEventPress]
  );

  // マーカー長押し
  const handleMarkerLongPress = useCallback(
    (event: BakumatsuEvent) => {
      if (onEventLongPress) {
        onEventLongPress(event);
      }
    },
    [onEventLongPress]
  );

  // イベントの主要人物の色を取得（塗りつぶし用）
  const getEventColor = useCallback((event: BakumatsuEvent) => {
    if (event.persons.length === 0) return COLORS.textSecondary;
    const primaryPerson = event.persons[0];
    return allPersons[primaryPerson]?.color || COLORS.primary;
  }, [allPersons]);

  // イベントの主要人物の頭文字を取得
  const getPersonInitial = useCallback((event: BakumatsuEvent) => {
    if (event.persons.length === 0) return '？';
    const primaryPerson = event.persons[0];
    const person = allPersons[primaryPerson];
    if (!person) return '？';
    // 名前の頭文字（漢字）を返す
    return person.nameKanji.charAt(0);
  }, [allPersons]);

  // ピンの枠線色を取得（ランクがあればランク色、なければデフォルト）
  const getBorderColor = (event: BakumatsuEvent) => {
    const record = pinRecords[event.id];
    if (record?.rank) {
      return RANK_COLORS[record.rank];
    }
    return COLORS.textPrimary; // デフォルトは白
  };

  return (
    <View style={styles.container}>
      {/* リセットボタン */}
      <Pressable style={styles.resetButton} onPress={handleResetToCenter}>
        <Ionicons name="locate" size={22} color={COLORS.textPrimary} />
      </Pressable>

      {/* 全イベント表示ボタン */}
      <Pressable style={styles.fitAllButton} onPress={fitToAllEvents}>
        <Ionicons name="scan-outline" size={22} color={COLORS.textPrimary} />
      </Pressable>

      {/* イベント追加ボタン */}
      {onAddEvent && !isAddMode && (
        <Pressable style={styles.addEventButton} onPress={onAddEvent}>
          <Ionicons name="add" size={26} color="#FFF" />
        </Pressable>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={JAPAN_INITIAL_REGION}
        customMapStyle={MAP_STYLE}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        toolbarEnabled={false}
        minZoomLevel={4}
        maxZoomLevel={18}
        onPress={(e) => {
          if (onMapPress) {
            onMapPress({
              lat: e.nativeEvent.coordinate.latitude,
              lng: e.nativeEvent.coordinate.longitude,
            });
          }
        }}
      >
        {filteredEvents.map((event) => {
          const eventColor = getEventColor(event);
          const borderColor = getBorderColor(event);
          const personInitial = getPersonInitial(event);

          return (
            <Marker
              key={event.id}
              coordinate={{
                latitude: event.lat,
                longitude: event.lng,
              }}
              onPress={() => handleMarkerPress(event)}
              tracksViewChanges={false}
            >
              <Pressable
                style={styles.markerContainer}
                onLongPress={() => handleMarkerLongPress(event)}
                delayLongPress={400}
              >
                <View
                  style={[
                    styles.marker,
                    { backgroundColor: eventColor, borderColor: borderColor },
                  ]}
                >
                  <Text style={styles.markerText}>{personInitial}</Text>
                </View>
                <View style={styles.markerLabel}>
                  <Text style={styles.markerLabelText} numberOfLines={1}>
                    {event.title.slice(0, 8)}
                  </Text>
                </View>
              </Pressable>
            </Marker>
          );
        })}

        {/* 仮ピン（イベント追加用） */}
        {temporaryPin && (
          <Marker
            coordinate={{
              latitude: temporaryPin.lat,
              longitude: temporaryPin.lng,
            }}
            tracksViewChanges={false}
          >
            <View style={styles.tempMarkerContainer}>
              <View style={styles.tempMarker}>
                <Ionicons name="add" size={20} color="#FFF" />
              </View>
              <View style={styles.tempMarkerLabel}>
                <Text style={styles.tempMarkerLabelText}>新規イベント</Text>
              </View>
            </View>
          </Marker>
        )}
      </MapView>

      {/* イベントがない場合の表示 */}
      {filteredEvents.length === 0 && (
        <View style={styles.noEventsOverlay}>
          <Text style={styles.noEventsText}>
            {selectedYear}年のイベントはありません
          </Text>
        </View>
      )}

      {/* 位置選択モードインジケータ */}
      {isAddMode && onCancelAddMode && (
        <View style={styles.addModeIndicator}>
          <Text style={styles.addModeText}>地図をタップして位置を選択</Text>
          <Pressable style={styles.cancelAddMode} onPress={onCancelAddMode}>
            <Text style={styles.cancelAddModeText}>キャンセル</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    flex: 1,
  },
  resetButton: {
    position: 'absolute',
    top: 100,
    right: SPACING.lg,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.mapOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  fitAllButton: {
    position: 'absolute',
    top: 152,
    right: SPACING.lg,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.mapOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  addEventButton: {
    position: 'absolute',
    bottom: 100,
    right: SPACING.lg,
    zIndex: 10,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accentGold,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: COLORS.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  markerText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  markerLabel: {
    marginTop: 4,
    backgroundColor: COLORS.mapOverlay,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    maxWidth: 80,
  },
  markerLabelText: {
    fontSize: 10,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  noEventsOverlay: {
    position: 'absolute',
    top: '50%',
    left: SPACING.xl,
    right: SPACING.xl,
    backgroundColor: COLORS.mapOverlay,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
  },
  // 仮ピン
  tempMarkerContainer: {
    alignItems: 'center',
  },
  tempMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accentGold,
    borderWidth: 3,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tempMarkerLabel: {
    marginTop: 4,
    backgroundColor: COLORS.accentGold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tempMarkerLabelText: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '700',
  },
  // 位置選択モードインジケータ
  addModeIndicator: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: '#D4A574',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addModeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelAddMode: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cancelAddModeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
