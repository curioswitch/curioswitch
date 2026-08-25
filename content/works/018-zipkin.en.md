---
title: "Zipkin: Making distributed systems traceable"
organization: "OpenZipkin"
heroImage: "./018-zipkin.hero.png"
---

CurioSwitch engineers contribute to [Zipkin](https://zipkin.io/) and other projects in the OpenZipkin ecosystem.

When a system is made of many services, finding the source of latency or an error becomes difficult. Zipkin gathers timing and metadata recorded by each service and reconstructs the path of a request as a single distributed trace.

## Following the journey of an invisible request

Instrumentation libraries record the start, end, and relationships of operations as spans. Reporters send those spans to a collector, storage keeps them available, and the query API and web UI make them searchable and understandable.

- Jump directly to a complete request using its trace ID
- Search by service, operation, tag, and duration
- See latency and failed operations across a trace
- Explore service relationships through a dependency diagram

## Connecting to different production environments

Zipkin can collect traces through HTTP, Kafka, and other transports. Its storage layer can use in-memory storage, Cassandra, Elasticsearch, and additional backends. This flexibility lets teams introduce tracing in a way that fits the systems they already operate.

CurioSwitch works on technology that turns the inner behavior of complex systems into something teams can understand, troubleshoot, and continuously improve.

- [Zipkin official website](https://zipkin.io/)
- [Zipkin on GitHub](https://github.com/openzipkin/zipkin)
- [Zipkin architecture](https://zipkin.io/pages/architecture.html)

