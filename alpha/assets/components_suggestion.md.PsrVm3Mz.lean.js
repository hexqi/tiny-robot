const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunks/All.DHMWXP2H.js","assets/chunks/index.06gwSWEK.js","assets/chunks/framework.CWAtEd7p.js","assets/chunks/index5.CS-vJHHo.js","assets/chunks/index3.Bl48rbqj.js","assets/chunks/close.ATUWfYMO.js","assets/chunks/index4.r2GOfR-2.js","assets/chunks/tiny-robot-svgs.8xjcy6Co.js","assets/chunks/plugin-vue_export-helper.lGy7RumW.js","assets/chunks/utils.D1YSndqS.js","assets/chunks/index.BaUkcA4P.js"])))=>i.map(i=>d[i]);
import{p as h,D as g,v as u,V as c,C as k,c as m,o as y,ag as i,ah as f,G as t,j as n,ai as v,k as s,w as d,aj as b,a as l}from"./chunks/framework.CWAtEd7p.js";import{O as x,E as F}from"./chunks/index.DcyQR8KF.js";const T=`<template>
  <div class="template-example">
    <!-- 集成 Suggestion 和 Sender 组件 -->
    <tr-suggestion
      v-model:open="suggestionOpen"
      :items="suggestionItems"
      :categories="categories"
      :loading="loading"
      title="快捷指令"
      @select="handleSuggestionSelect"
      @fill-template="handleFillTemplate"
    >
      <!-- 使用 trigger 插槽将 Sender 与 Suggestion 集成 -->
      <template #trigger="{ onTrigger, onKeyDown }">
        <div class="sender-container">
          <!-- 当前选中的指令名称显示 -->
          <div v-if="currentTemplateName" class="current-template-info">
            <span class="template-label">当前指令：</span>
            <span class="template-name">{{ currentTemplateName }}</span>
            <span class="template-clear" @click="clearTemplate">×</span>
          </div>

          <!-- Sender 组件 -->
          <tr-sender
            v-model="inputText"
            :template="currentTemplate"
            :placeholder="placeholder"
            :clearable="true"
            mode="multiple"
            :has-content="hasContent"
            @submit="handleSubmit"
            @keydown="(e) => handleKeyDown(e, onTrigger, onKeyDown)"
            @update:modelValue="updateInputValue"
            @reset-template="clearTemplate"
            ref="senderRef"
          />

          <!-- 提示信息 -->
          <div class="tip-text">输入 <span class="trigger-key">/</span> 可以打开指令菜单</div>
        </div>
      </template>
    </tr-suggestion>

    <!-- 消息记录区域 -->
    <div class="message-log" v-if="messages.length > 0">
      <h4>已发送消息</h4>
      <div v-for="(msg, index) in messages" :key="index" class="message-item">
        <div class="message-content">{{ msg }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrSender, TrSuggestion } from '@opentiny/tiny-robot'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { templateCategories, templateSuggestions } from './templateData'

// 状态管理
const inputText = ref('')
const currentTemplate = ref('')
const currentTemplateName = ref('')
const suggestionOpen = ref(false)
//  eslint-disable-next-line
const senderRef = ref<any>(null)
const loading = ref(false)
const placeholder = ref('输入 / 打开指令菜单...')
const messages = ref<string[]>([])

// 计算属性：判断是否有内容
const hasContent = computed(() => {
  // 当处于指令编辑模式且输入内容不为空时，视为有内容
  if (currentTemplate.value) {
    return inputText.value.trim().length > 0
  }
  return inputText.value.trim().length > 0
})

// 更新输入值
const updateInputValue = (value) => {
  inputText.value = value
}

// 指令列表
const suggestionItems = templateSuggestions
const categories = templateCategories

// 键盘事件处理
const handleKeyDown = (event, triggerFn, suggestionKeyDown) => {
  // 如果建议面板已打开，交给 suggestion 组件处理键盘事件
  if (suggestionOpen.value) {
    suggestionKeyDown(event)
    return
  }

  // 如果按下斜杠键并且不在指令编辑模式，触发建议面板
  if (event.key === '/' && !currentTemplate.value) {
    triggerFn({
      text: '',
      position: 0,
    })
  }

  // ESC 键清除当前指令
  if (event.key === 'Escape' && currentTemplate.value) {
    event.preventDefault()
    clearTemplate()
  }
}

// 处理指令选择
const handleSuggestionSelect = (text) => {
  currentTemplateName.value = text
  console.log('选择了指令:', text)
}

// 设置指令
const handleFillTemplate = (templateText) => {
  // 模拟加载效果
  loading.value = true
  setTimeout(() => {
    currentTemplate.value = templateText
    inputText.value = ''
    loading.value = false

    // 等待DOM更新后激活第一个字段
    setTimeout(() => {
      senderRef.value?.activateTemplateFirstField()
    }, 100)
  }, 300)
}

// 提交处理
const handleSubmit = (text: string) => {
  if (!text.trim()) return

  messages.value.push(text)
  inputText.value = ''

  // 如果是指令提交，清空指令状态
  if (currentTemplate.value) {
    clearTemplate()
  }
}

// 清除当前指令
const clearTemplate = () => {
  // 清空指令相关状态
  currentTemplate.value = ''
  currentTemplateName.value = ''
  inputText.value = ''

  // 确保重新聚焦到输入框
  nextTick(() => {
    senderRef.value?.focus()
  })
}

watch(
  () => inputText.value,
  (value) => {
    // 如果指令面板已打开，并且指令为空，关闭指令面板
    if (suggestionOpen.value && value === '') {
      suggestionOpen.value = false
    }
  },
)

// 页面加载完成后自动聚焦输入框
onMounted(() => {
  setTimeout(() => {
    senderRef.value?.focus()
  }, 500)
})
<\/script>

<style scoped>
.template-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.example-title {
  margin-bottom: 20px;
  color: #333;
  font-weight: 500;
  font-size: 20px;
}

.sender-container {
  position: relative;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 10px;
  background: #f9f9f9;
}

.current-template-info {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  margin-bottom: 10px;
  background: rgba(0, 120, 255, 0.1);
  border-radius: 4px;
  font-size: 14px;
}

.template-label {
  color: #666;
  margin-right: 6px;
}

.template-name {
  color: #0078ff;
  font-weight: 500;
}

.template-clear {
  margin-left: auto;
  cursor: pointer;
  color: #888;
  font-size: 16px;
  padding: 0 4px;
}

.template-clear:hover {
  color: #ff4d4f;
}

.tip-text {
  margin-top: 8px;
  color: #888;
  font-size: 12px;
  text-align: right;
}

.trigger-key {
  display: inline-block;
  padding: 0 4px;
  background: #e9e9e9;
  border-radius: 3px;
  color: #555;
  font-family: monospace;
}

.message-log {
  margin-top: 30px;
  padding: 15px;
  border-radius: 8px;
  background: #f0f0f0;
}

.message-log h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
  font-weight: 500;
}

.message-item {
  padding: 10px 15px;
  margin-bottom: 8px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.message-content {
  color: #333;
  font-size: 14px;
  line-height: 1.5;
}
</style>
`,D=JSON.parse('{"title":"Suggestion 快捷指令","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"components/suggestion.md","filePath":"components/suggestion.md"}'),E={name:"components/suggestion.md"},S=Object.assign(E,{setup(_){const r=h(!0),a=g();return u(async()=>{a.value=(await c(async()=>{const{default:p}=await import("./chunks/All.DHMWXP2H.js");return{default:p}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10]))).default}),(p,e)=>{const o=k("ClientOnly");return y(),m("div",null,[e[1]||(e[1]=i("",7)),f(t(s(x),null,null,512),[[v,r.value]]),t(o,null,{default:d(()=>[t(s(F),{title:"整合案例",description:"Sender 组件整合 Suggestion 组件的案例",locale:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,onMount:e[0]||(e[0]=()=>{r.value=!1}),vueCode:s(T)},b({_:2},[a.value?{name:"vue",fn:d(()=>[t(s(a))]),key:"0"}:void 0]),1032,["vueCode"])]),_:1}),e[2]||(e[2]=i("",6)),e[3]||(e[3]=n("table",{tabindex:"0"},[n("thead",null,[n("tr",null,[n("th",null,"插槽名"),n("th",null,"参数"),n("th",null,"说明")])]),n("tbody",null,[n("tr",null,[n("td",null,"trigger"),n("td",null,[l("{ onTrigger: "),n("code",null,"TriggerHandler"),l(", onKeyDown: (e: "),n("code",null,"KeyboardEvent"),l(") => void }")]),n("td",null,"触发器插槽")]),n("tr",null,[n("td",null,"item"),n("td",{"item:":"",SuggestionItem:""}),n("td",null,"建议项自定义渲染")]),n("tr",null,[n("td",null,"empty"),n("td",null,"-"),n("td",null,"无匹配结果时显示的内容")])])],-1)),e[4]||(e[4]=i("",2))])}}});export{D as __pageData,S as default};
