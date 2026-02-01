// ============================================
// 幕末歴史アプリ - Type Definitions
// ============================================

// 人物ID型
export type PersonId = 'ryoma' | 'shinsaku' | 'toshizo' | 'saigo' | 'katsu' | 'kido' | 'kondo' | 'yoshida' | 'nakaoka' | 'okita' | 'yoshinobu' | 'naosuke' | 'enomoto';

// ランク型（感情の強度・記憶の濃さ）
export type PinRank = 1 | 2 | 3;

// 藩・所属タイプ
export type FactionId = 'satsuma' | 'choshu' | 'tosa' | 'shinsengumi' | 'bakufu' | 'other';

// 藩・所属情報
export interface Faction {
  id: FactionId;
  name: string;
  color: string;
}

// 藩・所属マスター
export const FACTIONS: Record<FactionId, Faction> = {
  satsuma: { id: 'satsuma', name: '薩摩藩', color: '#2E7D32' },
  choshu: { id: 'choshu', name: '長州藩', color: '#F57C00' },
  tosa: { id: 'tosa', name: '土佐藩', color: '#E85D75' },
  shinsengumi: { id: 'shinsengumi', name: '新選組', color: '#9B59B6' },
  bakufu: { id: 'bakufu', name: '幕府', color: '#5D4037' },
  other: { id: 'other', name: 'その他', color: '#607D8B' },
};

// 人物情報
export interface Person {
  id: PersonId;
  name: string;
  nameKanji: string;
  color: string;
  faction: FactionId;
  customFactionName?: string; // 「その他」の場合のカスタム所属名
}

// 情報ソース（Wikipedia等）
export interface Source {
  type: 'wikipedia' | 'book' | 'website';
  title: string;
  url: string;
  imageUrl?: string; // Wikipedia thumbnail or OG画像
}

// ピン記録（ユーザーの体験記録）
export interface PinRecord {
  eventId: string;
  photos?: string[];      // 最大3枚（ローカル URI）
  note?: string;          // 最大140文字
  rank?: PinRank;         // 感情の強度（未設定 = undefined）
  coverImage?: string;    // 上部背景画像（ローカル URI）
  mainBackground?: string; // 下部背景画像（ローカル URI）
  createdAt: string;      // ISO
  updatedAt: string;      // ISO
}

// 幕末イベント
export interface BakumatsuEvent {
  id: string;
  year: number;
  title: string;
  summary: string;
  placeName: string;
  lat: number;
  lng: number;
  persons: PersonId[];
  sources: Source[];
  coverImage?: string; // ユーザー画像 or 生成画像
}

// ランク別の枠線色
export const RANK_COLORS: Record<PinRank, string> = {
  1: '#4A90D9', // 青：通過
  2: '#4CAF50', // 明るい緑：印象に残った
  3: '#D4A574', // 金色：忘れられない
};

// ランクのラベル
export const RANK_LABELS: Record<PinRank, string> = {
  1: '普通',
  2: 'いいね',
  3: '最高',
};

// 年号の範囲
export const YEAR_RANGE = {
  min: 1853,
  max: 1869,
} as const;

// 人物マスター
export const PERSONS: Record<PersonId, Person> = {
  ryoma: {
    id: 'ryoma',
    name: 'Sakamoto Ryoma',
    nameKanji: '坂本龍馬',
    color: '#E85D75',
    faction: 'tosa',
  },
  shinsaku: {
    id: 'shinsaku',
    name: 'Takasugi Shinsaku',
    nameKanji: '高杉晋作',
    color: '#4A90D9',
    faction: 'choshu',
  },
  toshizo: {
    id: 'toshizo',
    name: 'Hijikata Toshizo',
    nameKanji: '土方歳三',
    color: '#9B59B6',
    faction: 'shinsengumi',
  },
  saigo: {
    id: 'saigo',
    name: 'Saigo Takamori',
    nameKanji: '西郷隆盛',
    color: '#2E7D32',
    faction: 'satsuma',
  },
  katsu: {
    id: 'katsu',
    name: 'Katsu Kaishu',
    nameKanji: '勝海舟',
    color: '#1565C0',
    faction: 'bakufu',
  },
  kido: {
    id: 'kido',
    name: 'Kido Takayoshi',
    nameKanji: '桂小五郎',
    color: '#F57C00',
    faction: 'choshu',
  },
  kondo: {
    id: 'kondo',
    name: 'Kondo Isami',
    nameKanji: '近藤勇',
    color: '#6A1B9A',
    faction: 'shinsengumi',
  },
  yoshida: {
    id: 'yoshida',
    name: 'Yoshida Shoin',
    nameKanji: '吉田松陰',
    color: '#00695C',
    faction: 'choshu',
  },
  nakaoka: {
    id: 'nakaoka',
    name: 'Nakaoka Shintaro',
    nameKanji: '中岡慎太郎',
    color: '#D84315',
    faction: 'tosa',
  },
  okita: {
    id: 'okita',
    name: 'Okita Soji',
    nameKanji: '沖田総司',
    color: '#E91E63',
    faction: 'shinsengumi',
  },
  yoshinobu: {
    id: 'yoshinobu',
    name: 'Tokugawa Yoshinobu',
    nameKanji: '徳川慶喜',
    color: '#5D4037',
    faction: 'bakufu',
  },
  naosuke: {
    id: 'naosuke',
    name: 'Ii Naosuke',
    nameKanji: '井伊直弼',
    color: '#37474F',
    faction: 'bakufu',
  },
  enomoto: {
    id: 'enomoto',
    name: 'Enomoto Takeaki',
    nameKanji: '榎本武揚',
    color: '#0277BD',
    faction: 'bakufu',
  },
};

// ナビゲーション型
export type BakumatsuStackParamList = {
  Main: undefined;
  EventDetail: {
    eventId: string;
  };
};
