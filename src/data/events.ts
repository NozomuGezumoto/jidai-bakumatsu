// ============================================
// 幕末歴史アプリ - イベントデータ
// ============================================

import { BakumatsuEvent, Source } from '../types/bakumatsu';

// 龍馬の10イベント（初期データ）
export const RYOMA_EVENTS: BakumatsuEvent[] = [
  {
    id: 'ryoma-001',
    year: 1853,
    title: '黒船来航を聞く',
    summary:
      'ペリー率いる黒船が浦賀に来航。土佐藩の下級武士だった龍馬は、この知らせを聞いて日本の将来に危機感を抱く。剣術修行のため江戸に向かう決意を固める。',
    placeName: '高知城下',
    lat: 33.5608,
    lng: 133.5314,
    persons: ['ryoma'],
    sources: [
      {
        type: 'wikipedia',
        title: '黒船来航',
        url: 'https://ja.wikipedia.org/wiki/%E9%BB%92%E8%88%B9%E6%9D%A5%E8%88%AA',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Kurofune.jpg/300px-Kurofune.jpg',
      },
    ],
  },
  {
    id: 'ryoma-002',
    year: 1854,
    title: '江戸にて剣術修行',
    summary:
      '北辰一刀流の千葉定吉道場に入門。剣術の腕を磨きながら、攘夷の志士たちと交流を深める。後に「北辰一刀流免許皆伝」を受ける。',
    placeName: '千葉道場（江戸）',
    lat: 35.6894,
    lng: 139.6917,
    persons: ['ryoma'],
    sources: [
      {
        type: 'wikipedia',
        title: '北辰一刀流',
        url: 'https://ja.wikipedia.org/wiki/%E5%8C%97%E8%BE%B0%E4%B8%80%E5%88%80%E6%B5%81',
      },
    ],
  },
  {
    id: 'ryoma-003',
    year: 1862,
    title: '土佐藩脱藩',
    summary:
      '尊王攘夷運動に身を投じるため土佐藩を脱藩。藩の枠を超えた活動を開始し、日本の変革を目指す志士として歩み始める。',
    placeName: '梼原（土佐）',
    lat: 33.3963,
    lng: 132.9249,
    persons: ['ryoma'],
    sources: [
      {
        type: 'wikipedia',
        title: '坂本龍馬',
        url: 'https://ja.wikipedia.org/wiki/%E5%9D%82%E6%9C%AC%E9%BE%8D%E9%A6%AC',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Sakamoto_Ry%C5%8Dma.jpg/220px-Sakamoto_Ry%C5%8Dma.jpg',
      },
    ],
  },
  {
    id: 'ryoma-004',
    year: 1864,
    title: '神戸海軍操練所に参加',
    summary:
      '勝海舟の下で海軍技術を学ぶ。日本の海防と貿易の重要性を学び、後の海援隊構想の基盤となる。',
    placeName: '神戸海軍操練所',
    lat: 34.6901,
    lng: 135.1955,
    persons: ['ryoma'],
    sources: [
      {
        type: 'wikipedia',
        title: '神戸海軍操練所',
        url: 'https://ja.wikipedia.org/wiki/%E7%A5%9E%E6%88%B8%E6%B5%B7%E8%BB%8D%E6%93%8D%E7%B7%B4%E6%89%80',
      },
    ],
  },
  {
    id: 'ryoma-005',
    year: 1865,
    title: '亀山社中を結成',
    summary:
      '長崎で日本初の商社といわれる「亀山社中」を設立。薩摩藩の支援を受け、武器の購入・輸送を行う貿易会社として活動を開始。',
    placeName: '亀山社中跡（長崎）',
    lat: 32.7448,
    lng: 129.8755,
    persons: ['ryoma'],
    sources: [
      {
        type: 'wikipedia',
        title: '亀山社中',
        url: 'https://ja.wikipedia.org/wiki/%E4%BA%80%E5%B1%B1%E7%A4%BE%E4%B8%AD',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Kameyama_Shachu_Museum.jpg/280px-Kameyama_Shachu_Museum.jpg',
      },
    ],
  },
  {
    id: 'ryoma-006',
    year: 1866,
    title: '薩長同盟の斡旋',
    summary:
      '犬猿の仲であった薩摩藩と長州藩の同盟を仲介。京都の小松帯刀邸にて西郷隆盛と木戸孝允の会談を実現させ、倒幕への道を開く。',
    placeName: '小松帯刀邸（京都）',
    lat: 35.0116,
    lng: 135.7681,
    persons: ['ryoma'],
    sources: [
      {
        type: 'wikipedia',
        title: '薩長同盟',
        url: 'https://ja.wikipedia.org/wiki/%E8%96%A9%E9%95%B7%E5%90%8C%E7%9B%9F',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Satsumahanteiyashiki.jpg/280px-Satsumahanteiyashiki.jpg',
      },
    ],
  },
  {
    id: 'ryoma-007',
    year: 1866,
    title: '寺田屋事件',
    summary:
      '伏見の寺田屋に宿泊中、幕府の捕吏に襲撃される。お龍の機転で危機を察知し、負傷しながらも脱出に成功。',
    placeName: '寺田屋（京都伏見）',
    lat: 34.9340,
    lng: 135.7610,
    persons: ['ryoma'],
    sources: [
      {
        type: 'wikipedia',
        title: '寺田屋事件',
        url: 'https://ja.wikipedia.org/wiki/%E5%AF%BA%E7%94%B0%E5%B1%8B%E4%BA%8B%E4%BB%B6',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Teradaya_Fushimi_Kyoto_Japan01s3.jpg/280px-Teradaya_Fushimi_Kyoto_Japan01s3.jpg',
      },
    ],
  },
  {
    id: 'ryoma-008',
    year: 1867,
    title: '海援隊を組織',
    summary:
      '亀山社中を発展させ「海援隊」を結成。貿易と海運を通じて新しい日本の形を模索。いろは丸事件では紀州藩と交渉し賠償金を勝ち取る。',
    placeName: '長崎',
    lat: 32.7503,
    lng: 129.8779,
    persons: ['ryoma'],
    sources: [
      {
        type: 'wikipedia',
        title: '海援隊',
        url: 'https://ja.wikipedia.org/wiki/%E6%B5%B7%E6%8F%B4%E9%9A%8A',
      },
    ],
  },
  {
    id: 'ryoma-009',
    year: 1867,
    title: '船中八策を起草',
    summary:
      '大政奉還後の新政府の基本方針となる「船中八策」を起草。議会制度や憲法制定など、近代国家の構想を示す。',
    placeName: '夕顔丸船中',
    lat: 33.5500,
    lng: 133.5300,
    persons: ['ryoma'],
    sources: [
      {
        type: 'wikipedia',
        title: '船中八策',
        url: 'https://ja.wikipedia.org/wiki/%E8%88%B9%E4%B8%AD%E5%85%AB%E7%AD%96',
      },
    ],
  },
  {
    id: 'ryoma-010',
    year: 1867,
    title: '近江屋事件で暗殺',
    summary:
      '京都河原町の近江屋にて中岡慎太郎とともに何者かに襲撃され暗殺される。享年31歳。犯人については諸説あるが、見廻組説が有力。',
    placeName: '近江屋跡（京都）',
    lat: 35.0039,
    lng: 135.7676,
    persons: ['ryoma'],
    sources: [
      {
        type: 'wikipedia',
        title: '近江屋事件',
        url: 'https://ja.wikipedia.org/wiki/%E8%BF%91%E6%B1%9F%E5%B1%8B%E4%BA%8B%E4%BB%B6',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Oumiya-ato.jpg/220px-Oumiya-ato.jpg',
      },
    ],
  },
];

