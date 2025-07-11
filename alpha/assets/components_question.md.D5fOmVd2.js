const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunks/Base.B4Ymj06a.js","assets/chunks/index.BZsjX-Br.js","assets/chunks/framework.CWAtEd7p.js","assets/chunks/tiny-robot-svgs.8xjcy6Co.js","assets/chunks/close.ATUWfYMO.js","assets/chunks/index3.Bl48rbqj.js"])))=>i.map(i=>d[i]);
import{p as r,D as c,v as u,V as p,C as h,c as m,o as g,ag as a,ah as b,G as e,ai as f,k as n,w as l,aj as x}from"./chunks/framework.CWAtEd7p.js";import{O as q,E as y}from"./chunks/index.DcyQR8KF.js";const v=`<template>
  <div style="display: flex; flex-direction: column; height: 200px; padding-top: 80px; background-color: #fafafa">
    <tr-question
      ref="questionRef"
      :categories="questionConfig.categories"
      :commonQuestions="questionConfig.commonQuestions"
      :initialExpanded="questionConfig.initialExpanded"
      :theme="questionConfig.theme"
      :modalWidth="questionConfig.modalWidth"
      :loading="loading"
      @question-click="handleQuestionClick"
      @select-category="handleCategorySelect"
    >
      <!-- 自定义问题项渲染 -->
      <template #question-item="{ question, index }">
        <div class="custom-question">
          <span class="question-number">{{ index + 1 }}. </span>
          <span class="question-text">{{ question.text }}</span>
        </div>
      </template>

      <!-- 数据加载时的加载动画 -->
      <template #loading-indicator>
        <div class="custom-loading">
          <div class="loading-spinner"></div>
          <div>正在加载问题数据...</div>
        </div>
      </template>

      <!-- 数据为空时的占位提示 -->
      <template #empty-state>
        <div class="custom-empty-state">
          <img src="https://via.placeholder.com/48" alt="Empty" />
          <p>暂无相关问题，请尝试其他分类</p>
        </div>
      </template>
    </tr-question>

    <!-- 操作按钮 -->
    <div class="action-btns">
      <button @click="questionRef.openModal()">打开热门问题弹窗</button>
      <button @click="questionRef.closeModal()">关闭热门问题弹窗</button>
      <button @click="questionRef.toggleFloating()">切换悬浮胶囊状态</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrQuestion } from '@opentiny/tiny-robot'
import { reactive, ref } from 'vue'

// 引用组件实例
const questionRef = ref(null)

// 控制加载状态
const loading = ref(false)

// 问题配置
const questionConfig = reactive<QuestionProps>({
  categories: [
    {
      id: 'basic',
      label: '基础问题',
      icon: 'icon-basic',
      questions: [
        { id: 'b1', text: '什么是弹性云服务器?' },
        { id: 'b2', text: '如何登录到Windows云服务器?' },
        { id: 'b3', text: '弹性公网IP为什么ping不通?' },
        { id: 'b4', text: '云服务器安全组如何配置?' },
        { id: 'b5', text: '如何查看云服务器密码?' },
      ],
    },
    {
      id: 'purchase',
      label: '购买咨询',
      icon: 'icon-purchase',
      questions: [
        { id: 'p1', text: '如何购买弹性云服务器?' },
        { id: 'p2', text: '无法登录弹性云服务器怎么办?' },
        { id: 'p3', text: '云服务器价格怎么计算?' },
        { id: 'p4', text: '如何查看账单详情?' },
        { id: 'p5', text: '如何续费云服务器?' },
      ],
    },
    {
      id: 'usage',
      label: '使用咨询',
      icon: 'icon-usage',
      questions: [
        { id: 'u1', text: '云服务器使用限制与须知' },
        { id: 'u2', text: '使用RDP文件连接Windows实例' },
        { id: 'u3', text: '多用户登录（Windows2016）' },
        { id: 'u4', text: '如何重置云服务器密码?' },
        { id: 'u5', text: '云服务器如何安装软件?' },
      ],
    },
  ],
  commonQuestions: [
    { id: 'f1', text: 'ECS - 如何注册账号?' },
    { id: 'f2', text: '购买云服务器的付款方式有哪些?' },
    { id: 'f3', text: '更换操作系统需要多久?' },
    { id: 'f4', text: '云服务器可以安装自定义镜像吗?' },
    { id: 'f5', text: '如何连接Linux云服务器?' },
  ],
  initialExpanded: false,
  theme: 'light',
  modalWidth: '640px',
})

const handleQuestionClick = (question) => {
  console.log('点击了问题:', question)
}

const handleCategorySelect = (category) => {
  console.log('选择了分类:', category)
}
<\/script>

<style scoped>
.action-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 10px;
}

.action-btns button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

.action-btns button:hover {
  background-color: #f0f0f0;
}

.custom-category {
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-question {
  display: flex;
  align-items: center;
}

.question-number {
  color: #666;
  margin-right: 4px;
}

.question-text {
  font-weight: 500;
}

.custom-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.custom-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #999;
}
</style>
`,P=JSON.parse('{"title":"Question 快捷问题组件","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"components/question.md","filePath":"components/question.md"}'),_={name:"components/question.md"},T=Object.assign(_,{setup(C){const d=r(!0),o=c();return u(async()=>{o.value=(await p(async()=>{const{default:i}=await import("./chunks/Base.B4Ymj06a.js");return{default:i}},__vite__mapDeps([0,1,2,3,4,5]))).default}),(i,t)=>{const s=h("ClientOnly");return g(),m("div",null,[t[1]||(t[1]=a('<h1 id="question-快捷问题组件" tabindex="-1">Question 快捷问题组件 <a class="header-anchor" href="#question-快捷问题组件" aria-label="Permalink to &quot;Question 快捷问题组件&quot;">​</a></h1><div class="caution custom-block github-alert"><p class="custom-block-title">CAUTION</p><p>本组件准备弃用，请使用 <a href="./suggestion-popover.html">SuggestionPopover 建议弹出框</a>和 <a href="./suggestion-pills.html">SuggestionPills 建议按钮组</a> 组件</p></div><p>Question 是一个用于展示问题列表的通用组件，包含两个主要部分：热门问题弹窗和一般问题悬浮胶囊。</p><p>组件支持分类展示、问题列表的部分/全部显示切换以及暗色主题适配。</p><h3 id="代码示例" tabindex="-1">代码示例 <a class="header-anchor" href="#代码示例" aria-label="Permalink to &quot;代码示例&quot;">​</a></h3>',5)),b(e(n(q),null,null,512),[[f,d.value]]),e(s,null,{default:l(()=>[e(n(y),{title:"",description:"",locale:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,onMount:t[0]||(t[0]=()=>{d.value=!1}),vueCode:n(v)},x({_:2},[o.value?{name:"vue",fn:l(()=>[e(n(o))]),key:"0"}:void 0]),1032,["vueCode"])]),_:1}),t[2]||(t[2]=a('<h3 id="组件功能" tabindex="-1">组件功能 <a class="header-anchor" href="#组件功能" aria-label="Permalink to &quot;组件功能&quot;">​</a></h3><ol><li><p><strong>热门问题弹窗</strong>：</p><ul><li>通过左侧固定按钮触发显示</li><li>支持问题分类标签切换</li><li>展示当前分类下的问题列表</li></ul></li><li><p><strong>一般问题悬浮胶囊</strong>：</p><ul><li>固定在右下角，可展开/收起</li><li>展开后显示一般问题列表</li><li>支持问题列表的部分/全部显示切换</li></ul></li><li><p><strong>主题适配</strong>：</p><ul><li>支持亮色/暗色主题切换</li><li>所有样式变量都通过 CSS 变量定义，方便定制</li></ul></li></ol><h3 id="组件属性-props" tabindex="-1">组件属性 (Props) <a class="header-anchor" href="#组件属性-props" aria-label="Permalink to &quot;组件属性 (Props)&quot;">​</a></h3><table tabindex="0"><thead><tr><th>属性名</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td>categories</td><td><code>Array&lt;Category&gt;</code></td><td>默认示例数据</td><td>分类数据（包含标签和问题列表）</td></tr><tr><td>commonQuestions</td><td><code>Array&lt;Question&gt;</code></td><td>默认示例数据</td><td>悬浮胶囊的一般问题列表</td></tr><tr><td>initialExpanded</td><td><code>Boolean</code></td><td><code>false</code></td><td>悬浮胶囊初始是否展开</td></tr><tr><td>modalWidth</td><td><code>String</code></td><td><code>&quot;60vw&quot;</code></td><td>弹窗宽度</td></tr><tr><td>theme</td><td><code>&quot;light&quot;｜&quot;dark&quot;</code></td><td><code>&quot;light&quot;</code></td><td>主题配色</td></tr><tr><td>closeOnClickOutside</td><td><code>Boolean</code></td><td><code>true</code></td><td>点击弹窗外部是否关闭</td></tr><tr><td>loading</td><td><code>Boolean</code></td><td><code>false</code></td><td>数据加载状态</td></tr></tbody></table><h3 id="组件事件-events" tabindex="-1">组件事件 (Events) <a class="header-anchor" href="#组件事件-events" aria-label="Permalink to &quot;组件事件 (Events)&quot;">​</a></h3><table tabindex="0"><thead><tr><th>事件名</th><th>参数</th><th>说明</th></tr></thead><tbody><tr><td>question-click</td><td><code>(question: Question)</code></td><td>点击问题项时触发</td></tr><tr><td>select-category</td><td><code>(category: Category)</code></td><td>分类切换时触发</td></tr></tbody></table><h3 id="插槽-slots" tabindex="-1">插槽 (Slots) <a class="header-anchor" href="#插槽-slots" aria-label="Permalink to &quot;插槽 (Slots)&quot;">​</a></h3><table tabindex="0"><thead><tr><th>插槽名</th><th>作用域参数</th><th>说明</th></tr></thead><tbody><tr><td>category-label</td><td><code>{ category: Category }</code></td><td>自定义分类标签内容</td></tr><tr><td>question-item</td><td><code>{ question: Question }</code></td><td>自定义问题项渲染</td></tr><tr><td>loading-indicator</td><td>-</td><td>数据加载时的加载动画</td></tr><tr><td>empty-state</td><td>-</td><td>数据为空时的占位提示</td></tr></tbody></table><h3 id="实例方法" tabindex="-1">实例方法 <a class="header-anchor" href="#实例方法" aria-label="Permalink to &quot;实例方法&quot;">​</a></h3><table tabindex="0"><thead><tr><th>方法名</th><th>参数</th><th>说明</th></tr></thead><tbody><tr><td>openModal</td><td>-</td><td>打开热门问题弹窗</td></tr><tr><td>closeModal</td><td>-</td><td>关闭热门问题弹窗</td></tr><tr><td>toggleFloating</td><td>-</td><td>切换悬浮胶囊的展开/收起状态</td></tr><tr><td>setActiveCategory</td><td><code>(categoryId: string)</code></td><td>设置当前激活的分类</td></tr><tr><td>refreshData</td><td>-</td><td>刷新数据</td></tr></tbody></table><h3 id="css-变量" tabindex="-1">CSS 变量 <a class="header-anchor" href="#css-变量" aria-label="Permalink to &quot;CSS 变量&quot;">​</a></h3><p>所有样式变量都以 <code>--tr</code> 开头，主要包括：</p><ul><li><code>--tr-question-primary-color</code>: 主色调</li><li><code>--tr-question-background-color</code>: 背景色</li><li><code>--tr-question-text-color</code>: 文本颜色</li><li><code>--tr-question-border-color</code>: 边框颜色</li><li><code>--tr-question-hover-color</code>: 悬停效果颜色</li></ul>',13))])}}});export{P as __pageData,T as default};
