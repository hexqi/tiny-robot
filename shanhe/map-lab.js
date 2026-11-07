import { geography } from './assets/geography.js';
import { modernAdmin } from './assets/modern-admin.js';
import { ancientRegions, adminBoundaries, states } from './atlas-data.js';
import { allPlaces, allEvents, eventLabel } from './history-world.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const point = ([lon,lat]) => [(lon-108.5)*70,(35.8-lat)*80];
const path = (points, closed=false) => points.map((p,i)=>(i?'L':'M')+point(p).map(v=>v.toFixed(2)).join(',')).join(' ')+(closed?'Z':'');
const presets = {
  heartland: {title:'中原与荆州',bounds:[106,27,121,37.8]},
  southwest: {title:'巴蜀与汉中',bounds:[100.5,26,111.5,35.8]},
  han: {title:'州郡全貌',bounds:[90,17,130,44]},
  national: {title:'全国山河',bounds:[72,16,136,55]},
};
const priority = new Set(['changan','luoyang','chengdu','jiangling','xiangyang','xuchang','ye','ji','panyu','wujun','jianye','nanzheng','linxiang','guzang','dunhuang','xiangping','shouchun','hefei','pengcheng']);
const cityName = p => p.id==='jianye'?'建业':p.name;
const state = {mode:'reference',modern:false,terrain:true,cities:true,controls:false,view:'heartland',selected:null};
let reference, camera={x:0,y:0,w:1600}, drag=null, dragged=false, frame=0;
const svg=$('#lab-map'), stage=$('#map-stage');

function terrain(bounds, file, id) {
  const [west,south,east,north]=bounds, [x,y]=point([west,north]), [right,bottom]=point([east,south]);
  return `<image id="${id}" href="./assets/${file}" x="${x}" y="${y}" width="${right-x}" height="${bottom-y}" preserveAspectRatio="none"/>`;
}

function buildMap() {
  const land=geography.land.map(p=>`<path d="${path(p,true)}"/>`).join('');
  const provinces=modernAdmin.provinces.map(p=>`<path d="${p.rings.map(r=>path(r,true)).join(' ')}"/>`).join('');
  const lines=reference.lines.map(l=>`<path data-source-path="${l.id}" class="${l.kind}" d="${path(l.points)}"/>`).join('');
  svg.innerHTML=`<title>边界底稿对照：建安参考线稿与早期示意</title><desc>源图名义年份219，部分州界采用220年后安排；不是当前故事年份的准确边界。城池为现有索引约位。参考线稿没有闭合郡域。</desc>
    <defs><clipPath id="lab-country">${provinces}</clipPath></defs>
    <rect x="-10000" y="-10000" width="20000" height="20000" fill="#d2dfe0"/>
    <g fill="#e9e7d4" stroke="#a6b29d" stroke-width=".5">${land}</g>
    <g id="terrain-layer" clip-path="url(#lab-country)">${terrain([68,16,142,56],'terrain-china.webp','national-terrain')}${terrain([106,25,124,38],'terrain-chibi.webp','regional-terrain')}</g>
    <g fill="#bfd4d5" stroke="#8cabac" stroke-width=".4">${geography.lakes.map(l=>`<path d="${l.rings.map(r=>path(r,true)).join(' ')}"/>`).join('')}</g>
    <g class="river-lines">${geography.rivers.filter(r=>r.rank<5).map(r=>`<path d="${path(r.points)}"/>`).join('')}</g>
    <g id="reference-lines" class="reference-lines">${lines}</g>
    <g id="schematic-lines" class="schematic-lines">${adminBoundaries.map(l=>`<path class="${l.kind}" d="${path(l.points)}"/>`).join('')}</g>
    <g id="modern-lines" class="modern-lines">${provinces}</g>
    <g id="reference-labels">${reference.labels.map((l,i)=>`<text data-reference-label="${i}" class="${l.kind==='province'?'province-label':'region-label'}" transform="translate(${point(l.coord)})" text-anchor="middle">${escape(l.name)}</text>`).join('')}</g>
    <g id="schematic-labels">${[...states.map(s=>({...s,kind:'province'})),...ancientRegions.map(s=>({...s,kind:'commandery'}))].map((l,i)=>`<text data-schematic-label="${i}" class="${l.kind==='province'?'province-label':'region-label'} schematic-label" transform="translate(${point(l.center)})" text-anchor="middle">${escape(l.name)}</text>`).join('')}</g>
    <g id="city-layer">${allPlaces.map(p=>`<g class="city" data-place="${p.id}" transform="translate(${point(p.coord)})" role="button" tabindex="0" aria-label="查看${escape(cityName(p))}"><circle class="selection-ring"/><circle class="hit"/><circle class="dot"/><text>${escape(cityName(p))}</text></g>`).join('')}</g>
    <g id="control-layer">${reference.registration.points.filter(p=>p.role==='check').map(p=>{const a=point(p.estimated),b=point(p.reference);return `<g data-check="${p.id}"><path class="control-link" d="M${a}L${b}"/><circle class="control-estimate" cx="${a[0]}" cy="${a[1]}"/><circle class="control-actual" cx="${b[0]}" cy="${b[1]}"/><text class="control-label" x="${b[0]}" y="${b[1]}">${escape(p.name)} · ${p.differenceKm.toFixed(1)} km</text></g>`}).join('')}</g>`;
  $$('.city').forEach(el=>{
    el.addEventListener('click',()=>{if(!dragged)selectPlace(el.dataset.place)});
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectPlace(el.dataset.place)}});
  });
}

