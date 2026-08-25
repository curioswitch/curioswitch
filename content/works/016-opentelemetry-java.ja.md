---
title: "OpenTelemetry Java：観測可能性の標準をJavaへ"
organization: "OpenTelemetry"
heroImage: "./016-opentelemetry-java.hero.png"
---

CurioSwitchのエンジニアは、Amazon在籍時から[OpenTelemetry Java](https://github.com/open-telemetry/opentelemetry-java) SDKの開発・公開とAWSサービスとの統合を推進してきました。

OpenTelemetryは、アプリケーションからトレース、メトリクス、ログなどのテレメトリーデータを収集し、特定の監視サービスに依存しない形で扱うためのオープンな標準です。OpenTelemetry Javaは、そのAPIとSDKをJavaのエコシステムへ届ける中核実装です。

## 計測の共通言語をつくる

分散システムでは、ひとつのリクエストが複数のサービスを横断します。OpenTelemetry Javaは、それぞれの処理を同じ文脈で記録し、問題が起きた場所や性能の変化を追えるようにします。

- トレース、メトリクス、ログを扱う共通API
- 計測データを管理するJava SDK
- OTLPをはじめとする各種エクスポーター
- 自動設定や既存の計測基盤と接続する拡張機能

## 幅広い環境で使える安定したSDKへ

ライブラリとして長く使われるためには、機能だけでなく互換性、依存関係、リリース運用まで含めた設計が必要です。OpenTelemetry Javaは安定版APIの後方互換性を重視し、関連モジュールのバージョンをBOMで揃えられる仕組みを提供しています。

CurioSwitchは、オープンな観測基盤を通じて、開発者がサービスの状態を正しく理解し、安心して改善を続けられる環境づくりに貢献しています。

- [OpenTelemetry Java GitHubリポジトリ](https://github.com/open-telemetry/opentelemetry-java)
- [OpenTelemetry Javaドキュメント](https://opentelemetry.io/docs/languages/java/)

