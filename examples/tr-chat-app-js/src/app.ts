import { createChatConfig } from './chat/config'
import { createAppRuntime, type AppRuntimeHandle } from './chat/runtime'
import { mountChatPage } from './pages/chat-page'
import { mountWorkspacePage } from './pages/workspace-page'

export function mountApp(root: HTMLElement): () => void {
  const workspace = location.pathname.replace(/\/+$/, '') === '/workspace'
  let dark = localStorage.getItem('tiny-robot-color-mode') === 'dark'
  const applyTheme = () => {
    document.documentElement.setAttribute('data-tr-color-mode', dark ? 'dark' : 'light')
    localStorage.setItem('tiny-robot-color-mode', dark ? 'dark' : 'light')
  }
  applyTheme()

  let owned: AppRuntimeHandle | undefined
  let uiOptions
  let error = ''
  try {
    const config = createChatConfig(import.meta.env, location.origin)
    owned = createAppRuntime(config)
    uiOptions = config.ui
  } catch {
    error = '模型配置无法加载，请检查 .env 中的服务地址与模型 ID。'
  }

  const shell = document.createElement('div')
  shell.className = 'app-shell'

  const header = document.createElement('header')
  header.className = 'app-bar'

  const brand = document.createElement('div')
  brand.className = 'app-brand'
  const logo = document.createElement('strong')
  logo.textContent = 'TinyRobot AI'
  brand.append(logo)
  if (owned && owned.mode === 'demo') {
    const badge = document.createElement('span')
    badge.className = 'app-mode-badge'
    badge.title = '未配置 .env 模型密钥，当前使用本地流式演示回复'
    badge.textContent = '本地演示模式'
    brand.append(badge)
  }

  const nav = document.createElement('nav')
  nav.setAttribute('aria-label', '应用页面')

  const chatLink = document.createElement('a')
  chatLink.href = '/chat'
  chatLink.textContent = '完整聊天'
  if (!workspace) chatLink.setAttribute('aria-current', 'page')

  const workspaceLink = document.createElement('a')
  workspaceLink.href = '/workspace'
  workspaceLink.textContent = '工作台'
  if (workspace) workspaceLink.setAttribute('aria-current', 'page')

  const themeBtn = document.createElement('button')
  themeBtn.type = 'button'
  themeBtn.setAttribute('aria-label', '切换主题')
  themeBtn.textContent = dark ? '浅色模式' : '深色模式'
  themeBtn.addEventListener('click', () => {
    dark = !dark
    applyTheme()
    themeBtn.textContent = dark ? '浅色模式' : '深色模式'
  })

  nav.append(chatLink, workspaceLink, themeBtn)
  header.append(brand, nav)
  shell.append(header)
  root.replaceChildren(shell)

  let unmountPage: (() => void) | undefined
  if (owned && uiOptions && !error) {
    unmountPage = workspace
      ? mountWorkspacePage(shell, owned.runtime, uiOptions)
      : mountChatPage(shell, owned.runtime, uiOptions)
  } else {
    const setup = document.createElement('main')
    setup.className = 'setup'
    const h1 = document.createElement('h1')
    h1.textContent = error ? '模型配置无法加载' : '正在初始化对话服务'
    const p = document.createElement('p')
    p.textContent = error || '正在准备 TinyRobot Chat Runtime…'
    setup.append(h1, p)
    shell.append(setup)
  }

  return () => {
    unmountPage?.()
    shell.remove()
    if (owned) void owned.dispose().catch(console.error)
  }
}
