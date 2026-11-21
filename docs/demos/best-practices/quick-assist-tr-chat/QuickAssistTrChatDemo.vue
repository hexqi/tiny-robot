<template>
  <div class="qa-trchat-demo">
    <header class="qa-trchat-demo__bar">
      <div class="qa-trchat-demo__title">
        <strong>云运维工作台 · QuickAssist × tr-chat</strong>
        <span class="qa-trchat-demo__badge">本地流式模拟</span>
      </div>
      <div class="qa-trchat-demo__actions">
        <button type="button" class="qa-trchat-demo__btn" @click="panelOpen = !panelOpen">
          {{ panelOpen ? '收起 AI 助手' : '展开 AI 助手' }}
        </button>
      </div>
    </header>

    <div class="qa-trchat-demo__body" :class="{ 'is-panel-open': panelOpen }">
      <section class="qa-trchat-demo__workspace" aria-label="业务工作台示例">
        <div class="qa-trchat-demo__metrics">
          <article v-for="metric in DEMO_METRICS" :key="metric.id" class="qa-trchat-demo__metric">
            <div class="qa-trchat-demo__metric-head">
              <span class="qa-trchat-demo__tag" :data-level="metric.level">{{ metric.status }}</span>
              <button type="button" class="qa-trchat-demo__ask" @click="onAskMetric($event, metric)">问 AI</button>
            </div>
            <h4>{{ metric.title }}</h4>
            <p class="qa-trchat-demo__metric-value">{{ metric.value }}</p>
            <p class="qa-trchat-demo__metric-desc">{{ metric.summary }}</p>
          </article>
        </div>

        <div class="qa-trchat-demo__docs" data-qa-docs-scope>
          <h4>运维规范正文（正向划词触发 QuickAssist）</h4>
          <p>
            计费模式决定了云服务器资源的付费方式：包年包月适合稳定运行的核心业务，按需计费适合弹性波动负载；竞价计费利用闲置算力降低成本，但实例可能因资源供需变化被回收。
          </p>
          <p>
            网络安全组用于控制入站与出站访问规则。生产环境应遵循最小权限原则，避免对公网直接开放数据库或运维管理端口。
          </p>
          <p class="qa-trchat-demo__guard" data-sensitive="true">
            敏感凭据区（不触发划词）：tenantId={{ DEMO_TENANT_ID }}，accessKey=sk-demo-9f3a8c
          </p>
          <p class="qa-trchat-demo__guard" data-ai-selection="false">
            受控只读区（通过 data-ai-selection="false" 排除划词）。
          </p>
        </div>

        <details v-if="latestContext" class="qa-trchat-demo__inspector">
          <summary>查看最近一次交给 tr-chat 的脱敏上下文与 Prompt</summary>
          <pre>{{
            JSON.stringify(
              { query: latestContext.query, prompt: latestContext.prompt, context: latestContext.context },
              null,
              2,
            )
          }}</pre>
        </details>
      </section>

      <aside v-show="panelOpen" class="qa-trchat-demo__chat-panel" aria-label="tr-chat 对话面板">
        <div ref="chatMountRef" class="qa-trchat-demo__chat-mount"></div>
      </aside>

      <div v-if="!panelOpen" class="qa-trchat-demo__placeholder">
        <p class="qa-trchat-demo__placeholder-title">tr-chat 对话面板已收起</p>
        <p class="qa-trchat-demo__placeholder-desc">
          在左侧正文划词提交，或点击指标卡片的「问 AI」，面板将自动展开并流式回复。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { ChatRuntimeHandle } from '@opentiny/tiny-robot-chat'
import type { TrChatHTMLElement } from '@opentiny/tiny-robot-chat/experimental'
import '@opentiny/tiny-robot/vanilla/style.css'
import '@opentiny/tiny-robot-chat/experimental/web-component.css'
import {
  DEMO_METRICS,
  DEMO_TENANT_ID,
  createQuickAssistTrChatBridge,
  type AssistContextSummary,
  type MetricItem,
} from './bridge'
import { createDemoChatRuntime } from './mock-runtime'

const chatMountRef = ref<HTMLElement | null>(null)
const panelOpen = ref(true)
const latestContext = ref<AssistContextSummary | null>(null)

let chatElement: TrChatHTMLElement | null = null
let ownedRuntime: ChatRuntimeHandle | undefined
let bridge: Awaited<ReturnType<typeof createQuickAssistTrChatBridge>> | undefined

function renderContextBar(summary: AssistContextSummary | null) {
  if (!chatElement) return
  chatElement.renderers = summary
    ? {
        'composer-before': (_scope, { signal }) => {
          const bar = document.createElement('div')
          bar.className = 'qa-trchat-demo__ctx-bar'
          const label = document.createElement('span')
          label.className = 'qa-trchat-demo__ctx-text'
          label.textContent = `引用：${summary.selectedText}（租户：${summary.sanitizedTenant}）`
          const clearBtn = document.createElement('button')
          clearBtn.type = 'button'
          clearBtn.className = 'qa-trchat-demo__ctx-clear'
          clearBtn.textContent = '清除'
          clearBtn.addEventListener('click', () => renderContextBar(null), { signal })
          bar.append(label, clearBtn)
          return bar
        },
      }
    : {}
}

function onAskMetric(event: MouseEvent, metric: MetricItem) {
  const target = event.currentTarget
  if (target instanceof Element) {
    bridge?.activateMetric(target, metric)
  }
}

