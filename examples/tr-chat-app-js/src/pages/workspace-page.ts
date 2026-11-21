import type { ChatRuntime, ChatUIOptions } from '@opentiny/tiny-robot-chat'
import { mountFloatingAssistant } from '../chat/floating-assistant'
import { WORKSPACE_METRICS, WORKSPACE_TENANT_ID, createQuickAssistChatBridge } from '../chat/quick-assist-bridge'

export function mountWorkspacePage(container: HTMLElement, runtime: ChatRuntime, ui: ChatUIOptions): () => void {
  const pageHost = document.createElement('div')
  pageHost.className = 'page-host'

  const main = document.createElement('main')
  main.className = 'workspace'
  main.innerHTML = `
    <p class="eyebrow">团队空间 / 云运维与产品研发</p>
    <h1>项目工作台</h1>
    <p class="workspace-description">
      集中查看运行指标与运维规范：选中下方业务正文可触发 QuickAssist 划词提问，或点击指标卡片的「问 AI」主动激活，提交后自动打开右下角 tr-chat 悬浮助手。
    </p>
    <section class="workspace-section" aria-label="关键运行指标">
      <div class="workspace-section-head">
        <h2>运行指标与主动诊断</h2>
        <span class="workspace-hint">点击「问 AI」通过 activate() 直接打开输入浮层</span>
      </div>
      <div class="metric-grid"></div>
    </section>
    <section class="workspace-section" data-qa-scope aria-label="可划词业务正文">
      <div class="workspace-section-head">
        <h2>云服务与项目文档（支持划词即问）</h2>
        <span class="workspace-hint">正向划选下方正文，自动采集上下文并脱敏租户编号</span>
      </div>
      <div class="project-grid">
        <article>
          <span class="project-status">计费策略</span>
          <h2>云服务器计费与弹性选型</h2>
          <p>包年包月适合长期稳定运行的核心业务，按需计费适合波动负载；竞价计费利用闲置算力降低成本，但实例可能因供需变化被回收，适合无状态离线任务。</p>
          <small>基础设施团队 · 成本治理规范</small>
        </article>
        <article>
          <span class="project-status">安全基线</span>
          <h2>网络安全组最小权限原则</h2>
          <p>网络安全组用于控制云服务器的入站和出站访问规则。生产环境应遵循最小权限原则，禁止对公网直接放通数据库与运维管理端口，仅开放业务必需来源网段。</p>
          <small>安全研发团队 · 上线前必查</small>
        </article>
        <article>
          <span class="project-status">知识库</span>
          <h2>客户反馈整理与版本发布准备</h2>
          <p>汇总本周客户反馈与知识库接入指南，在灰度发布前核对回滚预案、监控告警演练与交付清单，确保研发、测试与运维协同一致。</p>
          <small>产品与研发团队 · 本周五</small>
        </article>
      </div>
      <div class="workspace-guards">
        <p data-sensitive="true">敏感凭据区（不触发划词）：tenantId=${WORKSPACE_TENANT_ID}，accessKey=sk-demo-9f3a8c</p>
        <p data-ai-selection="false">受控说明区（通过 data-ai-selection="false" 排除划词触发）。</p>
      </div>
    </section>
  `

  pageHost.append(main)
  container.append(pageHost)

  const assistant = mountFloatingAssistant(pageHost, runtime, ui)
  const bridge = createQuickAssistChatBridge({
    openChatPanel: () => assistant.open(),
    getChatElement: () => assistant.getChatElement(),
    getRuntime: () => runtime,
    onContextChange: (summary) => assistant.setAssistContext(summary),
  })

  const metricGrid = main.querySelector<HTMLElement>('.metric-grid')!
  for (const metric of WORKSPACE_METRICS) {
    const card = document.createElement('article')
    card.className = 'metric-card'
    card.dataset.level = metric.level

    const top = document.createElement('div')
    top.className = 'metric-card-top'
    const status = document.createElement('span')
    status.className = 'project-status'
    status.dataset.level = metric.level
    status.textContent = metric.status

    const askBtn = document.createElement('button')
    askBtn.type = 'button'
    askBtn.className = 'metric-ask-btn'
    askBtn.setAttribute('aria-label', `询问 ${metric.title}`)
    askBtn.textContent = '问 AI'
    askBtn.addEventListener('click', () => bridge.activateMetric(askBtn, metric))
    top.append(status, askBtn)

    const heading = document.createElement('h3')
    heading.textContent = metric.title
    const value = document.createElement('p')
    value.className = 'metric-value'
    value.textContent = metric.value
    const summary = document.createElement('p')
    summary.className = 'metric-summary'
    summary.textContent = metric.summary

    card.append(top, heading, value, summary)
    metricGrid.append(card)
  }

  return () => {
    bridge.destroy()
    assistant.destroy()
    pageHost.remove()
  }
}
