import './floating-assistant.css'
import type { ChatHeaderSlotProps, ChatRuntime, ChatUIOptions, LayoutFloatingState } from '@opentiny/tiny-robot-chat'
import type { ChatRenderers, TrChatHTMLElement } from '@opentiny/tiny-robot-chat/experimental'
import { bubbleRenderers } from './markdown'
import { copyReply, replyText } from './reply-actions'
import type { QuickAssistContextSummary } from './quick-assist-bridge'

export interface FloatingAssistantController {
  open: () => Promise<void>
  getChatElement: () => TrChatHTMLElement
  setAssistContext: (summary: QuickAssistContextSummary | null) => void
  destroy: () => void
}

function createCopyActionNode(text: string, signal: AbortSignal): HTMLElement {
  const wrapper = document.createElement('div')
  wrapper.className = 'reply-actions'
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'reply-copy'
  button.setAttribute('aria-label', '复制回复')
  button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="3" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></svg><span class="copy-label" aria-live="polite">复制</span>`
  button.addEventListener('click', () => void copyReply(text, button), { signal })
  wrapper.append(button)
  return wrapper
}

export function createCopyBubbleRenderer(): ChatRenderers['bubble-after'] {
  return (scope, { signal }) => {
    const text = replyText(scope)
    return text ? createCopyActionNode(text, signal) : null
  }
}

export function mountFloatingAssistant(
  container: HTMLElement,
  runtime: ChatRuntime,
  ui: ChatUIOptions,
): FloatingAssistantController {
  let isOpen = false
  let isFullscreen = false
  let isHistoryOpen = false
  let query = ''
  let editingId: string | undefined
  let editTitle = ''
  let historyError = ''
  let headerScope: ChatHeaderSlotProps | undefined
  let savedState: LayoutFloatingState | undefined
  let historyFrame: number | undefined
  let lastHistorySignature = ''
  let viewport = { width: innerWidth, height: innerHeight }
  let floatingState: LayoutFloatingState = {
    placement: 'center',
    offsetX: 24,
    offsetY: 24,
    width: Math.min(640, innerWidth - 32),
    height: Math.min(760, innerHeight - 32),
  }

  const hostSection = document.createElement('section')
  hostSection.className = 'floating-assistant-host'
  hostSection.hidden = true
  hostSection.setAttribute('aria-label', 'AI 助手')

  const chat = document.createElement('tr-chat') as TrChatHTMLElement
  chat.id = 'floating-chat'
  hostSection.append(chat)

  const launcher = document.createElement('button')
  launcher.type = 'button'
  launcher.className = 'assistant-launcher'
  launcher.setAttribute('aria-label', '打开 AI 助手')
  launcher.setAttribute('aria-controls', 'floating-chat')
  launcher.setAttribute('aria-expanded', 'false')
  launcher.innerHTML = '<img src="/assistant.svg" alt="" />'

  container.append(hostSection, launcher)

  let assistContext: QuickAssistContextSummary | null = null
  let historyEl: HTMLElement | null = null
  let historyListEl: HTMLUListElement | null = null
  let historyEmptyEl: HTMLParagraphElement | null = null
  let historyErrorEl: HTMLParagraphElement | null = null

  function createContextBarNode(summary: QuickAssistContextSummary, signal: AbortSignal): HTMLElement {
    const bar = document.createElement('div')
    bar.className = 'assistant-context-bar'
    bar.setAttribute('role', 'status')

    const meta = document.createElement('div')
    meta.className = 'assistant-context-meta'
    const tag = document.createElement('span')
    tag.className = 'assistant-context-tag'
    tag.textContent = 'QuickAssist 引用'
    const textSpan = document.createElement('span')
    textSpan.className = 'assistant-context-text'
    textSpan.textContent = summary.selectedText
    textSpan.title = summary.selectedText
    const tenantSpan = document.createElement('span')
    tenantSpan.className = 'assistant-context-tenant'
    tenantSpan.textContent = `租户：${summary.sanitizedTenant}`
    meta.append(tag, textSpan, tenantSpan)

    const clearBtn = document.createElement('button')
    clearBtn.type = 'button'
    clearBtn.className = 'assistant-context-clear'
    clearBtn.setAttribute('aria-label', '清除引用上下文')
    clearBtn.textContent = '清除'
    clearBtn.addEventListener('click', () => setAssistContext(null), { signal })

    bar.append(meta, clearBtn)
    return bar
  }

  function setAssistContext(summary: QuickAssistContextSummary | null) {
    assistContext = summary
    syncChat()
  }

  function placeHistory() {
    if (historyFrame !== undefined) cancelAnimationFrame(historyFrame)
    historyFrame = requestAnimationFrame(() => {
      if (!historyEl || !historyEl.isConnected) return
      const header = document.querySelector<HTMLElement>('.assistant-window-header')
      const surface = header?.closest<HTMLElement>('.tr-layout--floating')
      if (!header || !surface) return
      const rect = header.getBoundingClientRect()
      const bottom = Math.min(innerHeight, surface.getBoundingClientRect().bottom)
      const width = Math.min(320, rect.width - 24)
      historyEl.style.left = `${rect.right - width - 12}px`
      historyEl.style.top = `${rect.bottom + 8}px`
      historyEl.style.width = `${width}px`
      historyEl.style.maxHeight = `${Math.max(0, Math.min(560, bottom - rect.bottom - 24))}px`
      historyEl.style.zIndex = String((Number.parseInt(getComputedStyle(surface).zIndex) || 1000) + 1)
    })
  }

  async function runHistoryAction(action: () => Promise<void> | void, done?: () => void) {
    historyError = ''
    try {
      await action()
      done?.()
    } catch {
      historyError = '会话操作失败，请重试。'
    }
    renderHistoryItems(true)
  }

  function renderHistoryItems(force = false) {
    if (!historyEl || !historyListEl || !historyEmptyEl || !historyErrorEl || !headerScope) return
    const items = (headerScope.conversation.items ?? []).filter((item) =>
      (item.title || '未命名会话').includes(query.trim()),
    )
    const signature = JSON.stringify({
      activeId: headerScope.conversation.activeId,
      editingId,
      historyError,
      query,
      items: items.map((item) => [item.id, item.title || '']),
    })
    if (!force && signature === lastHistorySignature) return
    lastHistorySignature = signature

    historyErrorEl.hidden = !historyError
    historyErrorEl.textContent = historyError
    historyListEl.replaceChildren()

    for (const item of items) {
      const li = document.createElement('li')
      li.dataset.active = String(headerScope.conversation.activeId === item.id)

      if (editingId === item.id) {
        const form = document.createElement('form')
        const input = document.createElement('input')
        input.setAttribute('aria-label', '会话标题')
        input.value = editTitle
        const saveBtn = document.createElement('button')
        saveBtn.type = 'submit'
        saveBtn.textContent = '保存标题'
        saveBtn.disabled = !editTitle.trim()
        const cancelBtn = document.createElement('button')
        cancelBtn.type = 'button'
        cancelBtn.textContent = '取消'

        input.addEventListener('input', () => {
          editTitle = input.value
          saveBtn.disabled = !editTitle.trim()
        })
        input.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
            event.stopPropagation()
            editingId = undefined
            renderHistoryItems(true)
          }
        })
        cancelBtn.addEventListener('click', () => {
          editingId = undefined
          renderHistoryItems(true)
        })
        form.addEventListener('submit', (event) => {
          event.preventDefault()
          if (!editTitle.trim()) return
          void runHistoryAction(
            () => runtime.actions.renameConversation(item.id, editTitle.trim()),
            () => {
              editingId = undefined
            },
          )
        })
        form.append(input, saveBtn, cancelBtn)
        li.append(form)
        requestAnimationFrame(() => input.focus())
      } else {
        const titleBtn = document.createElement('button')
        titleBtn.type = 'button'
        titleBtn.className = 'assistant-history-title'
        titleBtn.textContent = item.title || '未命名会话'
        titleBtn.addEventListener('click', () => {
          void runHistoryAction(() => runtime.actions.switchConversation(item.id), closeHistory)
        })

        const actions = document.createElement('div')
        actions.className = 'assistant-history-item-actions'
        const renameBtn = document.createElement('button')
        renameBtn.type = 'button'
        renameBtn.textContent = '重命名'
        renameBtn.addEventListener('click', () => {
          editingId = item.id
          editTitle = item.title || ''
          renderHistoryItems(true)
        })
        const deleteBtn = document.createElement('button')
        deleteBtn.type = 'button'
        deleteBtn.textContent = '删除'
        deleteBtn.addEventListener('click', () => {
          void runHistoryAction(() => runtime.actions.deleteConversation(item.id))
        })
        actions.append(renameBtn, deleteBtn)
        li.append(titleBtn, actions)
      }
      historyListEl.append(li)
    }

    historyEmptyEl.hidden = items.length > 0
    historyEmptyEl.textContent = query.trim() ? '未找到匹配的会话' : '暂无历史会话'
  }

  function removeHistoryDialog() {
    historyEl?.remove()
    historyEl = null
    historyListEl = null
    historyEmptyEl = null
    historyErrorEl = null
    lastHistorySignature = ''
  }

  function openHistoryDialog() {
    if (!headerScope || historyEl) return
    const section = document.createElement('section')
    section.id = 'assistant-history'
    section.className = 'assistant-history'
    section.setAttribute('role', 'dialog')
    section.setAttribute('aria-label', '历史会话')

    const head = document.createElement('div')
    head.className = 'assistant-history-head'
    const heading = document.createElement('h2')
    heading.textContent = '历史会话'
    const closeBtn = document.createElement('button')
    closeBtn.type = 'button'
    closeBtn.className = 'assistant-icon-button'
    closeBtn.setAttribute('aria-label', '关闭历史会话')
    closeBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>'
    closeBtn.addEventListener('click', closeHistory)
    head.append(heading, closeBtn)

    const search = document.createElement('input')
    search.type = 'search'
    search.setAttribute('aria-label', '搜索历史会话')
    search.placeholder = '搜索会话'
    search.value = query
    search.addEventListener('input', () => {
      query = search.value
      renderHistoryItems(true)
    })

    const errorEl = document.createElement('p')
    errorEl.setAttribute('role', 'alert')
    errorEl.hidden = true

    const list = document.createElement('ul')
    const empty = document.createElement('p')
    empty.className = 'assistant-history-empty'
    empty.hidden = true

    section.append(head, search, errorEl, list, empty)
    document.body.append(section)

    historyEl = section
    historyListEl = list
    historyEmptyEl = empty
    historyErrorEl = errorEl

    renderHistoryItems(true)
    placeHistory()
    requestAnimationFrame(() => search.focus())
  }

  function closeHistory() {
    isHistoryOpen = false
    removeHistoryDialog()
    syncHeaderAttrs()
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('.assistant-history-trigger')?.focus())
  }

  function toggleHistory() {
    if (isHistoryOpen) {
      closeHistory()
    } else {
      isHistoryOpen = true
      query = ''
      editingId = undefined
      historyError = ''
      openHistoryDialog()
      syncHeaderAttrs()
    }
  }

  function closePanel() {
    isHistoryOpen = false
    removeHistoryDialog()
    isOpen = false
    syncChat()
    requestAnimationFrame(() => launcher.focus())
  }

  function toggleMode() {
    if (!isFullscreen) {
      savedState = { ...floatingState }
      floatingState = { placement: 'top-left', offsetX: 0, offsetY: 0, width: innerWidth, height: innerHeight }
    } else if (savedState) {
      floatingState = {
        ...savedState,
        width: Math.min(savedState.width ?? 640, innerWidth - 32),
        height: Math.min(savedState.height ?? 760, innerHeight - 32),
      }
    }
    isFullscreen = !isFullscreen
    syncChat()
    placeHistory()
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('.assistant-mode-toggle')?.focus())
  }

  function syncHeaderAttrs() {
    const trigger = document.querySelector<HTMLButtonElement>('.assistant-history-trigger')
    if (trigger) trigger.setAttribute('aria-expanded', String(isHistoryOpen))
  }

  function buildRenderers(): ChatRenderers {
    return {
      'layout-header': (scope, { signal }) => {
        headerScope = scope
        if (isHistoryOpen) {
          if (!historyEl) openHistoryDialog()
          else renderHistoryItems(false)
          placeHistory()
        }

        const header = document.createElement('header')
        header.className = 'assistant-window-header'
        header.dataset.fullscreen = String(isFullscreen)

        const title = document.createElement('strong')
        title.textContent = 'TinyRobot'

        const actions = document.createElement('div')
        actions.className = 'assistant-window-actions'

        const newBtn = document.createElement('button')
        newBtn.type = 'button'
        newBtn.className = 'assistant-icon-button'
        newBtn.setAttribute('aria-label', '新建会话')
        newBtn.title = '新建会话'
        newBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>'
        newBtn.addEventListener(
          'click',
          () => {
            scope.createConversation()
            if (isHistoryOpen) closeHistory()
          },
          { signal },
        )

        const historyBtn = document.createElement('button')
        historyBtn.type = 'button'
        historyBtn.className = 'assistant-icon-button assistant-history-trigger'
        historyBtn.setAttribute('aria-label', '历史会话')
        historyBtn.title = '历史会话'
        historyBtn.setAttribute('aria-expanded', String(isHistoryOpen))
        historyBtn.setAttribute('aria-controls', 'assistant-history')
        historyBtn.innerHTML =
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11a8 8 0 1 1 2 6M4 5v6h6M12 8v5l3 2" /></svg>'
        historyBtn.addEventListener('click', toggleHistory, { signal })

        const modeBtn = document.createElement('button')
        modeBtn.type = 'button'
        modeBtn.className = 'assistant-icon-button assistant-mode-toggle'
        const modeLabel = isFullscreen ? '切换为悬浮窗口' : '切换为全屏模式'
        modeBtn.setAttribute('aria-label', modeLabel)
        modeBtn.title = modeLabel
        modeBtn.innerHTML = isFullscreen
          ? '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M11 11h9v9h-9z" /></svg>'
          : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5" /></svg>'
        modeBtn.addEventListener('click', toggleMode, { signal })

        const closeBtn = document.createElement('button')
        closeBtn.type = 'button'
        closeBtn.className = 'assistant-icon-button'
        closeBtn.setAttribute('aria-label', '关闭 AI 助手')
        closeBtn.title = '关闭'
        closeBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>'
        closeBtn.addEventListener('click', closePanel, { signal })

        actions.append(newBtn, historyBtn, modeBtn, closeBtn)
        header.append(title, actions)
        return header
      },
      ...(assistContext
        ? {
            'composer-before': (_scope, { signal }) =>
              assistContext ? createContextBarNode(assistContext, signal) : null,
          }
        : {}),
      'bubble-after': createCopyBubbleRenderer(),
    }
  }

  function buildChatUI(): ChatUIOptions {
    return {
      ...ui,
      history: false,
      welcome: {
        ...ui.welcome,
        title: 'TinyRobot',
        description: '你好，我是你的 AI 助手，随时为你解答问题。',
      },
      prompts: { ...ui.prompts, wrap: true },
      layout: {
        ...ui.layout,
        leftAside: false,
        rightAside: { mode: 'drawer', width: 400 },
        emptyState: 'center',
        composer: { welcome: 'footer' },
        panelPadding: 0,
        panelGap: 0,
        surface: {
          mode: isOpen ? 'floating' : 'normal',
          floatingOptions: {
            draggable: !isFullscreen,
            resizable: !isFullscreen,
            minWidth: isFullscreen ? undefined : Math.min(360, viewport.width - 32),
            minHeight: isFullscreen ? undefined : Math.min(480, viewport.height - 32),
          },
        },
      },
    }
  }

  function syncChat() {
    hostSection.hidden = !isOpen
    launcher.hidden = isOpen
    launcher.setAttribute('aria-expanded', String(isOpen))
    chat.runtime = runtime
    chat.ui = buildChatUI()
    chat.renderers = buildRenderers()
    chat.bubbleRenderers = bubbleRenderers
    chat.floatingState = floatingState
  }

  const onFloatingStateUpdate = (event: CustomEvent<[LayoutFloatingState]>) => {
    floatingState = event.detail[0]
    chat.floatingState = floatingState
    placeHistory()
  }
  const onResize = () => {
    viewport = { width: innerWidth, height: innerHeight }
    if (isFullscreen) {
      floatingState = { placement: 'top-left', offsetX: 0, offsetY: 0, width: innerWidth, height: innerHeight }
    }
    syncChat()
    placeHistory()
  }
  const onKeydown = (event: KeyboardEvent) => {
    if (!isOpen || event.key !== 'Escape') return
    if (isHistoryOpen) closeHistory()
    else if (isFullscreen) toggleMode()
  }
  const onPointerdown = (event: PointerEvent) => {
    if (
      isHistoryOpen &&
      event.target instanceof Element &&
      !event.target.closest('.assistant-window-header, .assistant-history')
    ) {
      isHistoryOpen = false
      removeHistoryDialog()
      syncHeaderAttrs()
    }
  }
  const onLauncherClick = () => {
    isOpen = true
    syncChat()
  }

  chat.addEventListener('floating-state-update', onFloatingStateUpdate)
  launcher.addEventListener('click', onLauncherClick)
  window.addEventListener('resize', onResize)
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('pointerdown', onPointerdown)
  syncChat()

  return {
    open: () =>
      new Promise<void>((resolve) => {
        if (!isOpen) {
          isOpen = true
          syncChat()
        }
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      }),
    getChatElement: () => chat,
    setAssistContext,
    destroy() {
      if (historyFrame !== undefined) cancelAnimationFrame(historyFrame)
      removeHistoryDialog()
      chat.removeEventListener('floating-state-update', onFloatingStateUpdate)
      launcher.removeEventListener('click', onLauncherClick)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKeydown)
      window.removeEventListener('pointerdown', onPointerdown)
      hostSection.remove()
      launcher.remove()
    },
  }
}
