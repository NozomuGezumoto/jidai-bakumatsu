# アプリアイコン設定ガイド

このドキュメントでは、アプリのアイコン画像を設定する方法を説明します。

## 必要な画像ファイル

### iOS用アイコン
- **ファイル名**: `icon.png`
- **場所**: `./assets/images/icon.png`
- **サイズ**: 1024x1024px
- **形式**: PNG（透明背景可）
- **説明**: iOS用のメインアイコン。Expoが自動的に必要なサイズにリサイズします。

### Android用アイコン

#### 1. フォアグラウンド画像（必須）
- **ファイル名**: `android-icon-foreground.png`
- **場所**: `./assets/images/android-icon-foreground.png`
- **サイズ**: 1024x1024px
- **形式**: PNG（透明背景推奨）
- **説明**: Androidのアダプティブアイコンの前面に表示される画像

#### 2. 背景画像（必須）
- **ファイル名**: `android-icon-background.png`
- **場所**: `./assets/images/android-icon-background.png`
- **サイズ**: 1024x1024px
- **形式**: PNG（単色またはグラデーション）
- **説明**: Androidのアダプティブアイコンの背景色

#### 3. モノクロ画像（オプション）
- **ファイル名**: `android-icon-monochrome.png`
- **場所**: `./assets/images/android-icon-monochrome.png`
- **サイズ**: 1024x1024px
- **形式**: PNG（透明背景、白または黒の単色）
- **説明**: Android 13以降のテーマアイコン用

### Web用ファビコン
- **ファイル名**: `favicon.png`
- **場所**: `./assets/images/favicon.png`
- **サイズ**: 32x32px または 48x48px
- **形式**: PNG

## 画像の配置手順

1. 上記のサイズでアイコン画像を準備します
2. 各画像を対応するファイル名で `assets/images/` ディレクトリに配置します
3. `app.json` の設定は既に完了しているため、画像を配置するだけで反映されます

## 現在の設定（app.json）

```json
{
  "icon": "./assets/images/icon.png",
  "ios": {
    // iOSは自動的にicon.pngから生成されます
  },
  "android": {
    "adaptiveIcon": {
      "backgroundColor": "#0F0F14",
      "foregroundImage": "./assets/images/android-icon-foreground.png",
      "backgroundImage": "./assets/images/android-icon-background.png",
      "monochromeImage": "./assets/images/android-icon-monochrome.png"
    }
  },
  "web": {
    "favicon": "./assets/images/favicon.png"
  }
}
```

## アイコン設計の推奨事項

### iOS
- 角丸は自動的に適用されます（iOS 7以降）
- 透明背景を使用できます
- アイコンは自動的にマスクされます

### Android
- フォアグラウンド画像は中央の安全領域（約66%）に重要な要素を配置してください
- 背景色は `backgroundColor` で指定されています（現在: `#0F0F14`）
- アダプティブアイコンは様々な形状にマスクされるため、重要な要素は中央に配置してください

## 画像を更新した後

1. 開発サーバーを再起動: `npm start` または `expo start`
2. ネイティブビルドを再実行: `npx expo prebuild --clean`（必要に応じて）

## 参考リンク

- [Expo Icons Documentation](https://docs.expo.dev/guides/app-icons/)
- [Android Adaptive Icons](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)
- [iOS App Icon Guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons)