// 高杉晋作のイベント
export const SHINSAKU_EVENTS: BakumatsuEvent[] = [
  {
    id: 'shinsaku-001',
    year: 1858,
    title: '松下村塾に入門',
    summary:
      '吉田松陰の松下村塾に入門。松陰の薫陶を受け、尊王攘夷の志に目覚める。後に「奇兵隊」を創設する礎となる。',
    placeName: '松下村塾（萩）',
    lat: 34.4159,
    lng: 131.4091,
    persons: ['shinsaku'],
    sources: [
      {
        type: 'wikipedia',
        title: '松下村塾',
        url: 'https://ja.wikipedia.org/wiki/%E6%9D%BE%E4%B8%8B%E6%9D%91%E5%A1%BE',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Shokasonjuku.jpg/280px-Shokasonjuku.jpg',
      },
    ],
  },
  {
    id: 'shinsaku-002',
    year: 1862,
    title: '上海視察',
    summary:
      '幕府の千歳丸に乗船し上海を視察。欧米列強による中国の植民地化を目の当たりにし、日本の危機を痛感する。',
    placeName: '上海',
    lat: 31.2304,
    lng: 121.4737,
    persons: ['shinsaku'],
    sources: [
      {
        type: 'wikipedia',
        title: '高杉晋作',
        url: 'https://ja.wikipedia.org/wiki/%E9%AB%98%E6%9D%89%E6%99%8B%E4%BD%9C',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Takasugi_Shinsaku.jpg/220px-Takasugi_Shinsaku.jpg',
      },
    ],
  },
  {
    id: 'shinsaku-003',
    year: 1863,
    title: '奇兵隊を創設',
    summary:
      '身分に関係なく志ある者を集めた「奇兵隊」を下関で創設。武士だけでなく農民や町人も加わる画期的な軍隊組織。',
    placeName: '下関',
    lat: 33.9589,
    lng: 130.9408,
    persons: ['shinsaku'],
    sources: [
      {
        type: 'wikipedia',
        title: '奇兵隊',
        url: 'https://ja.wikipedia.org/wiki/%E5%A5%87%E5%85%B5%E9%9A%8A',
      },
    ],
  },
  {
    id: 'shinsaku-004',
    year: 1864,
    title: '功山寺挙兵',
    summary:
      '長州藩の保守派に対し、わずか80名で功山寺から挙兵。藩論を倒幕へと転換させることに成功する。',
    placeName: '功山寺（下関）',
    lat: 34.0069,
    lng: 130.9636,
    persons: ['shinsaku'],
    sources: [
      {
        type: 'wikipedia',
        title: '功山寺挙兵',
        url: 'https://ja.wikipedia.org/wiki/%E5%8A%9F%E5%B1%B1%E5%AF%BA%E6%8C%99%E5%85%B5',
      },
    ],
  },
  {
    id: 'shinsaku-005',
    year: 1866,
    title: '第二次長州征伐で勝利',
    summary:
      '幕府軍の長州征伐に対し、海軍を率いて勝利を収める。幕府の権威失墜を決定づけた戦い。',
    placeName: '小倉口',
    lat: 33.8833,
    lng: 130.8750,
    persons: ['shinsaku'],
    sources: [
      {
        type: 'wikipedia',
        title: '長州征討',
        url: 'https://ja.wikipedia.org/wiki/%E9%95%B7%E5%B7%9E%E5%BE%81%E8%A8%8E',
      },
    ],
  },
  {
    id: 'shinsaku-006',
    year: 1867,
    title: '下関にて病没',
    summary:
      '肺結核により下関で死去。享年27歳。「おもしろきこともなき世をおもしろく」の辞世の句を残す。',
    placeName: '下関',
    lat: 33.9650,
    lng: 130.9490,
    persons: ['shinsaku'],
    sources: [
      {
        type: 'wikipedia',
        title: '高杉晋作',
        url: 'https://ja.wikipedia.org/wiki/%E9%AB%98%E6%9D%89%E6%99%8B%E4%BD%9C',
      },
    ],
  },
];

