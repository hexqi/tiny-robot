import { useLayoutEffect, useState } from 'react'
import type { ChatRuntime } from '@opentiny/tiny-robot-chat'
import { createChatConfig } from './chat/config'
import { createAppRuntime, type RuntimeMode } from './chat/runtime'
import { ChatPage } from './pages/chat-page'
import { WorkspacePage } from './pages/workspace-page'

export function App() {
  const workspace = location.pathname.replace(/\/+$/, '') === '/workspace'
  const [configResult] = useState(() => {
    try {
      return { config: createChatConfig(import.meta.env, location.origin), error: '' }
    } catch {
      return { config: undefined, error: '模型配置无法加载，请检查 .env 中的服务地址与模型 ID。' }
    }
  })
  const [runtime, setRuntime] = useState<ChatRuntime>()
  const [runtimeMode, setRuntimeMode] = useState<RuntimeMode>('live')
  const [error, setError] = useState(configResult.error)
  const [dark, setDark] = useState(() => localStorage.getItem('tiny-robot-color-mode') === 'dark')
  const config = configResult.config
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-tr-color-mode', dark ? 'dark' : 'light')
    localStorage.setItem('tiny-robot-color-mode', dark ? 'dark' : 'light')
  }, [dark])
  useLayoutEffect(() => {
    if (!config) return
    try {
      const owned = createAppRuntime(config)
      setRuntime(owned.runtime)
      setRuntimeMode(owned.mode)
      return () => {
        void owned.dispose().catch(console.error)
      }
    } catch {
      setError('模型配置无法加载，请检查 .env 中的服务地址与模型 ID。')
    }
  }, [config])
  return (
    <div className="app-shell">
      <header className="app-bar">
        <div className="app-brand">
          <strong>TinyRobot AI</strong>
          {runtime && runtimeMode === 'demo' && (
            <span className="app-mode-badge" title="未配置 .env 模型密钥，当前使用本地流式演示回复">
              本地演示模式
            </span>
          )}
        </div>
        <nav aria-label="应用页面">
          <a href="/chat" aria-current={!workspace ? 'page' : undefined}>
            完整聊天
          </a>
          <a href="/workspace" aria-current={workspace ? 'page' : undefined}>
            工作台
          </a>
          <button type="button" aria-label="切换主题" onClick={() => setDark(!dark)}>
            {dark ? '浅色模式' : '深色模式'}
          </button>
        </nav>
      </header>
      {runtime && config && !error ? (
        workspace ? (
          <WorkspacePage runtime={runtime} ui={config.ui} />
        ) : (
          <ChatPage runtime={runtime} ui={config.ui} />
        )
      ) : (
        <main className="setup">
          <h1>{error ? '模型配置无法加载' : '正在初始化对话服务'}</h1>
          <p>{error || '正在准备 TinyRobot Chat Runtime…'}</p>
        </main>
      )}
    </div>
  )
}
