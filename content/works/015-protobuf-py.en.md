---
title: "protobuf-py: Protobuf for Python, without compromises"
organization: "Buf"
heroImage: "./015-protobuf-py.hero.png"
---

A CurioSwitch engineer contributed to the development of [protobuf-py](https://github.com/bufbuild/protobuf-py), a new Protocol Buffers library from Buf.

Built from scratch for Python, `protobuf-py` is a modern and ergonomic Protobuf implementation that brings together complete specification coverage, an idiomatic Python experience, and performance suitable for production workloads.

## Readable, idiomatic Python

The generated output is real, readable Python with built-in type information. Messages behave like ordinary Python objects, allowing developers to access and update fields, use pattern matching, and work with familiar language features.

- Readable generated code with strong typing
- Python-native values and APIs
- Relative imports that fit naturally into packages
- Pure Python 3.10+ support with no runtime dependencies

## A friendly experience without sacrificing completeness

`protobuf-py` supports proto2, proto3, Editions, extensions, custom options, unknown fields, dynamic messages, Well-Known Types, and more. It passes every binary and JSON case in the Protobuf Conformance Suite, providing a foundation that is both pleasant to use and ready for real-world schemas.

## Rust acceleration where it matters

Message data stays in normal Python objects, while an optional Rust accelerator speeds up demanding operations such as parsing and serialization. The Pure Python path provides the same behavior, and environments using the accelerator can achieve the performance required by production applications.

Python powers data pipelines, machine learning systems, AI agents, RPC services, and developer tooling. `protobuf-py` is an open-source project designed to give those systems a more natural and capable Protobuf foundation.

- [Official announcement from Buf](https://buf.build/blog/protobuf-py)
- [protobuf-py on GitHub](https://github.com/bufbuild/protobuf-py)
- [protobuf-py documentation](https://protobufpy.com/)