// 土方歳三のイベント
export const TOSHIZO_EVENTS: BakumatsuEvent[] = [
  {
    id: 'toshizo-001',
    year: 1863,
    title: '浪士組として上洛',
    summary:
      '将軍家茂警護のため、清河八郎率いる浪士組に参加して京都へ上洛。後の新選組の母体となる。',
    placeName: '京都',
    lat: 35.0116,
    lng: 135.7681,
    persons: ['toshizo'],
    sources: [
      {
        type: 'wikipedia',
        title: '浪士組',
        url: 'https://ja.wikipedia.org/wiki/%E6%B5%AA%E5%A3%AB%E7%B5%84',
      },
    ],
  },
  {
    id: 'toshizo-002',
    year: 1863,
    title: '新選組結成',
    summary:
      '壬生浪士組から発展した新選組の副長に就任。近藤勇を支え、「鬼の副長」として隊の規律維持に努める。',
    placeName: '壬生屯所（京都）',
    lat: 34.9973,
    lng: 135.7483,
    persons: ['toshizo'],
    sources: [
      {
        type: 'wikipedia',
        title: '新選組',
        url: 'https://ja.wikipedia.org/wiki/%E6%96%B0%E9%81%B8%E7%B5%84',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Shinsengumi_uniform.jpg/200px-Shinsengumi_uniform.jpg',
      },
    ],
  },
  {
    id: 'toshizo-003',
    year: 1864,
    title: '池田屋事件',
    summary:
      '京都三条の池田屋を襲撃し、長州藩などの志士を討ち取る。新選組の名を天下に轟かせた事件。',
    placeName: '池田屋跡（京都）',
    lat: 35.0098,
    lng: 135.7706,
    persons: ['toshizo'],
    sources: [
      {
        type: 'wikipedia',
        title: '池田屋事件',
        url: 'https://ja.wikipedia.org/wiki/%E6%B1%A0%E7%94%B0%E5%B1%8B%E4%BA%8B%E4%BB%B6',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Ikedaya_Jiken_Ishibumi.jpg/220px-Ikedaya_Jiken_Ishibumi.jpg',
      },
    ],
  },
  {
    id: 'toshizo-004',
    year: 1864,
    title: '禁門の変',
    summary:
      '長州藩の御所侵攻に対し、新選組として出動。蛤御門付近で激戦を繰り広げる。',
    placeName: '蛤御門（京都御所）',
    lat: 35.0220,
    lng: 135.7590,
    persons: ['toshizo'],
    sources: [
      {
        type: 'wikipedia',
        title: '禁門の変',
        url: 'https://ja.wikipedia.org/wiki/%E7%A6%81%E9%96%80%E3%81%AE%E5%A4%89',
      },
    ],
  },
  {
    id: 'toshizo-005',
    year: 1867,
    title: '油小路事件',
    summary:
      '新選組を脱退した伊東甲子太郎一派を油小路で襲撃。隊の結束を守るため、かつての同志と剣を交える。',
    placeName: '油小路（京都）',
    lat: 34.9900,
    lng: 135.7558,
    persons: ['toshizo'],
    sources: [
      {
        type: 'wikipedia',
        title: '油小路事件',
        url: 'https://ja.wikipedia.org/wiki/%E6%B2%B9%E5%B0%8F%E8%B7%AF%E4%BA%8B%E4%BB%B6',
      },
    ],
  },
  {
    id: 'toshizo-006',
    year: 1868,
    title: '鳥羽・伏見の戦い',
    summary:
      '新政府軍との戦いに敗北。近代兵器の前に旧式装備では太刀打ちできず、江戸へ退却を余儀なくされる。',
    placeName: '鳥羽（京都）',
    lat: 34.9455,
    lng: 135.7470,
    persons: ['toshizo'],
    sources: [
      {
        type: 'wikipedia',
        title: '鳥羽・伏見の戦い',
        url: 'https://ja.wikipedia.org/wiki/%E9%B3%A5%E7%BE%BD%E3%83%BB%E4%BC%8F%E8%A6%8B%E3%81%AE%E6%88%A6%E3%81%84',
      },
    ],
  },
  {
    id: 'toshizo-007',
    year: 1868,
    title: '宇都宮城の戦い',
    summary:
      '旧幕府軍として宇都宮城を攻略。足に銃創を負いながらも指揮を執り続ける。',
    placeName: '宇都宮城',
    lat: 36.5596,
    lng: 139.8835,
    persons: ['toshizo'],
    sources: [
      {
        type: 'wikipedia',
        title: '宇都宮城の戦い',
        url: 'https://ja.wikipedia.org/wiki/%E5%AE%87%E9%83%BD%E5%AE%AE%E5%9F%8E%E3%81%AE%E6%88%A6%E3%81%84',
      },
    ],
  },
  {
    id: 'toshizo-008',
    year: 1869,
    title: '箱館戦争・五稜郭',
    summary:
      '榎本武揚らと共に蝦夷地に渡り、五稜郭を拠点に新政府軍と対峙。陸軍奉行並として戦い続ける。',
    placeName: '五稜郭（函館）',
    lat: 41.7967,
    lng: 140.7570,
    persons: ['toshizo'],
    sources: [
      {
        type: 'wikipedia',
        title: '箱館戦争',
        url: 'https://ja.wikipedia.org/wiki/%E7%AE%B1%E9%A4%A8%E6%88%A6%E4%BA%89',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Goryokaku_Hakodate_Hokkaido_Japan.jpg/280px-Goryokaku_Hakodate_Hokkaido_Japan.jpg',
      },
    ],
  },
  {
    id: 'toshizo-009',
    year: 1869,
    title: '一本木関門で戦死',
    summary:
      '函館の一本木関門にて新政府軍と交戦中に銃弾に倒れる。享年34歳。最後まで武士として戦い抜いた。',
    placeName: '一本木関門跡（函館）',
    lat: 41.7806,
    lng: 140.7363,
    persons: ['toshizo'],
    sources: [
      {
        type: 'wikipedia',
        title: '土方歳三',
        url: 'https://ja.wikipedia.org/wiki/%E5%9C%9F%E6%96%B9%E6%AD%B3%E4%B8%89',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Hijikata_Toshiz%C5%8D.jpg/220px-Hijikata_Toshiz%C5%8D.jpg',
      },
    ],
  },
];

// 西郷隆盛のイベント
export const SAIGO_EVENTS: BakumatsuEvent[] = [
  {
    id: 'saigo-001',
    year: 1854,
    title: '島津斉彬に見出される',
    summary:
      '薩摩藩主・島津斉彬に才能を認められ、庭方役として仕える。斉彬の開明思想に触れ、その後の政治活動の礎を築く。',
    placeName: '鹿児島城',
    lat: 31.5966,
    lng: 130.5571,
    persons: ['saigo'],
    sources: [
      {
        type: 'wikipedia',
        title: '西郷隆盛',
        url: 'https://ja.wikipedia.org/wiki/%E8%A5%BF%E9%83%B7%E9%9A%86%E7%9B%9B',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Saigo_Takamori.jpg/220px-Saigo_Takamori.jpg',
      },
    ],
  },
  {
    id: 'saigo-002',
    year: 1858,
    title: '安政の大獄で追われる',
    summary:
      '井伊直弼による安政の大獄の際、僧・月照と共に入水自殺を図る。月照は死亡するが西郷は蘇生し、奄美大島へ潜伏。',
    placeName: '錦江湾',
    lat: 31.5500,
    lng: 130.6000,
    persons: ['saigo'],
    sources: [
      {
        type: 'wikipedia',
        title: '安政の大獄',
        url: 'https://ja.wikipedia.org/wiki/%E5%AE%89%E6%94%BF%E3%81%AE%E5%A4%A7%E7%8D%84',
      },
    ],
  },
  {
    id: 'saigo-003',
    year: 1862,
    title: '島津久光の怒りを買い流罪',
    summary:
      '藩主・久光の上洛に先駆けて独断で行動したことで久光の怒りを買い、沖永良部島へ流罪となる。',
    placeName: '沖永良部島',
    lat: 27.3667,
    lng: 128.5667,
    persons: ['saigo'],
    sources: [
      {
        type: 'wikipedia',
        title: '西郷隆盛',
        url: 'https://ja.wikipedia.org/wiki/%E8%A5%BF%E9%83%B7%E9%9A%86%E7%9B%9B',
      },
    ],
  },
  {
    id: 'saigo-004',
    year: 1864,
    title: '禁門の変で長州と対峙',
    summary:
      '長州藩の御所への進撃を迎え撃ち、薩摩藩兵を率いて勝利。この戦いで軍事的才能を発揮する。',
    placeName: '蛤御門（京都御所）',
    lat: 35.0220,
    lng: 135.7590,
    persons: ['saigo'],
    sources: [
      {
        type: 'wikipedia',
        title: '禁門の変',
        url: 'https://ja.wikipedia.org/wiki/%E7%A6%81%E9%96%80%E3%81%AE%E5%A4%89',
      },
    ],
  },
  {
    id: 'saigo-005',
    year: 1866,
    title: '薩長同盟を締結',
    summary:
      '坂本龍馬の仲介により、長年の宿敵・長州藩との同盟を締結。木戸孝允と会談し、倒幕への道を開く。',
    placeName: '小松帯刀邸（京都）',
    lat: 35.0116,
    lng: 135.7681,
    persons: ['saigo', 'ryoma', 'kido'],
    sources: [
      {
        type: 'wikipedia',
        title: '薩長同盟',
        url: 'https://ja.wikipedia.org/wiki/%E8%96%A9%E9%95%B7%E5%90%8C%E7%9B%9F',
      },
    ],
  },
  {
    id: 'saigo-006',
    year: 1868,
    title: '江戸無血開城',
    summary:
      '勝海舟との会談により、江戸城の無血開城を実現。100万の江戸市民を戦火から救う。',
    placeName: '江戸薩摩藩邸',
    lat: 35.6580,
    lng: 139.7514,
    persons: ['saigo', 'katsu'],
    sources: [
      {
        type: 'wikipedia',
        title: '江戸開城',
        url: 'https://ja.wikipedia.org/wiki/%E6%B1%9F%E6%88%B8%E9%96%8B%E5%9F%8E',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Katsu_Kaishu_and_Saigo_Takamori.jpg/280px-Katsu_Kaishu_and_Saigo_Takamori.jpg',
      },
    ],
  },
];

