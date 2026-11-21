import { useEffect, useRef, useState } from 'react'
import type { ChatRuntime, ChatUIOptions } from '@opentiny/tiny-robot-chat'
import { FloatingAssistant, type FloatingAssistantHandle } from '../chat/floating-assistant'
import {
  WORKSPACE_METRICS,
  WORKSPACE_TENANT_ID,
  createQuickAssistChatBridge,
  type QuickAssistChatBridge,
  type QuickAssistContextSummary,
  type WorkspaceMetric,
} from '../chat/quick-assist-bridge'

export function WorkspacePage({ runtime, ui }: { runtime: ChatRuntime; ui: ChatUIOptions }) {
  const assistantRef = useRef<FloatingAssistantHandle>(null)
  const bridgeRef = useRef<QuickAssistChatBridge | null>(null)
  const runtimeRef = useRef(runtime)
  runtimeRef.current = runtime
  const [assistContext, setAssistContext] = useState<QuickAssistContextSummary | null>(null)

  useEffect(() => {
    const bridge = createQuickAssistChatBridge({
      openChatPanel: () => assistantRef.current?.open(),
      getChatElement: () => assistantRef.current?.getChatElement() ?? null,
      getRuntime: () => runtimeRef.current,
      onContextChange: (summary) => setAssistContext(summary),
    })
    bridgeRef.current = bridge
    return () => {
      bridge.destroy()
      bridgeRef.current = null
    }
  }, [])

  const handleAskMetric = (anchor: HTMLButtonElement, metric: WorkspaceMetric) => {
    bridgeRef.current?.activateMetric(anchor, metric)
  }

  return (
    <>
      <main className="workspace">
        <p className="eyebrow">团队空间 / 云运维与产品研发</p>
        <h1>项目工作台</h1>
        <p className="workspace-description">
          集中查看运行指标与运维规范：选中下方业务正文可触发 QuickAssist 划词提问，或点击指标卡片的「问
          AI」主动激活，提交后自动打开右下角 tr-chat 悬浮助手。
        </p>

        <section className="workspace-section" aria-label="关键运行指标">
          <div className="workspace-section-head">
            <h2>运行指标与主动诊断</h2>
            <span className="workspace-hint">点击「问 AI」通过 activate() 直接打开输入浮层</span>
          </div>
          <div className="metric-grid">
            {WORKSPACE_METRICS.map((metric) => (
              <article key={metric.id} className="metric-card" data-level={metric.level}>
                <div className="metric-card-top">
                  <span className="project-status" data-level={metric.level}>
                    {metric.status}
                  </span>
                  <button
                    type="button"
                    className="metric-ask-btn"
                    aria-label={`询问 ${metric.title}`}
                    onClick={(event) => handleAskMetric(event.currentTarget, metric)}
                  >
                    问 AI
                  </button>
                </div>
                <h3>{metric.title}</h3>
                <p className="metric-value">{metric.value}</p>
                <p className="metric-summary">{metric.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="workspace-section" data-qa-scope aria-label="可划词业务正文">
          <div className="workspace-section-head">
            <h2>云服务与项目文档（支持划词即问）</h2>
            <span className="workspace-hint">正向划选下方正文，自动采集上下文并脱敏租户编号</span>
          </div>
          <div className="project-grid">
            <article>
              <span className="project-status">计费策略</span>
              <h2>云服务器计费与弹性选型</h2>
              <p>
                包年包月适合长期稳定运行的核心业务，按需计费适合波动负载；竞价计费利用闲置算力降低成本，但实例可能因供需变化被回收，适合无状态离线任务。
              </p>
              <small>基础设施团队 · 成本治理规范</small>
            </article>
            <article>
              <span className="project-status">安全基线</span>
              <h2>网络安全组最小权限原则</h2>
              <p>
                网络安全组用于控制云服务器的入站和出站访问规则。生产环境应遵循最小权限原则，禁止对公网直接放通数据库与运维管理端口，仅开放业务必需来源网段。
              </p>
              <small>安全研发团队 · 上线前必查</small>
            </article>
            <article>
              <span className="project-status">知识库</span>
              <h2>客户反馈整理与版本发布准备</h2>
              <p>
                汇总本周客户反馈与知识库接入指南，在灰度发布前核对回滚预案、监控告警演练与交付清单，确保研发、测试与运维协同一致。
              </p>
              <small>产品与研发团队 · 本周五</small>
            </article>
          </div>

          <div className="workspace-guards">
            <p data-sensitive="true">
              敏感凭据区（不触发划词）：tenantId={WORKSPACE_TENANT_ID}，accessKey=sk-demo-9f3a8c
            </p>
            <p data-ai-selection="false">受控说明区（通过 data-ai-selection=&quot;false&quot; 排除划词触发）。</p>
          </div>
        </section>
      </main>
      <FloatingAssistant
        runtime={runtime}
        ui={ui}
        assistantRef={assistantRef}
        assistContext={assistContext}
        onClearAssistContext={() => setAssistContext(null)}
      />
    </>
  )
}
