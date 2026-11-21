import { defineTrChatElements } from '@opentiny/tiny-robot-chat/experimental'
import '@opentiny/tiny-robot-chat/experimental/web-component.css'
import '@opentiny/tiny-robot/vanilla/style.css'
import './style.css'
import { mountApp } from './app'

defineTrChatElements()
const dispose = mountApp(document.getElementById('app')!)

window.addEventListener('pagehide', (event) => {
  if (!event.persisted) dispose()
})
