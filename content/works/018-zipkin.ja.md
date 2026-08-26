---
title: "Zipkin：分散システムの動きを追跡可能に"
organization: "OpenZipkin"
heroImage: "./018-zipkin.hero.png"
---

CurioSwitchのエンジニアは、分散トレーシングシステム[Zipkin](https://zipkin.io/)をはじめとするOpenZipkinのプロジェクトへ継続的に貢献しています。

複数のサービスで構成されるシステムでは、ひとつの遅延やエラーの原因を見つけることが難しくなります。Zipkinは、それぞれのサービスが記録した処理時間や関連情報を集め、リクエストが通った経路をひとつのトレースとして可視化します。

## 見えないリクエストの旅をたどる

アプリケーション内の計測ライブラリは、処理の開始・終了やサービス間の関係をSpanとして記録します。ReporterがデータをCollectorへ送り、Storageへ保存。Query APIとWeb UIを通じて、開発者が検索・分析できる形にします。

- Trace IDからリクエスト全体を直接検索
- サービス名、処理名、タグ、所要時間による絞り込み
- 各処理の成功・失敗とレイテンシーを可視化
- サービス間の依存関係をダイアグラムで表示

## さまざまな運用環境へ接続

トレースはHTTPやKafkaをはじめとする複数の方法で収集でき、保存先にはインメモリ、Cassandra、Elasticsearchなどを選べます。既存のシステム構成に合わせて段階的に導入できる柔軟性も、長く使われるオープンソース基盤に欠かせない特徴です。

CurioSwitchは、複雑なシステムの内部を理解できる形に変え、障害対応と継続的な性能改善を支える技術に取り組んでいます。

- [Zipkin公式サイト](https://zipkin.io/)
- [Zipkin GitHubリポジトリ](https://github.com/openzipkin/zipkin)
- [Zipkinアーキテクチャ](https://zipkin.io/pages/architecture.html)
