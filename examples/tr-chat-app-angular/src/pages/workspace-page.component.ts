import {
  afterNextRender,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  NgZone,
  signal,
  ViewChild,
} from '@angular/core'
import type { ChatRuntime, ChatUIOptions } from '@opentiny/tiny-robot-chat'
import { FloatingAssistantComponent } from '../chat/floating-assistant.component'
import {
  WORKSPACE_METRICS,
  WORKSPACE_TENANT_ID,
  createQuickAssistChatBridge,
  type QuickAssistChatBridge,
  type QuickAssistContextSummary,
  type WorkspaceMetric,
} from '../chat/quick-assist-bridge'

@Component({
  selector: 'app-workspace-page',
  standalone: true,
  imports: [FloatingAssistantComponent],
  templateUrl: './workspace-page.component.html',
  host: { class: 'page-host' },
})
export class WorkspacePageComponent {
  @Input({ required: true }) runtime!: ChatRuntime
  @Input({ required: true }) ui!: ChatUIOptions
  @ViewChild(FloatingAssistantComponent, { static: true }) assistant!: FloatingAssistantComponent

  readonly metrics = WORKSPACE_METRICS
  readonly tenantId = WORKSPACE_TENANT_ID
  readonly assistContext = signal<QuickAssistContextSummary | null>(null)
  private bridge?: QuickAssistChatBridge

  constructor() {
    const destroy = inject(DestroyRef)
    const zone = inject(NgZone)
    const detector = inject(ChangeDetectorRef)

    afterNextRender(() => {
      this.bridge = createQuickAssistChatBridge({
        openChatPanel: () => this.assistant.openPanel(),
        getChatElement: () => this.assistant.getChatElement(),
        getRuntime: () => this.runtime,
        onContextChange: (summary) => {
          zone.run(() => {
            this.assistContext.set(summary)
            detector.detectChanges()
          })
        },
      })
    })

    destroy.onDestroy(() => {
      this.bridge?.destroy()
      this.bridge = undefined
    })
  }

  askMetric(event: Event, metric: WorkspaceMetric) {
    const target = event.currentTarget
    if (target instanceof Element) {
      this.bridge?.activateMetric(target, metric)
    }
  }

  clearContext() {
    this.assistContext.set(null)
  }
}
