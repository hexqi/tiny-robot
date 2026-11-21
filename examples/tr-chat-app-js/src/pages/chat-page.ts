import type { ChatRuntime, ChatUIOptions } from '@opentiny/tiny-robot-chat'
import type { TrChatHTMLElement } from '@opentiny/tiny-robot-chat/experimental'
import { bubbleRenderers } from '../chat/markdown'
import { createCopyBubbleRenderer } from '../chat/floating-assistant'

export function mountChatPage(container: HTMLElement, runtime: ChatRuntime, ui: ChatUIOptions): () => void {
  const main = document.createElement('main')
  main.className = 'app-chat'
  main.setAttribute('aria-label', '完整聊天')

  const chat = document.createElement('tr-chat') as TrChatHTMLElement
  chat.id = 'ai-chat'
  chat.runtime = runtime
  chat.ui = ui
  chat.renderers = { 'bubble-after': createCopyBubbleRenderer() }
  chat.bubbleRenderers = bubbleRenderers

  main.append(chat)
  container.append(main)

  return () => {
    main.remove()
  }
}
