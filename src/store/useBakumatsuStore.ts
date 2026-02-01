// ============================================
// 幕末歴史アプリ - State Management
// Using Zustand with AsyncStorage persistence
// ============================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ALL_EVENTS } from '../data/events';
import { BakumatsuEvent, Person, PersonId, PinRank, PinRecord, YEAR_RANGE } from '../types/bakumatsu';

// カスタム人物の型
export interface CustomPerson extends Person {
  isCustom: true;
}

// カスタムイベントの型
export interface CustomEvent extends BakumatsuEvent {
  isCustom: true;
}

interface BakumatsuState {
  // Data
  events: BakumatsuEvent[];
  pinRecords: Record<string, PinRecord>; // eventId -> PinRecord
  customPersons: Record<string, CustomPerson>; // カスタム人物
  customEvents: CustomEvent[]; // カスタムイベント
  
  // Undo用
  lastDeletedEvent: CustomEvent | null;
  lastDeletedPersons: Record<string, CustomPerson>;

  // UI State
  selectedYear: number;
  selectedPersons: PersonId[];
  
  // イベント追加UI状態
  isSelectingLocation: boolean; // 位置選択モード
  pendingEventLocation: { lat: number; lng: number } | null; // 選択された位置
  showAddEventModal: boolean; // モーダル表示

  // Actions - Year/Filter
  setSelectedYear: (year: number) => void;
  togglePerson: (personId: PersonId) => void;
  setSelectedPersons: (persons: PersonId[]) => void;
  clearPersonFilter: () => void;

  // Actions - PinRecord
  updatePinRecord: (eventId: string, updates: Partial<Omit<PinRecord, 'eventId' | 'createdAt'>>) => void;
  addPhoto: (eventId: string, photoUri: string) => void;
  removePhoto: (eventId: string, photoUri: string) => void;
  setNote: (eventId: string, note: string) => void;
  setRank: (eventId: string, rank: PinRank | undefined) => void;
  setCoverImage: (eventId: string, coverImage: string | undefined) => void;
  setMainBackground: (eventId: string, mainBackground: string | undefined) => void;
  getPinRecord: (eventId: string) => PinRecord | undefined;

  // Actions - Custom Person/Event
  addCustomPerson: (person: Omit<CustomPerson, 'isCustom'>) => void;
  removeCustomPerson: (personId: string) => void;
  addCustomEvent: (event: Omit<CustomEvent, 'isCustom' | 'id'>) => void;
  updateCustomEvent: (eventId: string, updates: Partial<Omit<CustomEvent, 'isCustom' | 'id'>>) => void;
  removeCustomEvent: (eventId: string) => void;
  undoDeleteEvent: () => boolean; // 削除を取り消す（成功したらtrue）
  clearDeletedEvent: () => void; // 削除履歴をクリア
  getAllPersons: () => Record<string, Person>;

  // Actions - Event Addition UI
  startLocationSelection: () => void; // 位置選択モードを開始
  setEventLocation: (location: { lat: number; lng: number }) => void; // 位置を設定してモーダルを開く
  cancelLocationSelection: () => void; // 位置選択をキャンセル
  closeAddEventModal: () => void; // モーダルを閉じる

  // Computed
  getFilteredEvents: () => BakumatsuEvent[];
  getEventsForCurrentYear: () => BakumatsuEvent[];
  getEventById: (id: string) => BakumatsuEvent | undefined;
  getRepresentativeEvent: () => BakumatsuEvent | undefined;
  getYearsWithEvents: () => number[];
  getAllYearsWithEvents: () => number[];
  goToPrevYear: () => void;
  goToNextYear: () => void;
}

