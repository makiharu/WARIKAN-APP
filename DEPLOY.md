# Vercelデプロイ手順

## 初回デプロイ

### 1. 前提条件

- GitHubリポジトリが作成されていること
- Node.jsがインストールされていること
- Vercel CLIがインストールされていること（未インストールの場合は以下を実行）

```bash
npm install -g vercel
```

### 2. Vercelにログイン

```bash
vercel login
```

ブラウザが開くので、GitHubアカウントでログインします。

### 3. GitHubにコードをプッシュ

```bash
# 変更をステージング
git add -A

# コミット
git commit -m "コミットメッセージ"

# GitHubにプッシュ
git push origin main
```

### 4. Vercelにデプロイ

本番環境にデプロイする場合：

```bash
vercel --prod --yes
```

プレビュー環境にデプロイする場合：

```bash
vercel --yes
```

### 5. デプロイ完了

デプロイが成功すると、以下のようなURLが表示されます：

- **本番URL**: `https://your-app-name.vercel.app`
- **プレビューURL**: `https://your-app-xxx.vercel.app`

## 2回目以降のデプロイ

### 方法1: Vercel CLIを使う

```bash
# 変更をコミット＆プッシュ
git add -A
git commit -m "変更内容"
git push origin main

# 本番環境にデプロイ
vercel --prod --yes
```

### 方法2: 自動デプロイ（推奨）

GitHubリポジトリとVercelを連携すると、`main`ブランチへのプッシュで自動的に本番環境がデプロイされます。

#### 自動デプロイの設定方法

1. [Vercelダッシュボード](https://vercel.com/dashboard)にアクセス
2. プロジェクトを選択
3. Settings → Git → Connect Git Repository
4. GitHubリポジトリを選択して連携

**連携後は、GitHubにプッシュするだけで自動デプロイされます！**

```bash
git add -A
git commit -m "変更内容"
git push origin main
# → 自動的に本番環境が更新されます
```

## トラブルシューティング

### ビルドエラーが発生した場合

```bash
# ローカルで本番ビルドをテスト
npm run build

# エラーがなければプッシュ
git push origin main
```

### デプロイログを確認

```bash
vercel inspect <deployment-url> --logs
```

### 環境変数の設定

Vercelダッシュボードで設定：

1. Project Settings → Environment Variables
2. 必要な環境変数を追加（例: API_KEYなど）

または、CLIで設定：

```bash
vercel env add <環境変数名>
```

## Vercel無料プランの制限

- **帯域幅**: 100GB/月
- **ビルド時間**: 100時間/月
- **デプロイ数**: 無制限
- **カスタムドメイン**: 対応

個人プロジェクトや小規模アプリには十分な範囲です。

## 便利なコマンド

```bash
# プロジェクト一覧を表示
vercel list

# デプロイ履歴を確認
vercel ls

# 特定のデプロイを削除
vercel remove <deployment-url>

# ローカルで本番環境をエミュレート
vercel dev
```

## 参考リンク

- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Next.jsデプロイガイド](https://nextjs.org/docs/deployment)