// 勝海舟のイベント
export const KATSU_EVENTS: BakumatsuEvent[] = [
  {
    id: 'katsu-001',
    year: 1855,
    title: '長崎海軍伝習所に入所',
    summary:
      '幕府の長崎海軍伝習所に入所し、オランダ人教官から航海術・造船術を学ぶ。日本海軍の基礎を築く。',
    placeName: '長崎海軍伝習所',
    lat: 32.7448,
    lng: 129.8735,
    persons: ['katsu'],
    sources: [
      {
        type: 'wikipedia',
        title: '長崎海軍伝習所',
        url: 'https://ja.wikipedia.org/wiki/%E9%95%B7%E5%B4%8E%E6%B5%B7%E8%BB%8D%E4%BC%9D%E7%BF%92%E6%89%80',
      },
    ],
  },
  {
    id: 'katsu-002',
    year: 1860,
    title: '咸臨丸で太平洋横断',
    summary:
      '日本人初の太平洋横断航海を指揮。咸臨丸でサンフランシスコに到達し、アメリカの実情を視察。',
    placeName: 'サンフランシスコ',
    lat: 37.7749,
    lng: -122.4194,
    persons: ['katsu'],
    sources: [
      {
        type: 'wikipedia',
        title: '咸臨丸',
        url: 'https://ja.wikipedia.org/wiki/%E5%92%B8%E8%87%A8%E4%B8%B8',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Kanrin_Maru.jpg/280px-Kanrin_Maru.jpg',
      },
    ],
  },
  {
    id: 'katsu-003',
    year: 1863,
    title: '坂本龍馬と出会う',
    summary:
      '暗殺を目的に訪れた坂本龍馬を説得し、弟子とする。龍馬の世界観を大きく変えた運命の出会い。',
    placeName: '勝邸（江戸）',
    lat: 35.6600,
    lng: 139.7400,
    persons: ['katsu', 'ryoma'],
    sources: [
      {
        type: 'wikipedia',
        title: '勝海舟',
        url: 'https://ja.wikipedia.org/wiki/%E5%8B%9D%E6%B5%B7%E8%88%9F',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Katsu_Kaishu.jpg/220px-Katsu_Kaishu.jpg',
      },
    ],
  },
  {
    id: 'katsu-004',
    year: 1864,
    title: '神戸海軍操練所を設立',
    summary:
      '幕府の許可を得て神戸海軍操練所を設立。坂本龍馬ら脱藩浪士も受け入れ、海軍人材を育成。',
    placeName: '神戸海軍操練所',
    lat: 34.6901,
    lng: 135.1955,
    persons: ['katsu', 'ryoma'],
    sources: [
      {
        type: 'wikipedia',
        title: '神戸海軍操練所',
        url: 'https://ja.wikipedia.org/wiki/%E7%A5%9E%E6%88%B8%E6%B5%B7%E8%BB%8D%E6%93%8D%E7%B7%B4%E6%89%80',
      },
    ],
  },
  {
    id: 'katsu-005',
    year: 1868,
    title: '江戸無血開城を実現',
    summary:
      '西郷隆盛との会談により、江戸城の無血開城を成し遂げる。徳川慶喜の助命と江戸市民の安全を守る。',
    placeName: '薩摩藩邸（江戸）',
    lat: 35.6580,
    lng: 139.7514,
    persons: ['katsu', 'saigo'],
    sources: [
      {
        type: 'wikipedia',
        title: '江戸開城',
        url: 'https://ja.wikipedia.org/wiki/%E6%B1%9F%E6%88%B8%E9%96%8B%E5%9F%8E',
      },
    ],
  },
];

// 桂小五郎（木戸孝允）のイベント
export const KIDO_EVENTS: BakumatsuEvent[] = [
  {
    id: 'kido-001',
    year: 1852,
    title: '江戸へ遊学',
    summary:
      '長州藩から江戸へ遊学。練兵館で剣術を学び、「練兵館の三羽烏」と称される腕前に達する。',
    placeName: '練兵館（江戸）',
    lat: 35.6917,
    lng: 139.7536,
    persons: ['kido'],
    sources: [
      {
        type: 'wikipedia',
        title: '木戸孝允',
        url: 'https://ja.wikipedia.org/wiki/%E6%9C%A8%E6%88%B8%E5%AD%9D%E5%85%81',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Kido_Takayoshi.jpg/220px-Kido_Takayoshi.jpg',
      },
    ],
  },
  {
    id: 'kido-002',
    year: 1858,
    title: '松下村塾と交流',
    summary:
      '吉田松陰の松下村塾の門下生らと交流を深め、尊王攘夷運動に参加。長州藩の志士のリーダーとなる。',
    placeName: '萩',
    lat: 34.4067,
    lng: 131.3992,
    persons: ['kido', 'yoshida'],
    sources: [
      {
        type: 'wikipedia',
        title: '松下村塾',
        url: 'https://ja.wikipedia.org/wiki/%E6%9D%BE%E4%B8%8B%E6%9D%91%E5%A1%BE',
      },
    ],
  },
  {
    id: 'kido-003',
    year: 1864,
    title: '池田屋事件で九死に一生',
    summary:
      '池田屋での会合に遅れたことで新選組の襲撃を免れる。多くの同志を失い、長州藩は窮地に立たされる。',
    placeName: '対馬藩邸（京都）',
    lat: 35.0116,
    lng: 135.7681,
    persons: ['kido'],
    sources: [
      {
        type: 'wikipedia',
        title: '池田屋事件',
        url: 'https://ja.wikipedia.org/wiki/%E6%B1%A0%E7%94%B0%E5%B1%8B%E4%BA%8B%E4%BB%B6',
      },
    ],
  },
  {
    id: 'kido-004',
    year: 1864,
    title: '禁門の変後に潜伏',
    summary:
      '禁門の変で長州藩が敗れた後、幕府の追手から逃れ、但馬出石に潜伏。「広戸孝助」と名を変えて身を隠す。',
    placeName: '出石',
    lat: 35.4433,
    lng: 134.8733,
    persons: ['kido'],
    sources: [
      {
        type: 'wikipedia',
        title: '木戸孝允',
        url: 'https://ja.wikipedia.org/wiki/%E6%9C%A8%E6%88%B8%E5%AD%9D%E5%85%81',
      },
    ],
  },
  {
    id: 'kido-005',
    year: 1866,
    title: '薩長同盟を締結',
    summary:
      '坂本龍馬の仲介により、京都で西郷隆盛と会談。長年の宿敵・薩摩藩との同盟を締結し、倒幕への道を開く。',
    placeName: '小松帯刀邸（京都）',
    lat: 35.0116,
    lng: 135.7681,
    persons: ['kido', 'saigo', 'ryoma'],
    sources: [
      {
        type: 'wikipedia',
        title: '薩長同盟',
        url: 'https://ja.wikipedia.org/wiki/%E8%96%A9%E9%95%B7%E5%90%8C%E7%9B%9F',
      },
    ],
  },
  {
    id: 'kido-006',
    year: 1868,
    title: '五箇条の御誓文を起草',
    summary:
      '明治新政府の基本方針となる「五箇条の御誓文」の原案を起草。近代日本の国是を定める。',
    placeName: '京都御所',
    lat: 35.0254,
    lng: 135.7621,
    persons: ['kido'],
    sources: [
      {
        type: 'wikipedia',
        title: '五箇条の御誓文',
        url: 'https://ja.wikipedia.org/wiki/%E4%BA%94%E7%AE%87%E6%9D%A1%E3%81%AE%E5%BE%A1%E8%AA%93%E6%96%87',
      },
    ],
  },
];

