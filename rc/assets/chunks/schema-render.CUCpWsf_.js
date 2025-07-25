import{d as c,af as l,p as d,aS as f,c as u,o as h,j as s,G as a,w as x,k as e}from"./framework.CMuRZ2Lf.js";import{J as n}from"./index.CnIVjx-R.js";import{r as _}from"./tiny-robot-svgs.B3FXR_29.js";import{_ as i}from"./schema-card.vue_vue_type_style_index_0_lang.qBNUUKSk.js";import"./utils.BWSJC3bO.js";import"./index3.DQc3A3fU.js";import"./plugin-vue_export-helper.lGy7RumW.js";import"./index.CY9KzR-4.js";import"./index.CZq_zg8X.js";import"./index.DXXn8Mck.js";import"./index.7onfQmvm.js";import"./index.BX7yNZp-.js";import"./loading-shadow.CqMQqflP.js";import"./help-circle.CxuXj0dx.js";import"./index.Dl8DvK9O.js";import"./index.CxVp2Com.js";import"./index.WWiFcsdT.js";import"./index.BKHpKYnH.js";const v={style:{display:"flex","flex-direction":"column",gap:"16px"}},H=c({__name:"schema-render",setup(g){const o=l(_,{style:{fontSize:"32px"}}),m=d(JSON.stringify({state:{},methods:{},componentName:"Page",props:{},children:[{componentName:"Text",props:{text:"运行时渲染器文本"}},{componentName:"Button",props:{text:"运行时渲染器按钮"}}]}));if(!customElements.get("schema-card")){const r=f(i);customElements.define("schema-card",r)}const p=`# h1 Heading
## Emphasis

**This is bold text**

*This is italic text*

_This is italic text_

<schema-card schema='${m.value}'></schema-card>
`;return(r,t)=>(h(),u("div",v,[t[0]||(t[0]=s("label",null,"使用插槽渲染运行时渲染",-1)),a(e(n),{avatar:e(o)},{default:x(()=>[a(i,{schema:m.value},null,8,["schema"])]),_:1},8,["avatar"]),t[1]||(t[1]=s("label",null,"使用markdown渲染运行时渲染（webcomponent）",-1)),a(e(n),{avatar:e(o),type:"markdown",content:p,mdConfig:{html:!0}},null,8,["avatar"])]))}});export{H as default};
