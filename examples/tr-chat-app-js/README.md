# TinyRobot AI · 原生 JS（QuickAssist + TrChat）

使用无框架的原生 TypeScript / DOM API，将 **QuickAssist（`@opentiny/tiny-robot/vanilla`）** 与 **`tr-chat` Web Component（`@opentiny/tiny-robot-chat/experimental`）** 联合接入云运维工作台与完整聊天应用。

## 1 准备依赖

使用 Node 22（至少 22.12）和 pnpm 10.34.5，在本项目目录运行：

```sh
pnpm install
```

## 2 启动与构建（支持无密钥开箱体验）

```sh
pnpm dev
```

打开：
- 联合实践工作台：http://127.0.0.1:4347/workspace
- 完整聊天页：http://127.0.0.1:4347/chat

未配置 `.env` 时自动启用**本地流式演示模式**；复制 `.env.example` 为 `.env` 并填写 `VITE_DEEPSEEK_API_KEY` / `VITE_ALIYUN_DASHSCOPE_KEY` 或 OpenAI 兼容代理地址后，重启即自动切换为真实大模型与 MCP 工具。

```sh
pnpm type-check
pnpm build
```

## 3 核心结构

- `src/chat/quick-assist-bridge.ts`：框架无关的 QuickAssist ↔ `tr-chat` 桥接器，处理 Light DOM 选区隔离、上下文脱敏、`whenTrChatReady` 时序、并发流控与发送聚焦。
- `src/chat/floating-assistant.ts`：原生 DOM 实现的可拖拽/缩放/全屏悬浮 `tr-chat` 助手与 `sender-header` 引用上下文条。
- `src/chat/local-demo-provider.ts`：基于 `AsyncGenerator` 的无密钥本地流式模拟响应。
- `src/pages/workspace-page.ts`：云服务运维工作台，展示业务正文划词、指标卡片主动 `activate()` 与敏感区拦截。
