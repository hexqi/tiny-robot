import type {
  AIRequest,
  BuildPromptInput,
  QuickAssistContext,
  QuickAssistInstance,
  Suggestion,
} from '@opentiny/tiny-robot/vanilla'
import type { ChatRuntime } from '@opentiny/tiny-robot-chat'
import type { TrChatHTMLElement } from '@opentiny/tiny-robot-chat/experimental'

export const DEMO_TENANT_ID = 'tenant-demo-4812'

export interface MetricItem {
  id: string
  title: string
  value: string
  status: string
  level: 'alert' | 'warning'
  summary: string
  suggestions: Suggestion[]
}

export const DEMO_METRICS: readonly MetricItem[] = [
  {
    id: 'ecs-cpu',
    title: 'ECS 集群 CPU 使用率',
    value: '94%',
    status: '告警',
    level: 'alert',
    summary: '华东核心集群近 15 分钟 CPU 持续高于 90%，存在排队风险。',
    suggestions: [
      {
        id: 'cpu-root-cause',
        label: '分析 CPU 飙升排查步骤',
        prompt: 'ECS 集群 CPU 使用率达到 94%，请给出按优先级排序的排查步骤与止血建议。',
      },
      {
        id: 'cpu-scale',
        label: '给出弹性扩容阈值建议',
        prompt: '针对 CPU 使用率 94% 的场景，应该如何配置合理的弹性伸缩规则？',
      },
    ],
  },
  {
    id: 'gateway-5xx',
    title: '网关 5xx 错误率',
    value: '2.4%',
    status: '异常',
    level: 'warning',
    summary: 'API 网关 502/504 占比上升，集中在订单查询上游服务。',
    suggestions: [
      {
        id: 'gateway-triage',
        label: '生成网关 5xx 分层排查清单',
        prompt: 'API 网关 5xx 错误率升至 2.4%，请提供从入口到上游服务的分层排查清单。',
      },
      {
        id: 'gateway-degrade',
        label: '给出熔断与降级策略',
        prompt: '上游服务异常触发网关 5xx 时，推荐配置哪些熔断与超时策略？',
      },
    ],
  },
]

export interface AssistContextSummary {
  source: string
  selectedText: string
  query: string
  sanitizedTenant: string
  prompt: string
  context: QuickAssistContext
}

const SENSITIVE_PATTERN = /(tenant-[a-z0-9-]+|sk-[a-z0-9-]+)/gi

export function sanitizeText(value: string): string {
  return value.replace(SENSITIVE_PATTERN, '[已脱敏]')
}

export function sanitizeContext(context: QuickAssistContext): QuickAssistContext {
  const businessContext = context.businessContext
    ? Object.fromEntries(
        Object.entries(context.businessContext).map(([key, value]) => [
          key,
          typeof value === 'string' ? sanitizeText(value) : value,
        ]),
      )
    : undefined

  return {
    ...context,
    text: sanitizeText(context.text),
    selection: context.selection ? { text: sanitizeText(context.selection.text) } : undefined,
    nearbyText: typeof context.nearbyText === 'string' ? sanitizeText(context.nearbyText) : undefined,
    businessContext,
  }
}

export function buildDemoPrompt({ query, context, suggestion }: BuildPromptInput): string {
  const basePrompt = sanitizeText((suggestion?.prompt ?? query).trim())
  const selected = sanitizeText(context.text.trim())
  const moduleName =
    typeof context.businessContext?.module === 'string' ? context.businessContext.module : '云运维工作台'
  const tenant = typeof context.businessContext?.tenantId === 'string' ? context.businessContext.tenantId : '[已脱敏]'

  const lines = [`[上下文] 模块：${moduleName}｜租户：${tenant}`]
  if (selected && !basePrompt.includes(selected)) {
    lines.push(`[选中内容] ${selected}`)
  }
  lines.push(`[提问] ${basePrompt}`)
  return lines.join('\n')
}

async function waitForChatElement(getChatElement: () => TrChatHTMLElement | null): Promise<TrChatHTMLElement> {
  const existing = getChatElement()
  if (existing) return existing
  for (let i = 0; i < 20; i++) {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    const el = getChatElement()
    if (el) return el
  }
  throw new Error('未找到已挂载的 tr-chat 元素')
}

export interface CreateBridgeParams {
  scopeSelector: string
  openPanel: () => void | Promise<void>
  getChatElement: () => TrChatHTMLElement | null
  getRuntime: () => ChatRuntime | undefined
  onContextChange: (summary: AssistContextSummary) => void
}

export async function createQuickAssistTrChatBridge(params: CreateBridgeParams): Promise<{
  quickAssist: QuickAssistInstance
  activateMetric: (anchor: Element, metric: MetricItem) => void
  destroy: () => void
}> {
  const [{ createQuickAssist }, { whenTrChatReady }] = await Promise.all([
    import('@opentiny/tiny-robot/vanilla'),
    import('@opentiny/tiny-robot-chat/experimental'),
  ])

  const quickAssist = createQuickAssist({
    include: [params.scopeSelector],
    exclude: ['tr-chat', 'tr-chat-ui', '[data-sensitive]', '[data-ai-selection="false"]'],
    selection: { maxTextLength: 260 },
    trigger: { label: '智能帮助', placement: 'bottom-end' },
    input: { placeholder: '输入问题，自动发送到右侧 tr-chat…', maxRows: 3 },
    getContext: () => ({
      product: 'TinyRobot 云运维工作台',
      module: '云主机与安全组控制台',
      tenantId: DEMO_TENANT_ID,
    }),
    sanitizeContext,
    suggestions: [
      {
        id: 'explain',
        getLabel: (ctx) => `解释「${ctx.text.slice(0, 14)}${ctx.text.length > 14 ? '…' : ''}」`,
        getPrompt: (ctx) => `请结合云运维工作台场景，解释「${ctx.text}」的核心要点与注意事项。`,
      },
      {
        id: 'checklist',
        getLabel: () => '生成排查清单',
        getPrompt: (ctx) => `围绕「${ctx.text}」，给出可执行的检查与操作步骤。`,
      },
    ],
    buildPrompt: buildDemoPrompt,
    adapter: {
      submit: async (request: AIRequest) => {
        params.onContextChange({
          source: request.source,
          selectedText: request.context.text,
          query: request.query,
          sanitizedTenant:
            typeof request.context.businessContext?.tenantId === 'string'
              ? request.context.businessContext.tenantId
              : '[已脱敏]',
          prompt: request.prompt,
          context: request.context,
        })

        await params.openPanel()
        const chatEl = await waitForChatElement(params.getChatElement)
        await whenTrChatReady(chatEl)

        const runtime = params.getRuntime() ?? chatEl.runtime
        if (runtime?.activeConversation.value?.requestState === 'processing') {
          await runtime.actions.abort?.()
        }

        const accepted = await chatEl.send({ text: request.prompt })
        if (!accepted) throw new Error('tr-chat 未接受本次发送请求')
        void chatEl.focusInput()
      },
    },
  })

  return {
    quickAssist,
    activateMetric(anchor, metric) {
      quickAssist.activate({
        source: 'metric-card',
        text: `${metric.title}：${metric.value}（${metric.summary}）`,
        anchor,
        open: 'popover',
        suggestions: metric.suggestions,
      })
    },
    destroy: () => quickAssist.destroy(),
  }
}
