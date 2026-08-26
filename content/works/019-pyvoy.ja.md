---
title: "pyvoy：Envoyの力をPythonアプリケーションへ"
organization: "CurioSwitch"
heroImage: "./019-pyvoy.hero.png"
---

[pyvoy](https://pyvoy.dev/)は、CurioSwitchが開発する、Envoy上で動作するPythonアプリケーションサーバーです。EnvoyのDynamic Modulesを利用し、標準のEnvoyバイナリへPythonインタープリターを組み込む独自の構成を採用しています。

Pythonのアプリケーションサーバーは、HTTP/2やHTTP/3など新しいHTTP機能への対応が遅れることがあります。pyvoyは、実運用で磨かれてきたEnvoyのHTTPスタックを活用し、Pythonアプリケーションへ性能と安定性を届けます。

## EnvoyとPython、それぞれの強みを組み合わせる

通信処理はEnvoyへ任せ、アプリケーションは使い慣れたPythonで記述します。ASGIとWSGIの両方へ対応しているため、新しい非同期アプリケーションだけでなく、Flaskなど既存のアプリケーションでも試すことができます。

- ASGI・WSGIアプリケーションとワーカースレッド
- HTTP/2・HTTP/3とWebSocket
- Envoyのフロー制御と連携したバックプレッシャー
- EnvoyのHTTPスタックを使うHTTPクライアント
- ファイル変更時の自動再起動とIDEデバッグ

## 導入はPythonらしくシンプルに

pyvoyはPyPIからインストールでき、パッケージにはEnvoyバイナリも含まれます。複雑な追加構築をせず、通常のPython開発ツールからアプリケーションを起動できます。

CurioSwitchは、既存技術の確かな強みを新しい形で組み合わせ、開発者がより自由にアプリケーションをつくれる基盤を育てています。

- [pyvoy公式ドキュメント](https://pyvoy.dev/)
- [pyvoy GitHubリポジトリ](https://github.com/curioswitch/pyvoy)