function viewSize() {return {w:camera.w,h:camera.w*stage.clientHeight/stage.clientWidth};}
function fitView() {
  const [west,south,east,north]=presets[state.view].bounds,a=point([west,north]),b=point([east,south]);
  camera={x:(a[0]+b[0])/2,y:(a[1]+b[1])/2,w:Math.max(b[0]-a[0],(b[1]-a[1])*stage.clientWidth/stage.clientHeight)*1.12};
  updateCamera();
}
function updateCamera() {
  const {w,h}=viewSize();
  svg.setAttribute('viewBox',`${camera.x-w/2} ${camera.y-h/2} ${w} ${h}`);
  cancelAnimationFrame(frame);frame=requestAnimationFrame(layoutLabels);
}
function zoom(factor, cx=stage.clientWidth/2, cy=stage.clientHeight/2) {
  const before=viewSize(),rx=cx/stage.clientWidth-.5,ry=cy/stage.clientHeight-.5;
  const x=camera.x+rx*before.w,y=camera.y+ry*before.h;
  camera.w=Math.max(280,Math.min(7800,camera.w*factor));
  const after=viewSize();camera.x=x-rx*after.w;camera.y=y-ry*after.h;updateCamera();
}

function layoutLabels() {
  const {w,h}=viewSize(),unit=w/stage.clientWidth;
  const screen=coord=>{const [x,y]=point(coord);return [(x-camera.x)/unit+stage.clientWidth/2,(y-camera.y)/unit+stage.clientHeight/2]};
  const boxes=[];
  const stageRect=stage.getBoundingClientRect();
  const obstacles=$$('.map-heading, .region-presets, .map-tools, .map-legend').map(el=>{
    const r=el.getBoundingClientRect();return [r.left-stageRect.left-8,r.top-stageRect.top-8,r.right-stageRect.left+8,r.bottom-stageRect.top+8];
  });
  function reserve(coord,name,font=12,offset=0,force=false) {
    const [x,y]=screen(coord),b=[x+offset-name.length*font/2,y-font,x+offset+name.length*font/2,y+4];
    const outside=b[0]<8||b[2]>stage.clientWidth-8||b[1]<8||b[3]>stage.clientHeight-8;
    const blocked=obstacles.some(a=>b[0]<a[2]&&b[2]>a[0]&&b[1]<a[3]&&b[3]>a[1]);
    if(outside||(!force&&(blocked||boxes.some(a=>b[0]<a[2]+5&&b[2]>a[0]-5&&b[1]<a[3]+5&&b[3]>a[1]-5))))return false;
    boxes.push(b);return true;
  }
  const cities=[...allPlaces].sort((a,b)=>(b.id===state.selected?100:priority.has(b.id)?1:0)-(a.id===state.selected?100:priority.has(a.id)?1:0));
  for(const p of cities){
    const el=svg.querySelector(`[data-place="${p.id}"]`),eligible=w<2400||priority.has(p.id)||p.id===state.selected;
    const visible=state.cities&&eligible&&reserve(p.coord,cityName(p),11,cityName(p).length*5.5+8,p.id===state.selected);
    el.style.display=visible?'':'none';el.setAttribute('aria-pressed',String(p.id===state.selected));
    el.classList.toggle('selected',p.id===state.selected);
    el.querySelector('.dot').setAttribute('r',3*unit);el.querySelector('.dot').style.strokeWidth=1.2*unit;
    el.querySelector('.hit').setAttribute('r',13*unit);el.querySelector('.selection-ring').setAttribute('r',11*unit);
    el.querySelector('.selection-ring').style.strokeWidth=unit;
    const text=el.querySelector('text');text.setAttribute('x',8*unit);text.setAttribute('y',3.6*unit);text.style.fontSize=11*unit+'px';text.style.strokeWidth=2.6*unit;
  }
  const items=state.mode==='schematic'?[...states.map(s=>({...s,coord:s.center,kind:'province'})),...ancientRegions.map(s=>({...s,coord:s.center,kind:'commandery'}))]:reference.labels;
  for(let i=0;i<items.length;i++){
    const l=items[i],el=svg.querySelector(`[data-${state.mode==='schematic'?'schematic':'reference'}-label="${i}"]`);
    const large=l.kind==='province',font=large?18:12,eligible=large?w>700:w<2500;
    el.style.display=eligible&&reserve(l.coord,l.name,font)?'':'none';el.style.fontSize=font*unit+'px';el.style.strokeWidth=(large?2.2:1.8)*unit;el.style.letterSpacing=(large?4:1)*unit+'px';
  }
  $$('.control-estimate').forEach(el=>{el.setAttribute('r',6*unit);el.style.strokeWidth=1.6*unit});
  $$('.control-actual').forEach(el=>{el.setAttribute('r',3*unit);el.style.strokeWidth=unit});
  $$('.control-label').forEach(el=>{el.style.fontSize=11*unit+'px';el.style.strokeWidth=3*unit;el.setAttribute('dy',-12*unit)});
  $('#regional-terrain').style.display=w<2400?'':'none';
}

