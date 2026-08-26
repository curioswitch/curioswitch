---
title: "pyvoy: Bringing the power of Envoy to Python applications"
organization: "CurioSwitch"
heroImage: "./019-pyvoy.hero.png"
---

[pyvoy](https://pyvoy.dev/) is a Python application server developed by CurioSwitch and implemented in Envoy. It uses Envoy Dynamic Modules to embed a Python interpreter inside a module loaded by a stock Envoy binary.

Python application servers have often lagged behind in support for modern HTTP capabilities such as HTTP/2 and HTTP/3. pyvoy builds on Envoy's battle-tested HTTP stack to bring performance and stability to Python applications.

## Combining the strengths of Envoy and Python

Envoy handles the network stack while application code remains in familiar Python. Support for both ASGI and WSGI means developers can run modern asynchronous services as well as existing applications such as Flask.

- ASGI and WSGI applications with worker threads
- HTTP/2, HTTP/3, and WebSockets
- Backpressure integrated with Envoy flow control
- An HTTP client using the Envoy stack
- Automatic reload on file changes and IDE debugging

## Simple to adopt in a Python workflow

pyvoy is distributed through PyPI and includes the Envoy binary. Developers can install and run it with familiar Python package tools without a separate, complicated build process.

CurioSwitch combines the proven strengths of existing technology in new ways, building foundations that give developers more freedom to create capable applications.

- [pyvoy official documentation](https://pyvoy.dev/)
- [pyvoy on GitHub](https://github.com/curioswitch/pyvoy)
