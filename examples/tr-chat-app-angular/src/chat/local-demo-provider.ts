import type { ChatCompletion, MessageRequestBody } from '@opentiny/tiny-robot-kit'

function extractLastUserText(requestBody: MessageRequestBody): string {
  const messages = requestBody.messages ?? []
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    if (message.role !== 'user') continue
    const content: unknown = message.content
    if (typeof content === 'string') return content
    if (Array.isArray(content)) {
      return content
        .filter(
          (part): part is { type: 'text'; text: string } =>
            typeof part === 'object' && part !== null && part.type === 'text' && typeof part.text === 'string',
        )
        .map((part) => part.text)
        .join('\n')
    }
  }
  return ''
}

function buildDemoMarkdownReply(prompt: string): string {
  const text = prompt.trim()
  if (/CPU|94%|负载/i.test(text)) {
    return [
      '### ECS 集群 CPU 使用率告警排查建议',
      '',
      '检测到当前上下文涉及 **CPU 使用率持续偏高（94%）**，建议按以下步骤定位：',
      '',
      '1. **确认热点进程**：登录异常节点执行 `top -H -p <pid>`，区分是业务计算线程还是 GC/内核态占用。',
      '2. **检查近期变更**：核对最近 30 分钟内的镜像发布、定时任务及流量突发记录。',
      '3. **启用临时止血**：优先触发弹性伸缩扩容或对非核心接口限流，避免雪崩。',
      '',
      '```bash',
      '# 快速查看占用最高的线程与 CPU 分布',
      'mpstat -P ALL 1 3 && pidstat -u 1 3',
      '```',
      '',
      '> 当前为**本地流式演示回复**；在 `.env` 中配置真实模型密钥或代理地址后将自动切换为真实大模型。',
    ].join('\n')
  }

  if (/5xx|错误率|网关/i.test(text)) {
    return [
      '### 网关 5xx 错误率飙升诊断清单',
      '',
      '针对 **网关 5xx 异常**，建议从入口到上游服务逐层排除：',
      '',
      '| 排查层次 | 关注指标 | 建议动作 |',
      '| --- | --- | --- |',
      '| 网关入口 | `502/504` 占比与超时阈值 | 检查上游连接池耗尽与超时配置 |',
      '| 上游服务 | Pod 重启次数 / OOM 事件 | 查看 `kubectl describe pod` 与错误日志 |',
      '| 依赖组件 | 数据库/缓存 RT 抖动 | 启用熔断降级并观察慢查询 |',
      '',
      '> 当前为**本地流式演示回复**；配置 `.env` 后可直接对接真实大模型与 MCP 工具。',
    ].join('\n')
  }

  if (/竞价|包年包月|按需|计费/i.test(text)) {
    return [
      '### 云服务器计费模式选型对比',
      '',
      '- **包年包月**：适合核心 Web 服务、数据库等 7×24 稳定运行负载，长期成本最优。',
      '- **按需计费**：按秒/小时计费，适合压测环境、短期活动扩容与业务初期探索。',
      '- **竞价计费**：利用闲置算力成本最低，但实例可能被回收，**仅建议用于无状态离线计算、CI 构建或容错批处理**。',
      '',
      '> 如需结合业务预算做进一步测算，可以直接继续追问。',
    ].join('\n')
  }

  if (/安全组|端口|最小权限/i.test(text)) {
    return [
      '### 网络安全组最小权限基线建议',
      '',
      '1. **收紧来源网段**：避免对 `0.0.0.0/0` 直接放通 SSH（22）、数据库（3306/5432）等高危端口。',
      '2. **按业务分层隔离**：Web 层仅对外开放 80/443，应用层与数据层通过安全组互相引用放通。',
      '3. **定期审计规则**：清理过期临时调试规则，并开启 VPC 流日志监控异常扫描。',
      '',
      '```yaml',
      'ingress:',
      '  - port: 443',
      '    source: 0.0.0.0/0',
      '  - port: 22',
      '    source: 10.20.0.0/16 # 仅限堡垒机网段',
      '```',
    ].join('\n')
  }

  return [
    '### 已收到你的问题',
    '',
    '已结合当前工作台上下文处理请求：',
    '',
    `> ${text.replace(/\n+/g, '\n> ')}`,
    '',
    '- 你可以继续在当前会话中多轮追问，或在左侧业务正文再次划词发起新的上下文提问。',
    '- 当前运行在**本地流式演示模式**（无需 API Key）；配置 `.env` 后会自动切换为真实模型服务。',
  ].join('\n')
}

export function createLocalDemoResponseProvider() {
  return async function* localDemoResponseProvider(
    requestBody: MessageRequestBody,
    abortSignal: AbortSignal,
  ): AsyncGenerator<ChatCompletion> {
    const prompt = extractLastUserText(requestBody)
    const reply = buildDemoMarkdownReply(prompt)
    const chunks = reply.match(/[\s\S]{1,14}/g) ?? [reply]
    const id = `local-demo-${Date.now()}`
    const created = Math.floor(Date.now() / 1000)

    for (let index = 0; index < chunks.length; index++) {
      if (abortSignal.aborted) return
      await new Promise((resolve) => setTimeout(resolve, 24))
      if (abortSignal.aborted) return
      yield {
        id,
        object: 'chat.completion.chunk',
        created,
        model: 'local-demo',
        system_fingerprint: null,
        choices: [
          {
            index: 0,
            message: undefined,
            delta: index === 0 ? { role: 'assistant', content: chunks[index] } : { content: chunks[index] },
            finish_reason: index === chunks.length - 1 ? 'stop' : null,
            logprobs: null,
          },
        ],
      }
    }
  }
}