function render() {
  const visible=(id,value)=>$('#'+id).style.display=value?'':'none';
  visible('reference-lines',state.mode!=='schematic');visible('reference-labels',state.mode!=='schematic');
  visible('schematic-lines',state.mode!=='reference');visible('schematic-labels',state.mode==='schematic');
  visible('modern-lines',state.modern);visible('terrain-layer',state.terrain);visible('city-layer',state.cities);visible('control-layer',state.controls);
  $$('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===state.mode)));
  $$('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===state.view)));
  for(const key of ['modern','terrain','cities'])$('#'+key).setAttribute('aria-pressed',String(state[key]));
  $('#control-toggle').setAttribute('aria-pressed',String(state.controls));
  $('.epoch').textContent=state.mode==='schematic'?'东汉示意框架':'219 年参考';
  $('#view-title').textContent=presets[state.view].title;
  $('#view-note').textContent=state.mode==='difference'?'褐色：候选曲线 · 蓝色虚线：早期示意':state.mode==='schematic'?'当前各章节共用的概略州郡框架':'曲折边界 × 地形 × 城池约位';
  $('#legend').innerHTML=(state.mode!=='schematic'?'<span><i class="province"></i>参考州界</span><span><i></i>参考郡界</span><span><i class="imperial"></i>外缘参考</span>':'')+(state.mode!=='reference'?'<span><i class="schematic"></i>早期示意</span>':'')+(state.modern?'<span><i class="modern"></i>现代省界 · 2019</span>':'');
  $('#status').textContent=state.mode==='schematic'?'早期示意框架 · 13 州部 / 52 重点郡国':state.mode==='difference'?'不同年代与来源的对照，不表示历史变化或误差范围':'219 年参考 · 部分州界为 220 年后安排 · 郡域范围待校订';
  layoutLabels();
}

function selectPlace(id) {
  const p=allPlaces.find(p=>p.id===id);if(!p)return;
  state.selected=id;$('#place-name').textContent=cityName(p);$('#place-modern').textContent=p.modern;
  $('#place-context').textContent='城池沿用现有地名索引约位。以下故事按各自年代阅读，不表示发生于 219 年。';
  const stories=allEvents.filter(e=>e.location===id).slice(0,3);
  $('#place-stories').innerHTML=stories.length?stories.map(e=>`<a href="./index.html#period=${encodeURIComponent(e.periodId)}&event=${encodeURIComponent(e.id)}&view=battle">${escape(e.title)} →<small>${escape(eventLabel(e))}</small></a>`).join(''):'<p>现有章节尚未收录此地的独立事件。</p>';
  $('#place-card').hidden=false;layoutLabels();
}

function bind() {
  $$('[data-mode]').forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;render()});
  $$('[data-view]').forEach(b=>b.onclick=()=>{state.view=b.dataset.view;fitView();render()});
  for(const key of ['modern','terrain','cities'])$('#'+key).onclick=()=>{state[key]=!state[key];render()};
  $('#zoom-in').onclick=()=>zoom(.75);$('#zoom-out').onclick=()=>zoom(1/.75);$('#reset').onclick=fitView;
  const about=on=>{$('#about-panel').hidden=!on;$('#about').setAttribute('aria-expanded',String(on))};
  $('#about').onclick=()=>about($('#about-panel').hidden);$('#close-about').onclick=()=>about(false);
  $('#control-toggle').onclick=()=>{state.controls=!state.controls;render()};
  const closePlace=()=>{state.selected=null;$('#place-card').hidden=true;layoutLabels()};
  $('#close-place').onclick=closePlace;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){about(false);closePlace()}});
  svg.addEventListener('wheel',e=>{e.preventDefault();const r=stage.getBoundingClientRect();zoom(Math.exp(e.deltaY*.0015),e.clientX-r.left,e.clientY-r.top)},{passive:false});
  svg.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();dragged=false;drag={id:e.pointerId,px:e.clientX,py:e.clientY,cx:camera.x,cy:camera.y};});
  svg.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.px,dy=e.clientY-drag.py;if(Math.hypot(dx,dy)>4){dragged=true;svg.setPointerCapture(e.pointerId);svg.classList.add('dragging')}if(dragged){const unit=camera.w/stage.clientWidth;camera.x=Math.max(-2800,Math.min(2400,drag.cx-dx*unit));camera.y=Math.max(-1900,Math.min(2200,drag.cy-dy*unit));updateCamera()}});
  const end=e=>{if(!drag||e.pointerId!==drag.id)return;if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);drag=null;svg.classList.remove('dragging')};
  svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
  new ResizeObserver(()=>{updateCamera()}).observe(stage);
}

try {
  const response=await fetch(new URL('./assets/history-reference/jianan-reference.json',import.meta.url));
  if(!response.ok)throw new Error(`Reference data: ${response.status}`);
  reference=await response.json();buildMap();bind();fitView();render();
  const {fit,check}=reference.registration.stats;
  $('#metrics').innerHTML=`<div><b>${reference.lines.length}</b><span>原图边界线段</span></div><div><b>${check.count}</b><span>独立位置检查点</span></div>`;
  $('#registration-note').textContent=`用 ${fit.count} 个原图城市符号对齐现有地名约位；另 ${check.count} 个点不参与拟合，位置差异中位 ${check.medianKm} km，最大 ${check.maxKm} km。这是两套约位的一致性检查，不代表古城址或边界的真实精度。`;
  $('#loading').hidden=true;
} catch(error) {
  console.error(error);$('#loading').textContent='参考地图暂未加载，请刷新重试。';$('#status').textContent='地图加载失败';
}
