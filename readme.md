# Google Blogger to WaordPress Converter

Blogger の記事を WorddPress に移行する Node のコード。 WP REST API を使っている。完全に自分用なので好きに改変して使ってほしい。

Blogger にはカテゴリ機能がないので、タグのみに対応。slugはドメイン以下を指定。

## 使い方

Blogger のバックアップ機能でダウンロードしたxmlファイルを配置してapp.jsを実行するだけ。

### 準備

Blogger のバックアップ機能でxmlファイルをダウンロードして、ルートディレクトリに配置。

```shell
# このコードをGithubからダウンロード
git clone https://github.com/2001Y/blogger2wp.git
# 必要なライブラリをダウンロード
yarn
```

app.js を開いて、自分の環境に合わせる。

```js
// ▼ ▼ ▼ ▼ ▼ ▼ ▼  OPTION  ▼ ▼ ▼ ▼ ▼ ▼ ▼

const bloggerXml = "blog-02-21-2022.xml";

const URL = "https://yoshikitam.wpx.jp/2001y/";
const WP_user = "2001Y"; //WPユーザー名
const WP_AppPass = "9Qx0 WFj6 Ih8Q OriT e1SY rDFp"; // Application Passwords

// ▲ ▲ ▲ ▲ ▲ ▲ ▲  OPTION  ▲ ▲ ▲ ▲ ▲ ▲ ▲
```

### 実行

```shell
node app
```

「移行 DONE」と出るまで待つ。
