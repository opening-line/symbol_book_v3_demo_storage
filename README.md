# Symbolブロックチェーンのメタデータを活用した画像データ格納のサンプルアプリケーション

## 動かし方

前提：Node.jsがインストールされていること。動作確認済みバージョンは、22.11.0です。

`client`フォルダに移動し、依存パッケージをインストール。

```bash
$ cd client
$ npm i 
```

`.env.sample`をコピーして、`.env`ファイルを作成する。

```bash
$ cp .env.sample .env
```

`.env`ファイルを開き、`VITE_PRIVATE_KEY`にSymbolテストネットのXYM残高があるアカウントの秘密鍵を入力する。

```
VITE_PRIVATE_KEY=
```

アプリケーションを起動する。

```bash
$ npm run dev
```

ブラウザを開き、`http://localhost:5173/` を開く。
