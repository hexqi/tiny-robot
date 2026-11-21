import {
  createQuickAssist,
  type AIRequest,
  type BuildPromptInput,
  type QuickAssistContext,
  type QuickAssistEvent,
  type QuickAssistInstance,
  type QuickAssistOptions,
  type Suggestion,
} from '@opentiny/tiny-robot/vanilla'
import type { ChatRuntime } from '@opentiny/tiny-robot-chat'
import { whenTrChatReady, type TrChatHTMLElement } from '@opentiny/tiny-robot-chat/experimental'

export const WORKSPACE_TENANT_ID = 'tenant-demo-4812'

export interface WorkspaceMetric {
  id: string
  title: string
  value: string
  status: string
  level: 'alert' | 'warning' | 'normal'
  summary: string
  suggestions: Suggestion[]
}

export const WORKSPACE_METRICS: readonly WorkspaceMetric[] = [
  {
    id: 'ecs-cpu',
    title: 'ECS 集群 CPU 使用率',
    value: '94%',
    status: '告警',
    level: 'alert',
    summary: '华东核心集群近 15 分钟 CPU 使用率持续高于 90%，存在请求排队风险。',
    suggestions: [
      {
        id: 'cpu-root-cause',
        label: '分析 CPU 飙升常见原因与排查步骤',
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
    summary: 'API 网关 502/504 占比上升，主要集中于订单查询上游服务。',
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
  {
    id: 'release-check',
    title: '版本发布就绪检查',
    value: '3 项待确认',
    status: '待评审',
    level: 'normal',
    summary: '包含安全组变更复核、灰度回滚预案与监控告警演练。',
    suggestions: [
      {
        id: 'release-checklist',
        label: '补全生产发布前检查项',
        prompt: '结合灰度发布与回滚预案，帮我整理一份生产版本发布前的关键检查清单。',
      },
      {
        id: 'release-risk',
        label: '识别发布变更中的高风险项',
        prompt: '发布涉及安全组与网关配置变更时，有哪些容易遗漏的高风险点？',
      },
    ],
  },
]

export interface QuickAssistContextSummary {
  source: string
  selectedText: string
  query: string
  moduleName: string
  sanitizedTenant: string
}

export interface QuickAssistChatBridgeOptions {
  /** 展开 tr-chat 面板（悬浮窗或侧边抽屉） */
  openChatPanel: () => void | Promise<void>
  /** 获取当前已挂载的 tr-chat 元素 */
  getChatElement: () => TrChatHTMLElement | null
  /** 获取当前 ChatRuntime（用于并发流控） */
  getRuntime?: () => ChatRuntime | undefined
  /** 当前会话正在生成时的处理策略，默认先中止当前回复再发送 */
  busyStrategy?: 'abort-and-send' | 'new-conversation'
  /** 提交时同步脱敏后的引用摘要，供宿主在 sender-header 等位置展示 */
  onContextChange?: (summary: QuickAssistContextSummary, request: AIRequest) => void
  /** QuickAssist 事件回调 */
  onEvent?: (event: QuickAssistEvent) => void
  /** 限定原生划词区域，默认圈定业务正文 [data-qa-scope] */
  include?: string[]
  /** 额外排除区域（默认自动排除 tr-chat / tr-chat-ui 与浮窗历史面板） */
  exclude?: string[]
}

export interface QuickAssistChatBridge {
  readonly quickAssist: QuickAssistInstance
  activateMetric: (anchor: Element, metric: WorkspaceMetric) => void
  close: () => void
  destroy: () => void
}

const SENSITIVE_PATTERN = /(tenant-[a-z0-9-]+|sk-[a-z0-9-]+)/gi

export function sanitizeSensitiveText(value: string): string {
  return value.replace(SENSITIVE_PATTERN, '[已脱敏]')
}

export function sanitizeQuickAssistContext(context: QuickAssistContext): QuickAssistContext {
  const businessContext = context.businessContext
    ? Object.fromEntries(
        Object.entries(context.businessContext).map(([key, value]) => [
          key,
          typeof value === 'string' ? sanitizeSensitiveText(value) : value,
        ]),
      )
    : undefined

  return {
    ...context,
    text: sanitizeSensitiveText(context.text),
    selection: context.selection ? { text: sanitizeSensitiveText(context.selection.text) } : undefined,
    nearbyText: typeof context.nearbyText === 'string' ? sanitizeSensitiveText(context.nearbyText) : undefined,
    businessContext,
  }
}

export function buildWorkspacePrompt({ query, context, suggestion }: BuildPromptInput): string {
  const basePrompt = sanitizeSensitiveText((suggestion?.prompt ?? query).trim())
  const selectedText = sanitizeSensitiveText(context.text.trim())
  const moduleName = typeof context.businessContext?.module === 'string' ? context.businessContext.module : '项目工作台'
  const tenant = typeof context.businessContext?.tenantId === 'string' ? context.businessContext.tenantId : '[已脱敏]'

  const lines = [`[上下文] 模块：${moduleName}｜租户：${tenant}`]
  if (selectedText && !basePrompt.includes(selectedText)) {
    lines.push(`[选中内容] ${selectedText}`)
  }
  lines.push(`[提问] ${basePrompt}`)
  return lines.join('\n')
}

async function waitForChatElement(getChatElement: () => TrChatHTMLElement | null): Promise<TrChatHTMLElement> {
  const immediate = getChatElement()
  if (immediate) return immediate
  for (let attempt = 0; attempt < 20; attempt++) {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    const element = getChatElement()
    if (element) return element
  }
  throw new Error('未找到已挂载的 tr-chat 元素，无法发送 QuickAssist 请求。')
}

function createWorkspaceSuggestions(context: QuickAssistContext): Suggestion[] {
  const snippet = context.text.slice(0, 18)
  const suffix = context.text.length > 18 ? '…' : ''
  return [
    {
      id: 'explain-concept',
      label: `解释「${snippet}${suffix}」`,
      prompt: `请结合当前工作台场景，通俗解释「${context.text}」的核心要点与注意事项。`,
    },
    {
      id: 'action-checklist',
      label: '给出操作排查清单',
      prompt: `围绕「${context.text}」，给出可直接落地的检查与操作清单。`,
    },
  ]
}

/**
 * 框架无关的 QuickAssist <-> tr-chat 联合桥接器。
 * 统一处理：Light DOM 选区隔离、敏感上下文脱敏、展开浮窗、whenTrChatReady 等待、并发流控与发送聚焦。
 */
export function createQuickAssistChatBridge(options: QuickAssistChatBridgeOptions): QuickAssistChatBridge {
  const include = options.include ?? ['[data-qa-scope]']
  const exclude = [
    'tr-chat',
    'tr-chat-ui',
    '.assistant-history',
    '.assistant-launcher',
    '[data-sensitive]',
    '[data-ai-selection="false"]',
    ...(options.exclude ?? []),
  ]

  const quickAssistOptions: QuickAssistOptions = {
    include,
    exclude,
    selection: { maxTextLength: 300 },
    trigger: { label: '智能帮助', placement: 'bottom-end' },
    input: { placeholder: '针对选中内容向 AI 助手提问…', maxRows: 3 },
    getContext: () => ({
      product: 'TinyRobot 云运维工作台',
      module: '项目工作台',
      tenantId: WORKSPACE_TENANT_ID,
    }),
    sanitizeContext: (context) => sanitizeQuickAssistContext(context),
    suggestions: [
      {
        id: 'explain-concept',
        getLabel: (context) => createWorkspaceSuggestions(context)[0].label,
        getPrompt: (context) => createWorkspaceSuggestions(context)[0].prompt,
      },
      {
        id: 'action-checklist',
        getLabel: (context) => createWorkspaceSuggestions(context)[1].label,
        getPrompt: (context) => createWorkspaceSuggestions(context)[1].prompt,
      },
    ],
    buildPrompt: buildWorkspacePrompt,
    adapter: {
      submit: async (request) => {
        const summary: QuickAssistContextSummary = {
          source: request.source,
          selectedText: request.context.text,
          query: request.query,
          moduleName:
            typeof request.context.businessContext?.module === 'string'
              ? request.context.businessContext.module
              : '项目工作台',
          sanitizedTenant:
            typeof request.context.businessContext?.tenantId === 'string'
              ? request.context.businessContext.tenantId
              : '[已脱敏]',
        }
        options.onContextChange?.(summary, request)

        await options.openChatPanel()
        const chatElement = await waitForChatElement(options.getChatElement)
        await whenTrChatReady(chatElement)

        const runtime = options.getRuntime?.() ?? chatElement.runtime
        if (runtime?.activeConversation.value?.requestState === 'processing') {
          if (options.busyStrategy === 'new-conversation') {
            await runtime.actions.createConversation()
          } else {
            await runtime.actions.abort?.()
          }
        }

        const accepted = await chatElement.send({ text: request.prompt })
        if (!accepted) {
          throw new Error('tr-chat 未接受本次消息发送，请稍后重试。')
        }
        void chatElement.focusInput()
      },
    },
    onEvent: (event) => {
      options.onEvent?.(event)
      if (event.type === 'error') {
        console.error('[QuickAssistBridge]', event.stage, event.error)
      }
    },
  }

  const quickAssist = createQuickAssist(quickAssistOptions)

  return {
    quickAssist,
    activateMetric(anchor, metric) {
      quickAssist.activate({
        source: 'metric-card',
        text: `${metric.title}：${metric.value}（${metric.summary}）`,
        anchor,
        open: 'popover',
        suggestions: metric.suggestions,
        meta: { metricId: metric.id, level: metric.level },
      })
    },
    close: () => quickAssist.close(),
    destroy: () => quickAssist.destroy(),
  }
}
