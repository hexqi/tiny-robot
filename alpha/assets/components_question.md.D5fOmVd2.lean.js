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
`,P=JSON.parse('{"title":"Question 快捷问题组件","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"components/question.md","filePath":"components/question.md"}'),_={name:"components/question.md"},T=Object.assign(_,{setup(C){const d=r(!0),o=c();return u(async()=>{o.value=(await p(async()=>{const{default:i}=await import("./chunks/Base.B4Ymj06a.js");return{default:i}},__vite__mapDeps([0,1,2,3,4,5]))).default}),(i,t)=>{const s=h("ClientOnly");return g(),m("div",null,[t[1]||(t[1]=a("",5)),b(e(n(q),null,null,512),[[f,d.value]]),e(s,null,{default:l(()=>[e(n(y),{title:"",description:"",locale:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,onMount:t[0]||(t[0]=()=>{d.value=!1}),vueCode:n(v)},x({_:2},[o.value?{name:"vue",fn:l(()=>[e(n(o))]),key:"0"}:void 0]),1032,["vueCode"])]),_:1}),t[2]||(t[2]=a("",13))])}}});export{P as __pageData,T as default};
