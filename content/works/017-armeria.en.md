---
title: "Armeria: Bringing many protocols onto one foundation"
organization: "Armeria"
heroImage: "./017-armeria.hero.png"
---

A CurioSwitch engineer has contributed gRPC support, high-performance decoders, and other improvements to [Armeria](https://armeria.dev/), a reactive microservice framework for Java.

Armeria serves gRPC, Thrift, REST, static files, health checks, and other service types through a single port. Built on Netty, it combines high concurrency with a flexible development experience.

## Connecting different technologies naturally

Real services rarely rely on only one protocol. A team may need to adopt gRPC while maintaining an existing REST API or expose monitoring endpoints from the same application. Armeria brings these workloads together without requiring an extra proxy or sidecar.

- gRPC, Thrift, and REST on the same server
- Integrations with Spring Boot and Dropwizard
- A documentation service for exploring and calling RPCs in a browser
- Service discovery and client-side load balancing

## Reusable features across the request pipeline

Authentication, metrics, distributed tracing, retries, and rate limiting can be composed as reusable decorators. This keeps application logic focused while providing production capabilities through one consistent API.

CurioSwitch works on technical foundations that cross protocol and framework boundaries, so teams can spend more time building the product that matters.

- [Armeria official website](https://armeria.dev/)
- [Armeria on GitHub](https://github.com/line/armeria)

