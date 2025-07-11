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
`,D=JSON.parse('{"title":"Suggestion 快捷指令","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"components/suggestion.md","filePath":"components/suggestion.md"}'),E={name:"components/suggestion.md"},S=Object.assign(E,{setup(_){const r=h(!0),a=g();return u(async()=>{a.value=(await c(async()=>{const{default:p}=await import("./chunks/All.DHMWXP2H.js");return{default:p}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10]))).default}),(p,e)=>{const o=k("ClientOnly");return y(),m("div",null,[e[1]||(e[1]=i('<h1 id="suggestion-快捷指令" tabindex="-1">Suggestion 快捷指令 <a class="header-anchor" href="#suggestion-快捷指令" aria-label="Permalink to &quot;Suggestion 快捷指令&quot;">​</a></h1><div class="caution custom-block github-alert"><p class="custom-block-title">CAUTION</p><p>本组件准备弃用，请使用 <a href="./suggestion-popover.html">SuggestionPopover 建议弹出框</a>和 <a href="./suggestion-pills.html">SuggestionPills 建议按钮组</a> 组件</p></div><p>快捷指令组件是一个用于显示快捷指令/提示的复合组件，支持胶囊式快捷指令和弹窗的快捷指令两种形式。</p><h2 id="代码示例" tabindex="-1">代码示例 <a class="header-anchor" href="#代码示例" aria-label="Permalink to &quot;代码示例&quot;">​</a></h2><ul><li>支持胶囊式快捷指令，点击直接完成输入</li><li>支持下拉式快捷指令，可通过触发字符（默认为 <code>/</code>）激活</li><li>支持分类展示快捷指令</li><li>支持键盘导航和选择</li></ul><h2 id="使用示例" tabindex="-1">使用示例 <a class="header-anchor" href="#使用示例" aria-label="Permalink to &quot;使用示例&quot;">​</a></h2><h3 id="整合案例" tabindex="-1">整合案例 <a class="header-anchor" href="#整合案例" aria-label="Permalink to &quot;整合案例&quot;">​</a></h3>',7)),f(t(s(x),null,null,512),[[v,r.value]]),t(o,null,{default:d(()=>[t(s(F),{title:"整合案例",description:"Sender 组件整合 Suggestion 组件的案例",locale:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,onMount:e[0]||(e[0]=()=>{r.value=!1}),vueCode:s(T)},b({_:2},[a.value?{name:"vue",fn:d(()=>[t(s(a))]),key:"0"}:void 0]),1032,["vueCode"])]),_:1}),e[2]||(e[2]=i('<h2 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-label="Permalink to &quot;API&quot;">​</a></h2><h3 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to &quot;Props&quot;">​</a></h3><table tabindex="0"><thead><tr><th>属性名</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td>items</td><td>SuggestionItem[]</td><td>[]</td><td>胶囊式快捷指令项列表</td></tr><tr><td>categories</td><td>Category[]</td><td>[]</td><td>分类列表（用于指令弹窗）</td></tr><tr><td>triggerKeys</td><td>string[]</td><td>[&#39;/&#39;]</td><td>触发快捷指令的快捷键</td></tr><tr><td>open</td><td>boolean</td><td>undefined</td><td>是否展开快捷指令弹窗</td></tr><tr><td>loading</td><td>boolean</td><td>false</td><td>是否显示加载状态</td></tr><tr><td>title</td><td>string</td><td>&#39;快捷指令&#39;</td><td>下拉面板标题</td></tr><tr><td>maxVisibleItems</td><td>number</td><td>5</td><td>最大显示条目数</td></tr><tr><td>closeOnClickOutside</td><td>boolean</td><td>-</td><td>是否点击外部关闭</td></tr></tbody></table><h3 id="events" tabindex="-1">Events <a class="header-anchor" href="#events" aria-label="Permalink to &quot;Events&quot;">​</a></h3><table tabindex="0"><thead><tr><th>事件名</th><th>参数</th><th>说明</th></tr></thead><tbody><tr><td>select</td><td>value: string, triggerInfo?: TriggerPosition</td><td>选择快捷指令项时触发</td></tr><tr><td>open-change</td><td>value: boolean</td><td>指令弹窗打开状态变化时触发</td></tr><tr><td>category-select</td><td>category: Category</td><td>选择分类时触发</td></tr><tr><td>close</td><td>-</td><td>关闭指令弹窗时触发</td></tr></tbody></table><h3 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to &quot;Slots&quot;">​</a></h3>',6)),e[3]||(e[3]=n("table",{tabindex:"0"},[n("thead",null,[n("tr",null,[n("th",null,"插槽名"),n("th",null,"参数"),n("th",null,"说明")])]),n("tbody",null,[n("tr",null,[n("td",null,"trigger"),n("td",null,[l("{ onTrigger: "),n("code",null,"TriggerHandler"),l(", onKeyDown: (e: "),n("code",null,"KeyboardEvent"),l(") => void }")]),n("td",null,"触发器插槽")]),n("tr",null,[n("td",null,"item"),n("td",{"item:":"",SuggestionItem:""}),n("td",null,"建议项自定义渲染")]),n("tr",null,[n("td",null,"empty"),n("td",null,"-"),n("td",null,"无匹配结果时显示的内容")])])],-1)),e[4]||(e[4]=i(`<h3 id="types" tabindex="-1">Types <a class="header-anchor" href="#types" aria-label="Permalink to &quot;Types&quot;">​</a></h3><div class="language-typescript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 快捷指令项</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">interface</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SuggestionItem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  id</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  text</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  value</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  icon</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> VNode</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  keywords</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[]</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  description</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 分类</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">interface</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Category</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  id</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  label</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  icon</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> VNode</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  items</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SuggestionItem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 触发位置信息</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">interface</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> TriggerPosition</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  text</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  position</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> number</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div>`,2))])}}});export{D as __pageData,S as default};
