---
title: "protobuf-py：Pythonのための妥協のないProtobuf"
organization: "Buf"
heroImage: "./015-protobuf-py.hero.png"
---

CurioSwitchのエンジニアが、Bufによる新しいProtocol Buffersライブラリ「[protobuf-py](https://github.com/bufbuild/protobuf-py)」の開発に参画しました。

`protobuf-py`は、Pythonのためにゼロから設計された、モダンで扱いやすいProtobuf実装です。仕様への準拠、Pythonらしい開発体験、実運用に耐える性能を同時に実現しています。

## Pythonらしく、読みやすく

生成されるのは、型情報を備えた読みやすいPythonコードです。メッセージは通常のPythonオブジェクトとして扱うことができ、フィールドへのアクセスや更新、パターンマッチングなど、Pythonの自然な書き方で利用できます。

- 型付きで読みやすい生成コード
- Pythonネイティブな値とAPI
- 相対インポートによる扱いやすいパッケージ構成
- ランタイム依存なしで動作するPure Python 3.10+対応

## 仕様の完全性と開発体験を両立

proto2、proto3、Editionsに加え、拡張、カスタムオプション、未知フィールド、動的メッセージ、Well-Known Typesなど、Protobufの幅広い仕様をサポートしています。バイナリとJSONのConformance Suiteもすべて通過しており、親しみやすさのために仕様を削ることなく、実際のプロジェクトで安心して利用できる基盤を目指しています。

## 必要なところをRustで高速化

データはPythonオブジェクトとして保持しながら、パースやシリアライズなど負荷の高い処理をオプションのRustアクセラレーターで高速化します。Pure Pythonでも同じ振る舞いを保ち、アクセラレーターを導入した環境では本番ワークロードに必要な性能を引き出せます。

Pythonは、データパイプライン、機械学習、AIエージェント、RPCサービス、開発ツールなど幅広い領域で使われています。`protobuf-py`は、それらを支える通信基盤を、よりPythonらしく、より快適にするためのオープンソースプロジェクトです。

- [Bufによる公式紹介記事](https://buf.build/blog/protobuf-py)
- [protobuf-py GitHubリポジトリ](https://github.com/bufbuild/protobuf-py)
- [protobuf-py ドキュメント](https://protobufpy.com/)
