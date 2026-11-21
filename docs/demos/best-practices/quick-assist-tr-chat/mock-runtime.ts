import { createChatRuntime, type ChatRuntimeHandle } from '@opentiny/tiny-robot-chat'
import type { ChatCompletion, MessageRequestBody } from '@opentiny/tiny-robot-kit'

function lastUserText(requestBody: MessageRequestBody): string {
  const messages = requestBody.messages ?? []
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    if (message.role !== 'user') continue
    if (typeof message.content === 'string') return message.content
  }
  return ''
}

function buildReply(prompt: string): string {
  if (/CPU|94%/i.test(prompt)) {
    return [
      '### ECS 集群 CPU 使用率（94%）排查建议',
      '',
      '1. **定位热点线程**：在目标节点执行 `top -H -p <pid>`，确认是业务计算还是 GC 抖动。',
      '2. **核对变更记录**：检查最近 30 分钟发布、定时任务与流量突增。',
      '3. **临时止血**：开启弹性伸缩扩容或对非核心接口限流。',
    ].join('\n')
  }
  if (/5xx|网关/i.test(prompt)) {
    return [
      '### 网关 5xx 异常分层排查清单',
      '',
      '- **网关层**：核对上游连接池与 `502/504` 超时配置；',
      '- **应用层**：查看订单服务 Pod 重启与 OOM 日志；',
      '- **依赖层**：排查数据库慢查询并启用临时熔断降级。',
    ].join('\n')
  }
  if (/竞价|包年包月|按需/i.test(prompt)) {
    return [
      '### 云服务器计费模式选型建议',
      '',
      '- **包年包月**：适合 7×24 稳定运行的核心业务；',
      '- **按需计费**：适合压测、短期扩容与波动负载；',
      '- **竞价计费**：成本最低但存在回收风险，建议仅用于无状态离线任务或 CI 构建。',
    ].join('\n')
  }
  if (/安全组|最小权限/i.test(prompt)) {
    return [
      '### 安全组最小权限基线',
      '',
      '1. 禁止对 `0.0.0.0/0` 直接开放数据库与 SSH 端口；',
      '2. 应用层与数据层采用安全组互信引用而非全网段放通；',
      '3. 定期审计临时调试规则并开启 VPC 流日志。',
    ].join('\n')
  }
  return `已收到来自工作台的提问（已结合脱敏上下文）：\n\n> ${prompt.replace(/\n+/g, '\n> ')}\n\n你可以继续在下方输入多轮追问，或回到左侧正文再次划词。`
}

export function createDemoChatRuntime(): ChatRuntimeHandle {
  return createChatRuntime({
    conversation: {
      autoSaveMessages: false,
      useMessageOptions: {
        responseProvider: async function* (requestBody, abortSignal): AsyncGenerator<ChatCompletion> {
          const reply = buildReply(lastUserText(requestBody))
          const chunks = reply.match(/[\s\S]{1,12}/g) ?? [reply]
          const id = `qa-trchat-${Date.now()}`
          const created = Math.floor(Date.now() / 1000)

          for (let i = 0; i < chunks.length; i++) {
            if (abortSignal.aborted) return
            await new Promise((resolve) => setTimeout(resolve, 26))
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
                  delta: i === 0 ? { role: 'assistant', content: chunks[i] } : { content: chunks[i] },
                  finish_reason: i === chunks.length - 1 ? 'stop' : null,
                  logprobs: null,
                },
              ],
            }
          }
        },
      },
    },
  })
}