// 近藤勇のイベント
export const KONDO_EVENTS: BakumatsuEvent[] = [
  {
    id: 'kondo-001',
    year: 1848,
    title: '天然理心流に入門',
    summary:
      '近藤周助の道場・試衛館に入門し、天然理心流を学ぶ。後に道場主を継ぎ、四代目宗家となる。',
    placeName: '試衛館（江戸）',
    lat: 35.7000,
    lng: 139.7200,
    persons: ['kondo'],
    sources: [
      {
        type: 'wikipedia',
        title: '近藤勇',
        url: 'https://ja.wikipedia.org/wiki/%E8%BF%91%E8%97%A4%E5%8B%87',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Kondou_Isami.jpg/220px-Kondou_Isami.jpg',
      },
    ],
  },
  {
    id: 'kondo-002',
    year: 1863,
    title: '浪士組として上洛',
    summary:
      '将軍警護のため、土方歳三らと共に浪士組に参加して京都へ上洛。壬生に駐屯し、後の新選組の母体となる。',
    placeName: '壬生屯所（京都）',
    lat: 34.9973,
    lng: 135.7483,
    persons: ['kondo', 'toshizo'],
    sources: [
      {
        type: 'wikipedia',
        title: '浪士組',
        url: 'https://ja.wikipedia.org/wiki/%E6%B5%AA%E5%A3%AB%E7%B5%84',
      },
    ],
  },
  {
    id: 'kondo-003',
    year: 1863,
    title: '新選組局長に就任',
    summary:
      '壬生浪士組が「新選組」と改称。初代局長・芹沢鴨の暗殺後、局長に就任し、隊の実権を握る。',
    placeName: '壬生屯所（京都）',
    lat: 34.9973,
    lng: 135.7483,
    persons: ['kondo', 'toshizo'],
    sources: [
      {
        type: 'wikipedia',
        title: '新選組',
        url: 'https://ja.wikipedia.org/wiki/%E6%96%B0%E9%81%B8%E7%B5%84',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Shinsengumi_uniform.jpg/200px-Shinsengumi_uniform.jpg',
      },
    ],
  },
  {
    id: 'kondo-004',
    year: 1864,
    title: '池田屋事件',
    summary:
      '長州藩などの志士が集まる池田屋を襲撃。自ら斬り込み隊を率いて突入し、新選組の名を天下に轟かせる。',
    placeName: '池田屋跡（京都）',
    lat: 35.0098,
    lng: 135.7706,
    persons: ['kondo', 'toshizo'],
    sources: [
      {
        type: 'wikipedia',
        title: '池田屋事件',
        url: 'https://ja.wikipedia.org/wiki/%E6%B1%A0%E7%94%B0%E5%B1%8B%E4%BA%8B%E4%BB%B6',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Ikedaya_Jiken_Ishibumi.jpg/220px-Ikedaya_Jiken_Ishibumi.jpg',
      },
    ],
  },
  {
    id: 'kondo-005',
    year: 1868,
    title: '甲陽鎮撫隊として出陣',
    summary:
      '鳥羽・伏見の戦い敗北後、甲陽鎮撫隊として甲州勝沼で新政府軍と戦うも敗北。近藤勇の名を捨て「大久保大和」と名乗る。',
    placeName: '勝沼',
    lat: 35.6633,
    lng: 138.7317,
    persons: ['kondo'],
    sources: [
      {
        type: 'wikipedia',
        title: '甲州勝沼の戦い',
        url: 'https://ja.wikipedia.org/wiki/%E7%94%B2%E5%B7%9E%E5%8B%9D%E6%B2%BC%E3%81%AE%E6%88%A6%E3%81%84',
      },
    ],
  },
  {
    id: 'kondo-006',
    year: 1868,
    title: '板橋で斬首',
    summary:
      '流山で新政府軍に投降後、板橋宿で斬首される。享年34歳。最後まで武士としての誇りを貫いた。',
    placeName: '板橋刑場跡',
    lat: 35.7667,
    lng: 139.6833,
    persons: ['kondo'],
    sources: [
      {
        type: 'wikipedia',
        title: '近藤勇',
        url: 'https://ja.wikipedia.org/wiki/%E8%BF%91%E8%97%A4%E5%8B%87',
      },
    ],
  },
];

// 吉田松陰のイベント
export const YOSHIDA_EVENTS: BakumatsuEvent[] = [
  {
    id: 'yoshida-001',
    year: 1850,
    title: '九州遊学',
    summary:
      '兵学修行のため九州各地を遊学。平戸で海防の実情を学び、西洋列強の脅威を実感する。',
    placeName: '平戸',
    lat: 33.3697,
    lng: 129.5533,
    persons: ['yoshida'],
    sources: [
      {
        type: 'wikipedia',
        title: '吉田松陰',
        url: 'https://ja.wikipedia.org/wiki/%E5%90%89%E7%94%B0%E6%9D%BE%E9%99%B0',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Yoshida_Shoin2.jpg/220px-Yoshida_Shoin2.jpg',
      },
    ],
  },
  {
    id: 'yoshida-002',
    year: 1854,
    title: '黒船に密航を企てる',
    summary:
      '下田に停泊中のペリー艦隊に小舟で接近し、渡米を企てるが失敗。自首して投獄される。',
    placeName: '下田',
    lat: 34.6711,
    lng: 138.9450,
    persons: ['yoshida'],
    sources: [
      {
        type: 'wikipedia',
        title: '吉田松陰',
        url: 'https://ja.wikipedia.org/wiki/%E5%90%89%E7%94%B0%E6%9D%BE%E9%99%B0',
      },
    ],
  },
  {
    id: 'yoshida-003',
    year: 1856,
    title: '松下村塾を主宰',
    summary:
      '萩の実家で松下村塾を開く。身分を問わず門下生を受け入れ、高杉晋作、伊藤博文ら維新の志士を育てる。',
    placeName: '松下村塾（萩）',
    lat: 34.4159,
    lng: 131.4091,
    persons: ['yoshida', 'shinsaku'],
    sources: [
      {
        type: 'wikipedia',
        title: '松下村塾',
        url: 'https://ja.wikipedia.org/wiki/%E6%9D%BE%E4%B8%8B%E6%9D%91%E5%A1%BE',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Shokasonjuku.jpg/280px-Shokasonjuku.jpg',
      },
    ],
  },
  {
    id: 'yoshida-004',
    year: 1858,
    title: '間部詮勝暗殺計画',
    summary:
      '安政の大獄を主導する老中・間部詮勝の暗殺を計画。藩に計画を告げるも拒否され、幕府に引き渡される。',
    placeName: '萩',
    lat: 34.4067,
    lng: 131.3992,
    persons: ['yoshida'],
    sources: [
      {
        type: 'wikipedia',
        title: '安政の大獄',
        url: 'https://ja.wikipedia.org/wiki/%E5%AE%89%E6%94%BF%E3%81%AE%E5%A4%A7%E7%8D%84',
      },
    ],
  },
  {
    id: 'yoshida-005',
    year: 1859,
    title: '安政の大獄で処刑',
    summary:
      '江戸伝馬町の獄舎で斬首される。享年29歳。「身はたとひ武蔵の野辺に朽ちぬとも留め置かまし大和魂」の辞世を残す。',
    placeName: '伝馬町牢屋敷（江戸）',
    lat: 35.6917,
    lng: 139.7800,
    persons: ['yoshida'],
    sources: [
      {
        type: 'wikipedia',
        title: '吉田松陰',
        url: 'https://ja.wikipedia.org/wiki/%E5%90%89%E7%94%B0%E6%9D%BE%E9%99%B0',
      },
    ],
  },
];

