import { createChatRuntime, type ChatRuntimeHandle } from '@opentiny/tiny-robot-chat'
import { localStorageStrategyFactory } from '@opentiny/tiny-robot-kit'
import type { ChatAppConfig } from './config'
import { createLocalDemoResponseProvider } from './local-demo-provider'

export type RuntimeMode = 'live' | 'demo'

export interface AppRuntimeHandle extends ChatRuntimeHandle {
  readonly mode: RuntimeMode
}

export function createAppRuntime(config: ChatAppConfig): AppRuntimeHandle {
  const storage = localStorageStrategyFactory({ key: 'tiny-robot-ai-conversations' })
  if (config.modelProviders.length > 0) {
    const owned = createChatRuntime({
      modelProviders: config.modelProviders,
      mcpServers: config.mcpServers,
      conversation: { storage },
    })
    return { ...owned, mode: 'live' }
  }

  const owned = createChatRuntime({
    conversation: {
      storage,
      useMessageOptions: {
        responseProvider: createLocalDemoResponseProvider(),
      },
    },
  })
  return { ...owned, mode: 'demo' }
}
