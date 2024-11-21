# 日本語掲示板アプリケーション構造分析

## アプリケーション構成
### フロントエンド
- **フレームワーク**: Next.js (TypeScript)
- **UI ライブラリ**: Material-UI (MUI)
- **スタイリング**: Tailwind CSS

### バックエンド
- **データベース**: MongoDB
- **API**: Next.js API Routes

## 主要コンポーネント
1. `app/page.tsx`
   - メインページコンポーネント
   - 投稿フォーム
   - 投稿一覧表示

2. `app/components/Post.tsx`
   - 個別投稿表示コンポーネント
   - いいね機能
   - 編集/削除機能

## API エンドポイント
1. `GET /api/posts`
   - 全投稿の取得
   - いいね数を含む

2. `POST /api/posts`
   - 新規投稿作成
   - 必須フィールド: title, content, userId, username

3. `PUT /api/posts/[id]`
   - 投稿の更新
   - 所有者のみ可能

4. `DELETE /api/posts/[id]`
   - 投稿の削除
   - 所有者のみ可能

5. `POST /api/posts/[id]/like`
   - いいねの切り替え
   - 1ユーザー1いいね

## データモデル
### Post
- _id: string
- title: string
- content: string
- userId: string
- username: string
- createdAt: string
- updatedAt: string
- likes: Like[]

### Like
- _id: string
- postId: string
- userId: string
- createdAt: string

## ユーザー管理
- LocalStorage による簡易的なユーザー管理
- ユーザーID と ユーザー名の保存

## セキュリティ機能
- 投稿の編集/削除は所有者のみ可能
- いいね機能はユーザーごとに制限

## 今後の改善ポイント
1. 本格的な認証システムの導入
2. 画像アップロード機能
3. コメント機能
4. ページネーション
5. 投稿の検索機能