// 中岡慎太郎のイベント
export const NAKAOKA_EVENTS: BakumatsuEvent[] = [
  {
    id: 'nakaoka-001',
    year: 1861,
    title: '武市半平太の土佐勤王党に参加',
    summary:
      '武市半平太が結成した土佐勤王党に参加。尊王攘夷運動に身を投じ、志士としての活動を開始する。',
    placeName: '高知',
    lat: 33.5597,
    lng: 133.5311,
    persons: ['nakaoka'],
    sources: [
      {
        type: 'wikipedia',
        title: '中岡慎太郎',
        url: 'https://ja.wikipedia.org/wiki/%E4%B8%AD%E5%B2%A1%E6%85%8E%E5%A4%AA%E9%83%8E',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Nakaoka_Shintaro.jpg/220px-Nakaoka_Shintaro.jpg',
      },
    ],
  },
  {
    id: 'nakaoka-002',
    year: 1862,
    title: '土佐藩を脱藩',
    summary:
      '坂本龍馬に続いて土佐藩を脱藩。藩の枠を超えて尊王攘夷運動に参加するため、京都へ向かう。',
    placeName: '土佐',
    lat: 33.5597,
    lng: 133.5311,
    persons: ['nakaoka', 'ryoma'],
    sources: [
      {
        type: 'wikipedia',
        title: '中岡慎太郎',
        url: 'https://ja.wikipedia.org/wiki/%E4%B8%AD%E5%B2%A1%E6%85%8E%E5%A4%AA%E9%83%8E',
      },
    ],
  },
  {
    id: 'nakaoka-003',
    year: 1864,
    title: '禁門の変に参加',
    summary:
      '長州藩の志士と共に禁門の変に参加。敗北後は長州へ逃れ、その後も倒幕運動を続ける。',
    placeName: '蛤御門（京都御所）',
    lat: 35.0220,
    lng: 135.7590,
    persons: ['nakaoka'],
    sources: [
      {
        type: 'wikipedia',
        title: '禁門の変',
        url: 'https://ja.wikipedia.org/wiki/%E7%A6%81%E9%96%80%E3%81%AE%E5%A4%89',
      },
    ],
  },
  {
    id: 'nakaoka-004',
    year: 1866,
    title: '薩長同盟の実現に尽力',
    summary:
      '坂本龍馬と共に薩摩藩と長州藩の同盟実現に奔走。両藩の間を何度も往復し、信頼関係の構築に努める。',
    placeName: '京都',
    lat: 35.0116,
    lng: 135.7681,
    persons: ['nakaoka', 'ryoma', 'saigo', 'kido'],
    sources: [
      {
        type: 'wikipedia',
        title: '薩長同盟',
        url: 'https://ja.wikipedia.org/wiki/%E8%96%A9%E9%95%B7%E5%90%8C%E7%9B%9F',
      },
    ],
  },
  {
    id: 'nakaoka-005',
    year: 1867,
    title: '陸援隊を結成',
    summary:
      '坂本龍馬の海援隊に対し、陸上での活動を担う「陸援隊」を京都で結成。隊長として組織を率いる。',
    placeName: '白川土佐藩邸（京都）',
    lat: 35.0080,
    lng: 135.7820,
    persons: ['nakaoka'],
    sources: [
      {
        type: 'wikipedia',
        title: '陸援隊',
        url: 'https://ja.wikipedia.org/wiki/%E9%99%B8%E6%8F%B4%E9%9A%8A',
      },
    ],
  },
  {
    id: 'nakaoka-006',
    year: 1867,
    title: '近江屋事件で暗殺',
    summary:
      '京都河原町の近江屋にて坂本龍馬と共に襲撃される。龍馬より2日遅れて死亡。享年29歳。',
    placeName: '近江屋跡（京都）',
    lat: 35.0039,
    lng: 135.7676,
    persons: ['nakaoka', 'ryoma'],
    sources: [
      {
        type: 'wikipedia',
        title: '近江屋事件',
        url: 'https://ja.wikipedia.org/wiki/%E8%BF%91%E6%B1%9F%E5%B1%8B%E4%BA%8B%E4%BB%B6',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Oumiya-ato.jpg/220px-Oumiya-ato.jpg',
      },
    ],
  },
];