export const useBakumatsuStore = create<BakumatsuState>()(
  persist(
    (set, get) => ({
      // Initial state
      events: ALL_EVENTS,
      pinRecords: {},
      customPersons: {},
      customEvents: [],
      lastDeletedEvent: null,
      lastDeletedPersons: {},
      selectedYear: 1866,
      selectedPersons: [],
      
      // イベント追加UI状態
      isSelectingLocation: false,
      pendingEventLocation: null,
      showAddEventModal: false,

      // ============================================
      // Year/Filter Actions
      // ============================================

      setSelectedYear: (year: number) => {
        const clampedYear = Math.max(
          YEAR_RANGE.min,
          Math.min(YEAR_RANGE.max, year)
        );
        set({ selectedYear: clampedYear });
      },

      togglePerson: (personId: PersonId) => {
        const state = get();
        const isSelected = state.selectedPersons.includes(personId);
        const newSelectedPersons = isSelected
          ? state.selectedPersons.filter((p) => p !== personId)
          : [...state.selectedPersons, personId];
        
        get().setSelectedPersons(newSelectedPersons);
      },

      setSelectedPersons: (persons: PersonId[]) => {
        set((state) => {
          // フィルター解除（全員表示）の場合は年の調整不要
          if (persons.length === 0) {
            return {
              selectedPersons: persons,
            };
          }

          // 新しい selectedPersons でイベントのある年を計算
          const yearsSet = new Set<number>();
          state.events.forEach((event) => {
            if (event.persons.some((p) => persons.includes(p))) {
              yearsSet.add(event.year);
            }
          });
          const yearsWithEvents = Array.from(yearsSet).sort((a, b) => a - b);

          // イベントがない場合はそのまま
          if (yearsWithEvents.length === 0) {
            return {
              selectedPersons: persons,
            };
          }

          // 現在の年がイベントのある年に含まれている場合はそのまま
          if (yearsWithEvents.includes(state.selectedYear)) {
            return {
              selectedPersons: persons,
            };
          }

          // 最も近い年を見つける
          let closestYear = yearsWithEvents[0];
          let minDiff = Math.abs(yearsWithEvents[0] - state.selectedYear);
          for (const year of yearsWithEvents) {
            const diff = Math.abs(year - state.selectedYear);
            if (diff < minDiff) {
              minDiff = diff;
              closestYear = year;
            }
          }

          return {
            selectedPersons: persons,
            selectedYear: closestYear,
          };
        });
      },

      clearPersonFilter: () => {
        set({ selectedPersons: [] });
      },

      // ============================================
      // Custom Person/Event Actions
      // ============================================

      addCustomPerson: (person) => {
        set((state) => ({
          customPersons: {
            ...state.customPersons,
            [person.id]: { ...person, isCustom: true },
          },
        }));
      },

      removeCustomPerson: (personId) => {
        set((state) => {
          const { [personId]: _, ...rest } = state.customPersons;
          return { customPersons: rest };
        });
      },

      addCustomEvent: (event) => {
        const id = `custom-${Date.now()}`;
        set((state) => ({
          customEvents: [
            ...state.customEvents,
            { ...event, id, isCustom: true },
          ],
        }));
      },

      updateCustomEvent: (eventId, updates) => {
        set((state) => ({
          customEvents: state.customEvents.map((event) => {
            if (event.id === eventId) {
              return { ...event, ...updates };
            }
            return event;
          }),
        }));
      },

      removeCustomEvent: (eventId) => {
        set((state) => {
          // 削除するイベントを取得
          const eventToDelete = state.customEvents.find((e) => e.id === eventId);
          if (!eventToDelete) return state;

          // イベントを削除
          const newCustomEvents = state.customEvents.filter((e) => e.id !== eventId);
          
          // カスタム人物でイベントがなくなった人を保存してから削除
          const deletedPersons: Record<string, CustomPerson> = {};
          const customPersonsToKeep: Record<string, CustomPerson> = {};
          
          Object.entries(state.customPersons).forEach(([personId, person]) => {
            // このカスタム人物がまだイベントを持っているか確認
            const hasEvents = newCustomEvents.some((e) => 
              e.persons.includes(personId as PersonId)
            );
            if (hasEvents) {
              customPersonsToKeep[personId] = person;
            } else {
              // 削除される人物を保存（Undo用）
              deletedPersons[personId] = person;
            }
          });

          return {
            customEvents: newCustomEvents,
            customPersons: customPersonsToKeep,
            lastDeletedEvent: eventToDelete,
            lastDeletedPersons: deletedPersons,
          };
        });
      },

      undoDeleteEvent: () => {
        const { lastDeletedEvent, lastDeletedPersons } = get();
        if (!lastDeletedEvent) return false;

        set((state) => ({
          customEvents: [...state.customEvents, lastDeletedEvent],
          customPersons: { ...state.customPersons, ...lastDeletedPersons },
          lastDeletedEvent: null,
          lastDeletedPersons: {},
        }));

        return true;
      },

      clearDeletedEvent: () => {
        set({ lastDeletedEvent: null, lastDeletedPersons: {} });
      },

      getAllPersons: () => {
        const { customPersons } = get();
        const { PERSONS } = require('../types/bakumatsu');
        return { ...PERSONS, ...customPersons };
      },

      // ============================================
      // Event Addition UI Actions
      // ============================================

      startLocationSelection: () => {
        set({ isSelectingLocation: true, pendingEventLocation: null });
      },

      setEventLocation: (location) => {
        set({ 
          pendingEventLocation: location, 
          isSelectingLocation: false,
          showAddEventModal: true,
        });
      },

      cancelLocationSelection: () => {
        set({ isSelectingLocation: false, pendingEventLocation: null });
      },

      closeAddEventModal: () => {
        set({ showAddEventModal: false, pendingEventLocation: null });
      },

      // ============================================
      // PinRecord Actions
      // ============================================

      updatePinRecord: (eventId, updates) => {
        set((state) => {
          const existing = state.pinRecords[eventId];
          const now = new Date().toISOString();
          
          const newRecord: PinRecord = existing
            ? { ...existing, ...updates, updatedAt: now }
            : {
                eventId,
                ...updates,
                createdAt: now,
                updatedAt: now,
              };

          return {
            pinRecords: {
              ...state.pinRecords,
              [eventId]: newRecord,
            },
          };
        });
      },

      addPhoto: (eventId, photoUri) => {
        const record = get().pinRecords[eventId];
        const currentPhotos = record?.photos || [];
        
        // 最大3枚まで
        if (currentPhotos.length >= 3) return;
        if (currentPhotos.includes(photoUri)) return;

        get().updatePinRecord(eventId, {
          photos: [...currentPhotos, photoUri],
        });
      },

      removePhoto: (eventId, photoUri) => {
        const record = get().pinRecords[eventId];
        if (!record?.photos) return;

        get().updatePinRecord(eventId, {
          photos: record.photos.filter((p) => p !== photoUri),
        });
      },

      setNote: (eventId, note) => {
        // 最大140文字
        const trimmedNote = note.slice(0, 140);
        get().updatePinRecord(eventId, { note: trimmedNote });
      },

      setRank: (eventId, rank) => {
        get().updatePinRecord(eventId, { rank });
      },

      setCoverImage: (eventId, coverImage) => {
        get().updatePinRecord(eventId, { coverImage });
      },

      setMainBackground: (eventId, mainBackground) => {
        get().updatePinRecord(eventId, { mainBackground });
      },

      getPinRecord: (eventId) => {
        return get().pinRecords[eventId];
      },

      // ============================================
      // Computed Values
      // ============================================

      getFilteredEvents: () => {
        const { events, customEvents, selectedYear, selectedPersons } = get();
        const allEvents = [...events, ...customEvents];

        return allEvents.filter((event) => {
          const yearMatch = event.year === selectedYear;
          const personMatch =
            selectedPersons.length === 0 ||
            event.persons.some((p) => selectedPersons.includes(p as PersonId));
          return yearMatch && personMatch;
        });
      },

      getEventsForCurrentYear: () => {
        const { events, customEvents, selectedYear } = get();
        const allEvents = [...events, ...customEvents];
        return allEvents.filter((event) => event.year === selectedYear);
      },

      getEventById: (id: string) => {
        const { events, customEvents } = get();
        const allEvents = [...events, ...customEvents];
        return allEvents.find((event) => event.id === id);
      },

      getRepresentativeEvent: () => {
        const filtered = get().getFilteredEvents();
        if (filtered.length === 0) return undefined;
        return filtered[0];
      },

      getYearsWithEvents: () => {
        const { events, customEvents, selectedPersons } = get();
        const allEvents = [...events, ...customEvents];
        const years = new Set<number>();

        allEvents.forEach((event) => {
          const personMatch =
            selectedPersons.length === 0 ||
            event.persons.some((p) => selectedPersons.includes(p as PersonId));
          if (personMatch) {
            years.add(event.year);
          }
        });

        return Array.from(years).sort((a, b) => a - b);
      },

      getAllYearsWithEvents: () => {
        const { events, customEvents } = get();
        const allEvents = [...events, ...customEvents];
        const years = new Set<number>();
        allEvents.forEach((event) => years.add(event.year));
        return Array.from(years).sort((a, b) => a - b);
      },

      goToPrevYear: () => {
        const { selectedYear } = get();
        const yearsWithEvents = get().getYearsWithEvents();
        const currentIndex = yearsWithEvents.indexOf(selectedYear);
        
        if (currentIndex > 0) {
          set({ selectedYear: yearsWithEvents[currentIndex - 1] });
        } else if (currentIndex === -1) {
          const prevYear = yearsWithEvents.filter((y) => y < selectedYear).pop();
          if (prevYear) set({ selectedYear: prevYear });
        }
      },

      goToNextYear: () => {
        const { selectedYear } = get();
        const yearsWithEvents = get().getYearsWithEvents();
        const currentIndex = yearsWithEvents.indexOf(selectedYear);
        
        if (currentIndex >= 0 && currentIndex < yearsWithEvents.length - 1) {
          set({ selectedYear: yearsWithEvents[currentIndex + 1] });
        } else if (currentIndex === -1) {
          const nextYear = yearsWithEvents.find((y) => y > selectedYear);
          if (nextYear) set({ selectedYear: nextYear });
        }
      },
    }),
    {
      name: 'bakumatsu-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        pinRecords: state.pinRecords,
        customPersons: state.customPersons,
        customEvents: state.customEvents,
      }),
    }
  )
);