onMounted(async () => {
  const { defineTrChatElements } = await import('@opentiny/tiny-robot-chat/experimental')
  defineTrChatElements()

  ownedRuntime = createDemoChatRuntime()
  const el = document.createElement('tr-chat') as TrChatHTMLElement
  el.runtime = ownedRuntime.runtime
  el.ui = {
    history: false,
    model: false,
    mcp: false,
    prompts: false,
    welcome: {
      title: 'TinyRobot 运维助手',
      description: '在左侧划词或点击指标卡的「问 AI」，我会结合脱敏上下文为你流式解答。',
    },
    layout: {
      leftAside: false,
      rightAside: false,
      surface: { mode: 'normal' },
      panelPadding: 0,
      panelGap: 0,
    },
    sender: {
      mode: 'multiple',
      placeholder: '也可以在这里继续多轮追问…',
    },
  }
  chatElement = el
  chatMountRef.value?.replaceChildren(el)

  bridge = await createQuickAssistTrChatBridge({
    scopeSelector: '[data-qa-docs-scope]',
    openPanel: async () => {
      panelOpen.value = true
      await nextTick()
    },
    getChatElement: () => chatElement,
    getRuntime: () => ownedRuntime?.runtime,
    onContextChange: (summary) => {
      latestContext.value = summary
      renderContextBar(summary)
    },
  })
})

onBeforeUnmount(() => {
  bridge?.destroy()
  chatElement?.remove()
  chatElement = null
  if (ownedRuntime) {
    void ownedRuntime.dispose().catch(console.error)
    ownedRuntime = undefined
  }
})
</script>

<style scoped>
.qa-trchat-demo {
  border: 1px solid var(--vp-c-divider, #dfe3e8);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-1, #213547);
}
.qa-trchat-demo__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--vp-c-divider, #dfe3e8);
  background: var(--vp-c-bg-soft, #f7f8fa);
}
.qa-trchat-demo__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
.qa-trchat-demo__badge {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft, #e8f2ff);
  color: var(--vp-c-brand-1, #1768ac);
  font-size: 11px;
}
.qa-trchat-demo__btn {
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider, #cbd3dd);
  border-radius: 6px;
  background: var(--vp-c-bg, #fff);
  color: inherit;
  font-size: 12px;
  cursor: pointer;
}
.qa-trchat-demo__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 380px);
  height: 540px;
}
.qa-trchat-demo__workspace {
  min-width: 0;
  overflow: auto;
  padding: 16px;
  border-right: 1px solid var(--vp-c-divider, #dfe3e8);
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.qa-trchat-demo__metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.qa-trchat-demo__metric {
  padding: 12px;
  border: 1px solid var(--vp-c-divider, #dfe3e8);
  border-radius: 10px;
  background: var(--vp-c-bg-soft, #fafbfc);
}
.qa-trchat-demo__metric-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}
.qa-trchat-demo__tag {
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}
.qa-trchat-demo__tag[data-level='alert'] {
  background: #ffece8;
  color: #cb2634;
}
.qa-trchat-demo__tag[data-level='warning'] {
  background: #fff7e8;
  color: #d25f00;
}
.qa-trchat-demo__ask {
  padding: 2px 8px;
  border: 1px solid var(--vp-c-brand-1, #3b64d9);
  border-radius: 999px;
  background: transparent;
  color: var(--vp-c-brand-1, #3b64d9);
  font-size: 12px;
  cursor: pointer;
}
.qa-trchat-demo__metric h4 {
  margin: 6px 0 2px;
  font-size: 13px;
}
.qa-trchat-demo__metric-value {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}
.qa-trchat-demo__metric-desc {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-2, #697586);
  line-height: 1.5;
}
.qa-trchat-demo__docs h4 {
  margin: 0 0 8px;
  font-size: 14px;
}
.qa-trchat-demo__docs p {
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.7;
}
.qa-trchat-demo__guard {
  padding: 7px 10px;
  border-radius: 6px;
  background: var(--vp-c-warning-soft, #fff4e5);
  color: var(--vp-c-warning-1, #744c12);
  font-size: 12px;
}
.qa-trchat-demo__inspector {
  font-size: 12px;
  border: 1px solid var(--vp-c-divider, #dfe3e8);
  border-radius: 8px;
  padding: 8px 10px;
}
.qa-trchat-demo__inspector pre {
  margin: 8px 0 0;
  max-height: 140px;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-size: 11px;
}
.qa-trchat-demo__chat-panel {
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}
.qa-trchat-demo__chat-mount,
.qa-trchat-demo__chat-mount :deep(tr-chat) {
  display: block;
  width: 100%;
  height: 100%;
  --tr-layout-height: 100%;
}
.qa-trchat-demo__placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  text-align: center;
  background: var(--vp-c-bg-soft, #fafbfc);
}
.qa-trchat-demo__placeholder-title {
  margin: 0 0 6px;
  font-weight: 600;
  font-size: 14px;
}
.qa-trchat-demo__placeholder-desc {
  margin: 0;
  max-width: 24ch;
  font-size: 12px;
  color: var(--vp-c-text-2, #697586);
}
:deep(.qa-trchat-demo__ctx-bar) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 10px;
  border-bottom: 1px solid var(--vp-c-divider, #e3e8f1);
  background: var(--vp-c-brand-soft, #f2f5ff);
  font-size: 12px;
}
:deep(.qa-trchat-demo__ctx-text) {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:deep(.qa-trchat-demo__ctx-clear) {
  flex: none;
  padding: 2px 6px;
  border: 1px solid var(--vp-c-divider, #cbd3dd);
  border-radius: 4px;
  background: var(--vp-c-bg, #fff);
  font-size: 11px;
  cursor: pointer;
}
@media (max-width: 820px) {
  .qa-trchat-demo__body {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) minmax(320px, 1fr);
    height: 780px;
  }
  .qa-trchat-demo__workspace {
    border-right: 0;
    border-bottom: 1px solid var(--vp-c-divider, #dfe3e8);
  }
  .qa-trchat-demo__metrics {
    grid-template-columns: 1fr;
  }
}
</style>