// 沖田総司のイベント
export const OKITA_EVENTS: BakumatsuEvent[] = [
  {
    id: 'okita-001',
    year: 1856,
    title: '試衛館に入門',
    summary:
      '9歳で近藤勇の試衛館に入門。天然理心流の剣術を学び、その才能を開花させる。後に「天才剣士」と称される。',
    placeName: '試衛館（江戸）',
    lat: 35.7000,
    lng: 139.7200,
    persons: ['okita', 'kondo'],
    sources: [
      {
        type: 'wikipedia',
        title: '沖田総司',
        url: 'https://ja.wikipedia.org/wiki/%E6%B2%96%E7%94%B0%E7%B7%8F%E5%8F%B8',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Okita_S%C5%8Dji.jpg/220px-Okita_S%C5%8Dji.jpg',
      },
    ],
  },
  {
    id: 'okita-002',
    year: 1863,
    title: '新選組一番隊組長に就任',
    summary:
      '新選組結成とともに一番隊組長に就任。最強の剣士として恐れられ、数々の戦いで活躍する。',
    placeName: '壬生屯所（京都）',
    lat: 34.9973,
    lng: 135.7483,
    persons: ['okita', 'kondo', 'toshizo'],
    sources: [
      {
        type: 'wikipedia',
        title: '新選組',
        url: 'https://ja.wikipedia.org/wiki/%E6%96%B0%E9%81%B8%E7%B5%84',
      },
    ],
  },
  {
    id: 'okita-003',
    year: 1864,
    title: '池田屋事件で活躍',
    summary:
      '池田屋に斬り込み、複数の志士を斬る活躍を見せる。しかしこの戦いの最中に喀血したとも伝えられる。',
    placeName: '池田屋跡（京都）',
    lat: 35.0098,
    lng: 135.7706,
    persons: ['okita', 'kondo', 'toshizo'],
    sources: [
      {
        type: 'wikipedia',
        title: '池田屋事件',
        url: 'https://ja.wikipedia.org/wiki/%E6%B1%A0%E7%94%B0%E5%B1%8B%E4%BA%8B%E4%BB%B6',
      },
    ],
  },
  {
    id: 'okita-004',
    year: 1867,
    title: '労咳が悪化',
    summary:
      '肺結核（労咳）が悪化し、戦線を離脱。療養生活に入るが、病状は回復せず。',
    placeName: '京都',
    lat: 35.0116,
    lng: 135.7681,
    persons: ['okita'],
    sources: [
      {
        type: 'wikipedia',
        title: '沖田総司',
        url: 'https://ja.wikipedia.org/wiki/%E6%B2%96%E7%94%B0%E7%B7%8F%E5%8F%B8',
      },
    ],
  },
  {
    id: 'okita-005',
    year: 1868,
    title: '江戸にて病没',
    summary:
      '鳥羽・伏見の戦い後、江戸に戻り療養するも、千駄ヶ谷の植木屋平五郎宅にて死去。享年24歳（諸説あり）。',
    placeName: '千駄ヶ谷（江戸）',
    lat: 35.6800,
    lng: 139.7100,
    persons: ['okita'],
    sources: [
      {
        type: 'wikipedia',
        title: '沖田総司',
        url: 'https://ja.wikipedia.org/wiki/%E6%B2%96%E7%94%B0%E7%B7%8F%E5%8F%B8',
      },
    ],
  },
];

// 徳川慶喜のイベント
export const YOSHINOBU_EVENTS: BakumatsuEvent[] = [
  {
    id: 'yoshinobu-001',
    year: 1853,
    title: '一橋家を相続',
    summary:
      '水戸藩主・徳川斉昭の七男として生まれ、一橋家を相続。将軍継嗣問題で有力候補となる。',
    placeName: '一橋邸（江戸）',
    lat: 35.6900,
    lng: 139.7500,
    persons: ['yoshinobu'],
    sources: [
      {
        type: 'wikipedia',
        title: '徳川慶喜',
        url: 'https://ja.wikipedia.org/wiki/%E5%BE%B3%E5%B7%9D%E6%85%B6%E5%96%9C',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Tokugawa_Yoshinobu_with_rifle.jpg/220px-Tokugawa_Yoshinobu_with_rifle.jpg',
      },
    ],
  },
  {
    id: 'yoshinobu-002',
    year: 1862,
    title: '将軍後見職に就任',
    summary:
      '将軍・徳川家茂の後見職に就任。朝廷との交渉や政局運営に奔走する。',
    placeName: '江戸城',
    lat: 35.6852,
    lng: 139.7528,
    persons: ['yoshinobu'],
    sources: [
      {
        type: 'wikipedia',
        title: '徳川慶喜',
        url: 'https://ja.wikipedia.org/wiki/%E5%BE%B3%E5%B7%9D%E6%85%B6%E5%96%9C',
      },
    ],
  },
  {
    id: 'yoshinobu-003',
    year: 1866,
    title: '第15代将軍に就任',
    summary:
      '徳川家茂の死去に伴い、第15代征夷大将軍に就任。最後の将軍として幕府の舵取りを担う。',
    placeName: '二条城（京都）',
    lat: 35.0142,
    lng: 135.7481,
    persons: ['yoshinobu'],
    sources: [
      {
        type: 'wikipedia',
        title: '徳川慶喜',
        url: 'https://ja.wikipedia.org/wiki/%E5%BE%B3%E5%B7%9D%E6%85%B6%E5%96%9C',
      },
    ],
  },
  {
    id: 'yoshinobu-004',
    year: 1867,
    title: '大政奉還',
    summary:
      '二条城に諸藩の重臣を集め、政権を朝廷に返上する「大政奉還」を表明。260年続いた江戸幕府に終止符を打つ。',
    placeName: '二条城（京都）',
    lat: 35.0142,
    lng: 135.7481,
    persons: ['yoshinobu'],
    sources: [
      {
        type: 'wikipedia',
        title: '大政奉還',
        url: 'https://ja.wikipedia.org/wiki/%E5%A4%A7%E6%94%BF%E5%A5%89%E9%82%84',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Nij%C5%8D_Castle_-_Ninomaru_Palace.jpg/280px-Nij%C5%8D_Castle_-_Ninomaru_Palace.jpg',
      },
    ],
  },
  {
    id: 'yoshinobu-005',
    year: 1868,
    title: '鳥羽・伏見の戦いで敗北',
    summary:
      '旧幕府軍を率いて新政府軍と戦うも敗北。大坂城から軍艦で江戸へ退却し、恭順の意を示す。',
    placeName: '大坂城',
    lat: 34.6873,
    lng: 135.5262,
    persons: ['yoshinobu'],
    sources: [
      {
        type: 'wikipedia',
        title: '鳥羽・伏見の戦い',
        url: 'https://ja.wikipedia.org/wiki/%E9%B3%A5%E7%BE%BD%E3%83%BB%E4%BC%8F%E8%A6%8B%E3%81%AE%E6%88%A6%E3%81%84',
      },
    ],
  },
  {
    id: 'yoshinobu-006',
    year: 1868,
    title: '上野寛永寺で謹慎',
    summary:
      '江戸城を明け渡し、上野寛永寺で謹慎生活に入る。その後、水戸、静岡へと移る。',
    placeName: '寛永寺（上野）',
    lat: 35.7197,
    lng: 139.7745,
    persons: ['yoshinobu'],
    sources: [
      {
        type: 'wikipedia',
        title: '徳川慶喜',
        url: 'https://ja.wikipedia.org/wiki/%E5%BE%B3%E5%B7%9D%E6%85%B6%E5%96%9C',
      },
    ],
  },
];

