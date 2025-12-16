# NCDC Frontend Challenge

Next.js を使用したコンテンツ管理アプリケーションです。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **バリデーション**: Zod + Conform
- **UI コンポーネント**: shadcn UI
- **パッケージマネージャー**: pnpm

## セットアップ

### 前提条件

このフロントエンドアプリケーションを動作させるには、バックエンド API サーバーが必要です。

**バックエンド API サーバー**:

- バックエンドを [http://localhost:3000](http://localhost:3000) で起動してください
- フロントエンドはこの API サーバーと通信します

### インストールと起動

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build

# テスト実行
pnpm test
```

開発サーバーは [http://localhost:3001](http://localhost:3001) で起動します。

## 設計思想

### アーキテクチャ原則

#### 1. 責務の分離（Separation of Concerns）

コードベースは以下のレイヤーに明確に分離されています：

- **UI Layer** (`src/components`): プレゼンテーション層。ユーザーインターフェースの表示のみを担当
- **Business Logic Layer** (`src/hooks`): ビジネスロジックと状態管理。UI から独立してテスト可能
- **Data Access Layer** (`src/actions`): Server Actions によるデータ取得・更新
- **Validation Layer** (`src/lib/schemas`): Zod によるスキーマ定義とバリデーション

#### 2. DRY 原則（Don't Repeat Yourself）

重複コードを排除し、保守性を向上：

- **汎用フック**: `useContentFieldEditor` により、タイトル編集と本文編集の共通ロジックを統合
- **エラーハンドリング**: `AppError` クラスと `handleApiError` 関数による一貫したエラー処理
- **型定義**: 生成された API 型（`src/generated`）を全体で共有

#### 3. 型安全性（Type Safety）

TypeScript の型システムを最大限活用：

- **厳格な型定義**: `strict: true` による厳格な型チェック
- **型推論の活用**: ジェネリクスを使用した柔軟な型定義
- **型アサーションの最小化**: 実行時の型チェックではなく、型システムによる保証を優先

### 主要な設計パターン

#### カスタムフックパターン

```typescript
// 汎用フック（仕組み）
useContentFieldEditor<Schema, T>({
  schema,
  updateAction,
  defaultValue,
});

// 具体的なフック（設定）
useTitleEditor(contentId, title);
useBodyEditor(contentId, body);
```

**利点:**

- ロジックの再利用性が高い
- UI コンポーネントがシンプルになる
- テストが容易

#### 楽観的 UI 更新（Optimistic UI）

```typescript
// 即座にUIを更新
setOptimisticValue(newValue);
setIsEditing(false);

// サーバーへ送信
const result = await updateAction(contentId, formData);

// エラー時はロールバック
if (!result.success) {
  setOptimisticValue(defaultValue);
  setIsEditing(true);
}
```

**利点:**

- ユーザーに即座のフィードバックを提供
- UX の大幅な向上
- エラー時の適切なロールバック

#### カスタムエラークラス

```typescript
export class AppError extends Error {
  constructor(
    public message: string,
    public code?: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
  }
}
```

**利点:**

- エラーの詳細情報を保持
- デバッグが容易
- エラーの種類による分岐処理が可能

### ディレクトリ構成

```
src/
├── actions/          # Server Actions（データ取得・更新）
│   ├── content.ts    # コンテンツCRUD操作
│   └── form-action.ts # フォーム送信処理
├── components/       # UIコンポーネント
│   ├── common/       # 共通コンポーネント
│   ├── content-editor/ # エディタコンポーネント
│   ├── layout/       # レイアウトコンポーネント
│   └── ui/           # shadcn/ui コンポーネント
├── hooks/            # カスタムフック
│   ├── use-content-field-editor.ts # 汎用編集フック
│   ├── use-title-editor.ts         # タイトル編集
│   ├── use-body-editor.ts          # 本文編集
│   └── use-content-management.ts   # コンテンツ管理
├── lib/              # ユーティリティ
│   ├── api-client.ts # API クライアント
│   ├── errors.ts     # エラークラス
│   └── schemas.ts    # バリデーションスキーマ
└── generated/        # 自動生成コード（Orval）
```

### データフロー

```
User Action
    ↓
UI Component (TitleEditor, BodyEditor)
    ↓
Custom Hook (useTitleEditor, useBodyEditor)
    ↓
Generic Hook (useContentFieldEditor)
    ↓
Server Action (updateContentTitle, updateContentBody)
    ↓
API Client (customFetch)
    ↓
Backend API
```

### バリデーション戦略

1. **クライアントサイド**: Zod + Conform によるリアルタイムバリデーション
2. **サーバーサイド**: Server Actions 内での再バリデーション
3. **型安全性**: TypeScript による静的型チェック

### エラーハンドリング戦略

1. **エラーの分類**: `AppError` による構造化されたエラー情報
2. **エラーの伝播**: 元のエラー情報を保持しながら適切なメッセージに変換
3. **ユーザーへの通知**: ブラウザアラートによる即座のフィードバック
4. **ロギング**: `console.error` による開発時のデバッグ支援

## コード品質

- **ESLint**: コードスタイルと潜在的なバグの検出
- **TypeScript**: 静的型チェック
- **Prettier**: コードフォーマット（推奨）

## テスト

### テスト実行

```bash
# ユニットテスト実行
pnpm test
```

### テスト戦略

現在のプロジェクトでは、Server Actions のユニットテストを実装しています。

#### テスト対象

**Server Actions** (`src/actions/form-action.test.ts`):

- タイトル・本文の更新機能
- バリデーションエラーのハンドリング
- API エラー（404 など）のハンドリング

#### テストツール

- **Vitest**: 高速なユニットテストランナー
- **Testing Library**: React コンポーネントのテスト用（設定済み）
- **Happy DOM**: 軽量な DOM 実装

#### テストカバレッジ

主要なビジネスロジックである Server Actions に対してテストを実装しており、以下のケースをカバーしています：

1. **正常系**：データの更新が成功する
2. **バリデーションエラー**：入力値が不正な場合の詳細なエラーメッセージ
3. **API エラー**：404 エラーなど、API 側のエラーハンドリング

#### エラーメッセージのテスト

バリデーションエラー時には、Zod スキーマで定義した詳細なエラーメッセージがユーザーに表示されることを確認しています：

- タイトルが空の場合：「タイトルを入力してください」
- 本文が短すぎる場合：「詳細は 10 文字以上で入力してください」
- リソースが見つからない場合：「コンテンツが見つかりませんでした」