// 井伊直弼のイベント
export const NAOSUKE_EVENTS: BakumatsuEvent[] = [
  {
    id: 'naosuke-001',
    year: 1850,
    title: '彦根藩主に就任',
    summary:
      '兄の死去により彦根藩35万石の藩主となる。長年の不遇時代「埋木舎」での学問が後の政治手腕の基盤に。',
    placeName: '彦根城',
    lat: 35.2764,
    lng: 136.2519,
    persons: ['naosuke'],
    sources: [
      {
        type: 'wikipedia',
        title: '井伊直弼',
        url: 'https://ja.wikipedia.org/wiki/%E4%BA%95%E4%BC%8A%E7%9B%B4%E5%BC%BC',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Ii_Naosuke.jpg/220px-Ii_Naosuke.jpg',
      },
    ],
  },
  {
    id: 'naosuke-002',
    year: 1858,
    title: '大老に就任',
    summary:
      '幕府の最高職である大老に就任。将軍継嗣問題と条約締結問題という難題に直面する。',
    placeName: '江戸城',
    lat: 35.6852,
    lng: 139.7528,
    persons: ['naosuke'],
    sources: [
      {
        type: 'wikipedia',
        title: '井伊直弼',
        url: 'https://ja.wikipedia.org/wiki/%E4%BA%95%E4%BC%8A%E7%9B%B4%E5%BC%BC',
      },
    ],
  },
  {
    id: 'naosuke-003',
    year: 1858,
    title: '日米修好通商条約に調印',
    summary:
      '勅許を得ないまま日米修好通商条約に調印。開国を断行するが、攘夷派の激しい反発を招く。',
    placeName: '江戸城',
    lat: 35.6852,
    lng: 139.7528,
    persons: ['naosuke'],
    sources: [
      {
        type: 'wikipedia',
        title: '日米修好通商条約',
        url: 'https://ja.wikipedia.org/wiki/%E6%97%A5%E7%B1%B3%E4%BF%AE%E5%A5%BD%E9%80%9A%E5%95%86%E6%9D%A1%E7%B4%84',
      },
    ],
  },
  {
    id: 'naosuke-004',
    year: 1858,
    title: '安政の大獄を断行',
    summary:
      '反対派を徹底的に弾圧する「安政の大獄」を断行。吉田松陰、橋本左内らが処刑される。',
    placeName: '江戸',
    lat: 35.6894,
    lng: 139.6917,
    persons: ['naosuke', 'yoshida'],
    sources: [
      {
        type: 'wikipedia',
        title: '安政の大獄',
        url: 'https://ja.wikipedia.org/wiki/%E5%AE%89%E6%94%BF%E3%81%AE%E5%A4%A7%E7%8D%84',
      },
    ],
  },
  {
    id: 'naosuke-005',
    year: 1860,
    title: '桜田門外の変で暗殺',
    summary:
      '江戸城桜田門外にて水戸・薩摩の浪士に襲撃され暗殺される。享年44歳。幕末動乱の転換点となる。',
    placeName: '桜田門（江戸城）',
    lat: 35.6764,
    lng: 139.7528,
    persons: ['naosuke'],
    sources: [
      {
        type: 'wikipedia',
        title: '桜田門外の変',
        url: 'https://ja.wikipedia.org/wiki/%E6%A1%9C%E7%94%B0%E9%96%80%E5%A4%96%E3%81%AE%E5%A4%89',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Sakuradamon-incident-1860.jpg/280px-Sakuradamon-incident-1860.jpg',
      },
    ],
  },
];

// 榎本武揚のイベント
export const ENOMOTO_EVENTS: BakumatsuEvent[] = [
  {
    id: 'enomoto-001',
    year: 1862,
    title: 'オランダへ留学',
    summary:
      '幕府の留学生としてオランダへ渡航。海軍技術、国際法、化学などを学ぶ。',
    placeName: 'オランダ',
    lat: 52.3676,
    lng: 4.9041,
    persons: ['enomoto'],
    sources: [
      {
        type: 'wikipedia',
        title: '榎本武揚',
        url: 'https://ja.wikipedia.org/wiki/%E6%A6%8E%E6%9C%AC%E6%AD%A6%E6%8F%9A',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Enomoto_Takeaki.jpg/220px-Enomoto_Takeaki.jpg',
      },
    ],
  },
  {
    id: 'enomoto-002',
    year: 1867,
    title: '開陽丸で帰国',
    summary:
      'オランダで建造された最新鋭軍艦「開陽丸」を回航して帰国。幕府海軍の主力艦となる。',
    placeName: '横浜',
    lat: 35.4437,
    lng: 139.6380,
    persons: ['enomoto'],
    sources: [
      {
        type: 'wikipedia',
        title: '開陽丸',
        url: 'https://ja.wikipedia.org/wiki/%E9%96%8B%E9%99%BD%E4%B8%B8',
      },
    ],
  },
  {
    id: 'enomoto-003',
    year: 1868,
    title: '幕府艦隊を率いて脱走',
    summary:
      '江戸開城後、幕府艦隊を率いて品川沖を脱出。旧幕府軍と共に蝦夷地を目指す。',
    placeName: '品川沖',
    lat: 35.6090,
    lng: 139.7400,
    persons: ['enomoto'],
    sources: [
      {
        type: 'wikipedia',
        title: '榎本武揚',
        url: 'https://ja.wikipedia.org/wiki/%E6%A6%8E%E6%9C%AC%E6%AD%A6%E6%8F%9A',
      },
    ],
  },
  {
    id: 'enomoto-004',
    year: 1868,
    title: '蝦夷共和国を樹立',
    summary:
      '五稜郭を占領し、選挙により総裁に就任。アジア初の共和制国家「蝦夷共和国」を樹立。',
    placeName: '五稜郭（函館）',
    lat: 41.7967,
    lng: 140.7570,
    persons: ['enomoto', 'toshizo'],
    sources: [
      {
        type: 'wikipedia',
        title: '蝦夷共和国',
        url: 'https://ja.wikipedia.org/wiki/%E8%9D%A6%E5%A4%B7%E5%85%B1%E5%92%8C%E5%9B%BD',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Goryokaku_Hakodate_Hokkaido_Japan.jpg/280px-Goryokaku_Hakodate_Hokkaido_Japan.jpg',
      },
    ],
  },
  {
    id: 'enomoto-005',
    year: 1869,
    title: '箱館戦争で降伏',
    summary:
      '新政府軍の総攻撃を受け、五稜郭を開城して降伏。土方歳三は戦死、榎本は投獄される。',
    placeName: '五稜郭（函館）',
    lat: 41.7967,
    lng: 140.7570,
    persons: ['enomoto', 'toshizo'],
    sources: [
      {
        type: 'wikipedia',
        title: '箱館戦争',
        url: 'https://ja.wikipedia.org/wiki/%E7%AE%B1%E9%A4%A8%E6%88%A6%E4%BA%89',
      },
    ],
  },
];

// 全イベントを統合
export const ALL_EVENTS: BakumatsuEvent[] = [
  ...RYOMA_EVENTS,
  ...SHINSAKU_EVENTS,
  ...TOSHIZO_EVENTS,
  ...SAIGO_EVENTS,
  ...KATSU_EVENTS,
  ...KIDO_EVENTS,
  ...KONDO_EVENTS,
  ...YOSHIDA_EVENTS,
  ...NAKAOKA_EVENTS,
  ...OKITA_EVENTS,
  ...YOSHINOBU_EVENTS,
  ...NAOSUKE_EVENTS,
  ...ENOMOTO_EVENTS,
];

// 年ごとのイベントを取得
export function getEventsByYear(year: number): BakumatsuEvent[] {
  return ALL_EVENTS.filter((event) => event.year === year);
}

// 人物でフィルタリング
export function getEventsByPerson(personId: string): BakumatsuEvent[] {
  return ALL_EVENTS.filter((event) => event.persons.includes(personId as any));
}

// 年と人物でフィルタリング
export function getFilteredEvents(
  year: number,
  selectedPersons: string[]
): BakumatsuEvent[] {
  return ALL_EVENTS.filter((event) => {
    const yearMatch = event.year === year;
    const personMatch =
      selectedPersons.length === 0 ||
      event.persons.some((p) => selectedPersons.includes(p));
    return yearMatch && personMatch;
  });
}
