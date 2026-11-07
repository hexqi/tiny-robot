import { powers, powerName, getPowerSnapshot, normalizePowerYear, POWER_MIN_YEAR, POWER_MAX_YEAR } from './power-data.js';
import { powerDetail, powerAreas, powerLabels, adjacentPowerYear } from './power-view.js';
import { geography } from './assets/geography.js';
import { modernAdmin } from './assets/modern-admin.js';
import { sources as baseSources } from './data.js';
import { storySources, historyReferences } from './story-data.js';
import { ancientRegions, states, pendingRegions, adminBoundaries, placeAdmin, ancientSources, adminExceptions, atlasMetadata, historicalPlaceAdmin, locationGeometryNote } from './reference-atlas.js';
import { landforms, regionalLandforms, nationalProvinces, cityTerrain, portIds, fieldIds } from './landscape-data.js';
import { periods, allEvents, allPeople as people, allPlaces as places, allBiographies as biographies, factions, getPeriod, eventLabel, personIdsInPeriod } from './history-world.js';
const sources={...baseSources,...storySources};
const $=s=>document.querySelector(s), all=s=>[...document.querySelectorAll(s)];
const place=id=>places.find(p=>p.id===id);
const person=id=>{const p=people.find(p=>p.id===id);return p?{...p,...currentPeriod.personContexts?.[id]}:null};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const point=c=>[(c[0]-108.5)*70,(35.8-c[1])*80];
const path=(cs,close=false)=>cs.map((p,i)=>(i?'L':'M')+point(p).map(n=>n.toFixed(2)).join(',')).join(' ')+(close?'Z':'');
const geometryPath=polygons=>polygons.flatMap(p=>p.map(r=>path(r,true))).join(' ');
const stamp=(p,large=false)=>`<span class="person-medallion${large?' large':''}" style="--person-color:${factions[p.faction].color}">${p.seal}</span>`;
const STORAGE='shanhe-chibi-v1',chibi=getPeriod('chibi');
const blank=()=>({period:'chibi',periodEvents:{},stage:0,event:chibi.events[0].id,visited:[],placesVisited:[],placeVisited:false,stagesSeen:[],bookmarks:[],eventBookmarks:[],eventsSeen:[]});
let saved;try{saved=JSON.parse(localStorage.getItem(STORAGE))}catch{}
const progress=blank();
if(saved&&typeof saved==='object'){
 progress.stage=Number.isInteger(saved.stage)&&saved.stage>=0&&saved.stage<4?saved.stage:0;
 for(const key of ['visited','eventsSeen','eventBookmarks'])progress[key]=Array.isArray(saved[key])?saved[key].filter(id=>(key==='visited'?people:allEvents).some(x=>x.id===id)):[];
 for(const key of ['stagesSeen','bookmarks'])progress[key]=Array.isArray(saved[key])?saved[key].filter(x=>Number.isInteger(x)&&x>=0&&x<4):[];
 progress.placeVisited=saved.placeVisited===true;
 progress.placesVisited=Array.isArray(saved.placesVisited)?saved.placesVisited.filter(id=>places.some(p=>p.id===id)):[];
 progress.event=allEvents.some(e=>e.id===saved.event)?saved.event:chibi.events.find(e=>e.stage===progress.stage).id;
 progress.period=allEvents.find(e=>e.id===progress.event).periodId;
 for(const period of periods){const id=saved.periodEvents?.[period.id];if(period.events.some(e=>e.id===id))progress.periodEvents[period.id]=id}
}
const params=new URLSearchParams(location.hash.slice(1)),explicitEvent=allEvents.find(e=>e.id===params.get('event'));
let currentPeriod=getPeriod(explicitEvent?.periodId)||getPeriod(params.get('period'))||(params.has('stage')?chibi:getPeriod(progress.period))||chibi;
let events=currentPeriod.events,stages=currentPeriod.stages;
const initial=explicitEvent||(params.has('stage')?events.find(e=>String(e.stage)===params.get('stage')):null)||events.find(e=>e.id===progress.periodEvents[currentPeriod.id])||events.find(e=>e.id===progress.event)||events[0];
const state={period:currentPeriod.id,stage:initial.stage,event:initial.id,view:params.get('mode')==='power'?'power':'world',powerYear:normalizePowerYear(params.get('year')??229),powerFocus:null,selected:null,mode:initial.historical?'history':'novel',mapMode:'ancient',level:'jun',terrain:true,cities:true,scope:params.get('view')==='national'||(!params.has('event')&&!params.has('stage')&&!params.has('period'))?'national':'battle',territories:false,routes:true,playing:false,focusPerson:null,personMode:'career',personNode:0,factionFilter:'all',peopleScope:'period'};
let timer,toastTimer,drag=null,dragMoved=false,camera={x:450,y:350,zoom:1},adminLabelBoxes=[];
let powerReturn=null,powerSnapshot=getPowerSnapshot(state.powerYear),powerRenderedYear=null;
const isPower=()=>state.view==='power';
const current=()=>events.find(e=>e.id===state.event), index=()=>events.findIndex(e=>e.id===state.event);
const isChibi=()=>currentPeriod.id==='chibi';
const activePerson=()=>state.view==='people'&&state.focusPerson?person(state.focusPerson):null;
const activeMilestone=()=>activePerson()?biographies[state.focusPerson].items[state.personNode]:null;
const isCareer=()=>Boolean(activePerson()&&state.personMode==='career');
const mapPhase=()=>isChibi()&&state.stage===3&&index()<events.findIndex(e=>e.id==='fire-attack')?2:state.stage;
function setActivePeriod(id){currentPeriod=getPeriod(id);events=currentPeriod.events;stages=currentPeriod.stages;state.period=id;state.focusPerson=null;state.factionFilter='all';state.peopleScope='period'}
function updateURL(){history.replaceState(null,'',`#period=${currentPeriod.id}&event=${state.event}&view=${state.scope==='national'?'national':'battle'}${isPower()?'&mode=power&year='+state.powerYear:''}`)}
function refsMarkup(refs){return (refs||[]).map(ref=>`<a class="source-link" href="${escape(ref.url)}" target="_blank" rel="noopener">${escape(ref.title)} ↗</a>`).join('')}
function paragraphMarkup(value){return String(value||'').split(/\n\s*\n/).filter(Boolean).map(text=>`<p class="detail-body">${escape(text)}</p>`).join('')}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(progress))}catch{}}
function toast(text){clearTimeout(toastTimer);$('#toast').textContent=text;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2500)}
function mark(){progress.period=currentPeriod.id;progress.periodEvents[currentPeriod.id]=state.event;progress.stage=state.stage;progress.event=state.event;if(isChibi()&&!progress.stagesSeen.includes(state.stage))progress.stagesSeen.push(state.stage);if(!progress.eventsSeen.includes(state.event))progress.eventsSeen.push(state.event);save()}
function questFlags(){
 if(isChibi())return [new Set(progress.visited.map(id=>person(id)?.faction).filter(f=>['cao','liu','sun'].includes(f))).size>=3,progress.placeVisited,progress.stagesSeen.includes(0)&&progress.stagesSeen.includes(3)];
 const cast=personIdsInPeriod(currentPeriod);
 return [progress.visited.filter(id=>cast.has(id)).length>=3,events.some(e=>progress.placesVisited.includes(e.location)),progress.eventsSeen.includes(events[0].id)&&progress.eventsSeen.includes(events.at(-1).id)];
}
function sourceLinks(ids){return ids.map(id=>`<a class="source-link" href="${sources[id].url}" target="_blank" rel="noopener">${sources[id].title} ↗</a>`).join('')}
function eventButtons(items){return items.map(e=>`<button class="related-event ${e.id===state.event?'current':''}" data-event="${e.id}"><span>${eventLabel(e)}</span><strong>${e.title}</strong><i>→</i></button>`).join('')}
function chips(ids){return `<div class="cast-chips">${ids.map(id=>`<button data-person="${id}" style="--person-color:${factions[person(id).faction].color}">${person(id).name}<span>↗</span></button>`).join('')}</div>`}
function regionFor(p){return ancientRegions.find(r=>r.id===placeAdmin[p.id]?.[3])}
const modernNames={xuchang:'许昌',wancheng:'南阳',xinye:'新野',xiangyang:'襄阳',changban:'当阳',jiangling:'荆州',hankou:'武汉',fankou:'鄂州',chibi:'赤壁',chaisang:'九江',hefei:'合肥',wujun:'苏州',hanjin:'沙洋',huarong:'监利',wulin:'乌林'};
function buildMap(){
 const land=geography.land.map(r=>`<path d="${path(r,true)}"/>`).join('');
 const provincePaths=modernAdmin.provinces.map(p=>`<path d="${p.rings.map(r=>path(r,true)).join(' ')}"><title>${escape(p.name)} · 2019 省界</title></path>`).join('');
 const boundaries=kind=>adminBoundaries.filter(b=>b.kind===kind).map(b=>`<path data-boundary="${b.id}" d="${path(b.points)}"/>`).join('');
 const countyPaths=modernAdmin.counties.map(p=>`<path d="${p.rings.map(r=>path(r,true)).join(' ')}"/>`).join('');
 $('#history-map').innerHTML=`<title>汉末三国故事与古今政区对照地图</title><desc>各篇共用建安州郡参考图，原图名义年份219，部分州界采用220年后安排；现代省县界为 2019 与 2017 数据快照。点击县治、地点或郡名查看详情。</desc><defs><pattern id="power-contested" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#c8b89c"/><path d="M-2 2L2-2M0 10L10 0M8 12L12 8" stroke="#7f6950" stroke-width="2"/></pattern><pattern id="pending-hatch" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M-2 2L2-2M0 10L10 0M8 12L12 8" fill="none" stroke="#806344" stroke-width=".7" opacity=".32"/></pattern><clipPath id="land-clip">${land}</clipPath><clipPath id="country-clip">${provincePaths}</clipPath><symbol id="city-fort" viewBox="-12 -13 24 26"><path d="M-10 9V-2H-7V-5H-3V-2H3V-5H7V-2H10V9Z"/><path d="M-5-3V-9H5V-3M-8-9H8L4-13H-4ZM-2 9V3H2V9"/></symbol><symbol id="city-port" viewBox="-12 -13 24 26"><path d="M-10 4H10L6 9H-6ZM0 3V-12L8-2H0M-11 12Q-6 9-1 12T10 12"/></symbol><symbol id="city-field" viewBox="-12 -13 24 26"><path d="M-6 11V-12L9-9 2-3-6-5M-10 11H1"/></symbol><linearGradient id="land-fill" x2=".8" y2="1"><stop stop-color="#f0ecdb"/><stop offset="1" stop-color="#e1e2cc"/></linearGradient>${Object.entries(factions).map(([id,f])=>`<marker id="arrow-${id}" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0 0L6 3L0 6" fill="none" stroke="${f.color}"/></marker>`).join('')}</defs>
 <rect x="-6000" y="-6000" width="14000" height="14000" fill="#d2dfe0"/><g fill="url(#land-fill)" stroke="#a5b29a" stroke-width=".6">${land}</g><g id="terrain-layer" clip-path="url(#land-clip)"><g clip-path="url(#country-clip)">${terrainImage([68,16,142,56],'china','terrain-national',.96)}${terrainImage([106,25,124,38],'chibi','terrain-regional',1)}</g></g><g id="national-reference">${provincePaths}</g><g id="territories" clip-path="url(#land-clip)"></g>
 <g id="power-areas"></g><g id="ancient-admin" fill-rule="evenodd"><g id="state-fills">${states.map(s=>`<path d="${geometryPath(s.polygons)}" fill="${s.color}" opacity=".07"/>`).join('')}</g><g id="pending-admin" fill="url(#pending-hatch)" fill-rule="evenodd" pointer-events="none">${pendingRegions.map(r=>`<path data-pending-state="${r.parent}" d="${geometryPath(r.polygons)}"/>`).join('')}</g><g id="commandery-fills">${ancientRegions.filter(r=>r.polygons.length).map(r=>`<path data-region-shape="${r.id}" d="${geometryPath(r.polygons)}"/>`).join('')}</g><g id="state-selection-fills">${states.map(s=>`<path data-state-outline="${s.name}" d="${geometryPath(s.polygons)}"/>`).join('')}</g><g id="commandery-lines">${boundaries('region')}</g><g id="state-lines">${boundaries('state')}</g></g>
 <g id="modern-counties">${countyPaths}</g><g id="modern-provinces">${provincePaths}</g>
 <g id="lakes">${geography.lakes.map(l=>`<path d="${l.rings.map(r=>path(r,true)).join(' ')}"/>`).join('')}</g>
 <g class="rivers" fill="none" stroke="#729ca3" stroke-linecap="round">${geography.rivers.map(r=>`<path class="${r.rank>3?'minor-river':'major-river'}" d="${path(r.points)}" vector-effect="non-scaling-stroke"/>`).join('')}</g>
 <g id="regional-river-labels"><text x="115" y="405" class="river-label">长江</text><text x="300" y="310" class="river-label" transform="rotate(52 300 310)">汉水</text><text x="665" y="365" class="river-label">长江</text></g>
 <g id="terrain-labels">${landforms.map(l=>{const [x,y]=point(l.coord);return `<text data-font="${l.size}" transform="translate(${x},${y}) rotate(${l.angle||0})" class="landform-label ${l.kind}" text-anchor="middle">${l.name}</text>`}).join('')}</g>
 <g id="regional-terrain-labels">${regionalLandforms.map(l=>{const [x,y]=point(l.coord);return `<text transform="translate(${x},${y}) rotate(${l.angle||0})" class="regional-landform ${l.kind||''}" text-anchor="middle">${l.name}</text>`}).join('')}</g>
 <g id="state-labels">${states.map(s=>{const [x,y]=point(s.center);return `<g data-state-name="${s.name}" transform="translate(${x},${y})" role="button" tabindex="0" aria-label="查看${s.name}的郡国"><text text-anchor="middle" class="state-label" fill="${s.color}">${s.name}</text></g>`}).join('')}</g>
 <g id="commandery-labels">${ancientRegions.map(r=>{const [x,y]=point(r.center),width=r.name.length*13+8;return `<g data-region="${r.id}" class="region-label ${r.coverage==='closed-reference'?'':'unresolved'}" data-coverage="${r.coverage}" role="button" tabindex="0" aria-label="查看${r.name}隶属与地点" transform="translate(${x},${y})"><rect x="${-width/2}" y="-13" width="${width}" height="20" rx="3"/><text text-anchor="middle">${r.name}</text><title>${r.name} · ${r.geometryStatus}</title></g>`}).join('')}</g>
 <g id="power-labels"></g><g id="modern-labels">${nationalProvinces.map(([name,coord])=>{const [x,y]=point(coord);return `<text transform="translate(${x},${y})" class="province-label" text-anchor="middle">${name}</text>`}).join('')}</g><g id="routes"></g><g id="event-marker"></g><g id="career-markers"></g><g id="cities"></g><g id="battle-window" role="button" tabindex="0" aria-label="进入赤壁战场"><rect x="75" y="65" width="825" height="655" rx="15"/><text x="490" y="45" text-anchor="middle">赤壁故事区域 · 点击进入</text></g>`;
 buildInset();activate($('#battle-window'),()=>setScope('battle'));
 all('[data-state-name]').forEach(el=>activate(el,()=>{state.selected={type:'state',id:el.dataset.stateName};stopPlayback();render();revealDetail()}));
 all('[data-region]').forEach(el=>activate(el,()=>{state.selected={type:'region',id:el.dataset.region};stopPlayback();render();revealDetail()}));
}
function activate(el,fn){el.addEventListener('click',()=>{if(!dragMoved)fn()});el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn()}})}
function renderAdmin(){
 const ancient=state.mapMode!=='modern',modern=state.mapMode!=='ancient',national=viewport().w>1900,unit=viewport().w/$('#map-container').clientWidth;
 const commanderies=ancient&&!national&&state.level!=='zhou';
 const county=modern&&!national&&(state.level==='county'||camera.zoom>=1.75);
 const show=(id,on)=>$('#'+id).style.display=on?'':'none';
 show('ancient-admin',ancient);show('state-labels',ancient);
 for(const id of ['commandery-lines','commandery-fills','commandery-labels','pending-admin'])show(id,commanderies);
 for(const id of ['modern-provinces','modern-labels'])show(id,modern);
 $('#pending-hatch').setAttribute('patternTransform',`scale(${unit})`);
 show('modern-counties',county);show('national-reference',false);
 show('terrain-layer',state.terrain);show('terrain-regional',!national);show('terrain-labels',state.terrain&&!modern);
 show('regional-terrain-labels',state.terrain&&!national);show('regional-river-labels',!national);
 show('south-sea',national);show('battle-window',national&&state.view!=='people'&&isChibi());show('terrain-key',state.terrain);
 $('#map-container').dataset.scale=national?'national':'regional';
 $('#state-fills').style.opacity=state.mapMode==='compare'?'.3':'.6';
 $('#battle-window text').style.fontSize=10*unit+'px';
 all('#terrain-labels text').forEach(t=>{t.style.fontSize=Number(t.dataset.font)*unit*.85+'px';t.style.display=!national&&['秦岭','长江中下游平原'].includes(t.textContent)?'none':''});
 const visible=coord=>{const [x,y]=point(coord),v=viewport();return Math.abs(x-camera.x)<v.w/2&&Math.abs(y-camera.y)<v.h/2};
 all('[data-state-name]').forEach(el=>{const area=states.find(s=>s.name===el.dataset.stateName),[x,y]=point(area.center);el.setAttribute('transform',`translate(${x},${y}) scale(${unit})`);el.style.display=visible(area.center)?'':'none';el.setAttribute('tabindex',ancient&&visible(area.center)?'0':'-1')});
 const cityBoxes=cityHitBoxes(national,unit),labelBoxes=[],spacingBoxes=[];
 // Leave more breathing room when commandery names first appear; reveal detail as we zoom in.
 const density=Math.max(0,Math.min(1,(viewport().w-850)/1050)),gapX=60*density,gapY=22*density;
 const priority=state.selected?.type==='region'?state.selected.id:placeAdmin[current().location]?.[3];
 const regions=[...ancientRegions].sort((a,b)=>(b.id===priority)-(a.id===priority));
 for(const r of regions){
  const el=$(`[data-region="${r.id}"]`),[x,y]=point(r.center),width=r.name.length*13+8;
  const labelBox=([dx,dy])=>({x:x/unit+dx-width/2-2,y:y/unit+dy-15,w:width+4,h:24});
  const spaced=box=>({x:box.x-gapX,y:box.y-gapY,w:box.w+gapX*2,h:box.h+gapY*2});
  const offset=visible(r.center)&&[[0,0],[0,-28],[0,28],[-40,0],[40,0]].find(o=>!cityBoxes.some(b=>overlaps(labelBox(o),b))&&!spacingBoxes.some(b=>overlaps(spaced(labelBox(o)),b)));
  const [dx,dy]=offset||[0,0],shown=ancient&&!national&&state.level!=='zhou'&&Boolean(offset);
  if(shown){const box=labelBox(offset);labelBoxes.push(box);spacingBoxes.push(spaced(box))}
  el.setAttribute('transform',`translate(${x+dx*unit},${y+dy*unit}) scale(${unit})`);el.style.display=offset?'':'none';el.setAttribute('tabindex',shown?'0':'-1');
  const selected=state.selected?.type==='region'&&state.selected.id===r.id;el.classList.toggle('selected',selected);el.setAttribute('aria-pressed',String(selected));
 }
 adminLabelBoxes=labelBoxes;
 all('.regional-landform').forEach(t=>t.style.fontSize=13*unit+'px');
 all('.province-label').forEach(t=>t.style.fontSize=(national?11:19)*unit+'px');
 all('[data-region-shape]').forEach(el=>el.classList.toggle('selected',state.selected?.type==='region'&&state.selected.id===el.dataset.regionShape));
 all('[data-state-outline]').forEach(el=>el.classList.toggle('selected',state.selected?.type==='state'&&state.selected.id===el.dataset.stateOutline));
 for(const boundary of adminBoundaries){
  const selected=state.selected?.type==='state'?boundary.kind==='state'&&boundary.states.includes(state.selected.id):commanderies&&state.selected?.type==='region'&&boundary.faces.includes(state.selected.id);
  $(`[data-boundary="${boundary.id}"]`).classList.toggle('selected',Boolean(selected));
 }
 all('[data-state-name]').forEach(el=>{const selected=state.selected?.type==='state'&&state.selected.id===el.dataset.stateName;el.classList.toggle('selected',selected);el.setAttribute('aria-pressed',String(selected))});
 all('[data-map-mode]').forEach(b=>b.setAttribute('aria-pressed',String(state.mapMode===b.dataset.mapMode)));
 $('#atlas-status').textContent=(state.mapMode==='ancient'?`各篇共用：${states.length} 州 / ${ancientRegions.length} 郡级标签；${atlasMetadata.stats.closed} 个闭合参考范围，${atlasMetadata.stats.open} 个缺界，${atlasMetadata.stats.emigre} 个侨置。底稿约 219 年，部分州界取 220 年后安排，与故事年代独立。`:state.mapMode==='modern'?'现代数据快照：省界 2019 / 县界 2017':'古今叠加 · 建安参考曲线 / 现代省界 2019')+(national?' · 放大后查看郡县细节':' · 点击城池或郡名查看详情');
 $('#map-scope').textContent=national?'全国地理视野 · 从山川理解历史':state.mapMode==='ancient'?'建安州郡 · 曲线参考图':state.mapMode==='modern'?'现代政区 · 2019 / 2017 快照':'同一片山河 · 古今政区叠加';
 $('#map-kicker').textContent=national?'山河万里':stages[mapPhase()].kicker;
 $('#map-subtitle').textContent=national?'由地势看全局，由城池入故事':state.selected?.type==='person'?`${person(state.selected.id).name} · 演义关联场景`:current().title;
 $('#map-reference').hidden=!ancient;
 $('.map-caption>span').textContent=ancient?'古界：Esiymbro · CC BY-SA 4.0':state.terrain?'地形：Mapzen / USGS / NOAA · 现代高程':'城池为约位符号';
 $('#map-legend').innerHTML=`<span><i class="fort-key"></i>城池</span><span><i class="port-key"></i>渡口</span>${ancient?'<span><i class="state-line"></i>古州界</span>':''}${commanderies?'<span><i class="jun-line"></i>古郡界</span><span><i class="pending-key"></i>原图缺界</span>':''}${ancient&&(state.selected?.type==='state'||commanderies&&state.selected?.type==='region'&&ancientRegions.find(r=>r.id===state.selected.id)?.polygons.length)?'<span><i class="selection-key"></i>选中范围</span>':''}${modern?'<span><i class="modern-line"></i>现代省界</span>':''}${county?'<span><i class="county-line"></i>现代县界</span>':''}<span><i class="event-dot"></i>${isCareer()?'生平节点':activePerson()&&!isChibi()?'关联事件':'故事'}</span>`;
 $('#scope-national').setAttribute('aria-pressed',String(state.scope==='national'));$('#scope-battle').setAttribute('aria-pressed',String(state.scope==='battle'));
 $('#zoom-hint').textContent=national?'全国视野 · 滚轮放大查看城池':'区域视野 · 滚轮缩放 / 拖动探索';
 if(activePerson()){$('#map-period').textContent=`${activePerson().name} · ${biographies[state.focusPerson].life} · ${state.personMode==='career'?'人生行迹':'本篇故事'}`;$('#map-kicker').textContent=activePerson().name+'的山河';$('#map-scope').textContent=isCareer()?'生平节点 · 连线不代表精确行军路线':isChibi()?'演义故事 · 关联场景约位':'关联事件地点 · 不表示本人到场';$('#map-subtitle').textContent=isCareer()?activeMilestone().when+' · '+activeMilestone().title:'点击人物的故事，回到当时的选择';}
 else if(state.view==='people'){$('#map-period').textContent='人物志 · 按阵营与人物探索';$('#map-kicker').textContent='群英与山河';$('#map-subtitle').textContent='从左侧选择人物，展开他的地图';}
 $('#territory-toggle').textContent=isChibi()?'势力':'控制点';
 if(!isChibi()){
  if(!activePerson()){$('#map-subtitle').textContent=`${current().dateLabel} · ${current().title}`;}
  if(state.territories)$('#map-legend').insertAdjacentHTML('beforeend','<span><i class="event-dot"></i>本事件记载的控制点</span>');
 }
 if(isCareer()||(!isChibi()&&activePerson()))$('#territories').style.display='none';
 if(isPower())renderPowerMap();
}

function renderMap(){
 if(isPower()){renderAdmin();renderCities();return}
 const ev=current(),s=stages[mapPhase()],selectedPerson=activePerson();
 if(isChibi())$('#territories').innerHTML=`<path d="${path(state.stage===0?[[109,36],[122,36],[119,33],[115,32.9],[111,33.1]]:[[109,36],[122,36],[119,33],[115.3,31.1],[113.7,29.95],[112,30.1],[110,32]],true)}" fill="#b05d4824"/><path d="${path([[115.6,30.65],[117.2,31.25],[120,32.1],[123,32],[123,26],[116,26],[114.8,28.5]],true)}" fill="#537d9122"/>`;
 else $('#territories').innerHTML=Object.entries(ev.map?.owners||{}).map(([id,faction])=>{const [x,y]=point(place(id).coord);return `<g data-control-place="${id}" transform="translate(${x},${y})"><circle r="25" fill="${factions[faction].color}" opacity=".14"/><circle r="25" fill="none" stroke="${factions[faction].color}" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/><title>${place(id).name} · 本事件控制点：${factions[faction].name}；不表示疆域边界</title></g>`}).join('');
 $('#territories').style.display=state.territories?'':'none';
 let routeData=isChibi()?Object.entries(s.routes).map(([faction,places])=>({faction,places})):(ev.map?.routes||[]);
 let routes=routeData.filter(route=>route.places.length>1).map(route=>`<path class="route" d="${path(route.places.map(id=>place(id).coord))}" stroke="${factions[route.faction].color}" opacity=".65" marker-end="url(#arrow-${route.faction})"/>`).join('');
 const storyRoutes={
  'borrow-arrows':['liu',['chibi','wulin','chibi']], 'kanze-letter':['sun',['chibi','wulin']],
  'chain-plan':['liu',['chibi','wulin']], 'fire-attack':['sun',['chibi','wulin']],
  'pursuit':['cao',['wulin','huarong','jiangling']], 'huarong-ambush':['cao',['wulin','huarong']],
  'guanyu-mercy':['cao',['huarong','jiangling']]
 };
 if(storyRoutes[ev.id]){const [f,ids]=storyRoutes[ev.id];routes=`<path class="route story-route" d="${path(ids.map(id=>place(id).coord))}" stroke="${factions[f].color}" marker-end="url(#arrow-${f})"/>`}
 if(selectedPerson){const ids=[...new Set(events.filter(e=>e.cast.includes(selectedPerson.id)).map(e=>e.location))];routes=isChibi()?(ids.length>1?`<path class="route active" d="${path(ids.map(id=>place(id).coord))}" stroke="${factions[selectedPerson.faction].color}" marker-end="url(#arrow-${selectedPerson.faction})"/>`:''):ids.map(id=>{const [x,y]=point(place(id).coord);return `<circle data-story-place="${id}" cx="${x}" cy="${y}" r="22" fill="none" stroke="${factions[selectedPerson.faction].color}" stroke-dasharray="3 4" vector-effect="non-scaling-stroke"><title>${place(id).name} · 关联事件地点，不表示本人到场</title></circle>`}).join('')}
 $('#routes').innerHTML=routes;$('#routes').style.display=state.routes?'':'none';
 const [ex,ey]=point(place(ev.location).coord);$('#event-marker').innerHTML=`<circle cx="${ex}" cy="${ey}" r="24" class="event-halo"/><circle cx="${ex}" cy="${ey}" r="31" class="event-orbit"/>`;
 if(selectedPerson&&!isChibi()&&!isCareer())$('#event-marker').innerHTML='';
 renderAdmin();renderCities();renderCareerMap();
}
function terrainImage(bounds,name,id,opacity){const [x,y]=point([bounds[0],bounds[3]]);return `<image id="${id}" href="assets/terrain-${name}.webp" x="${x}" y="${y}" width="${(bounds[2]-bounds[0])*70}" height="${(bounds[3]-bounds[1])*80}" preserveAspectRatio="none" opacity="${opacity}"/>`}
function buildInset(){
 const ip=c=>[(c[0]-105)*5,(25-c[1])*5],poly=r=>r.map((c,i)=>(i?'L':'M')+ip(c).join(',')).join(' ')+'Z';
 const rings=geography.land.filter(r=>r.some(([x,y])=>x>=105&&x<=125&&y>=3&&y<=25));
 $('#south-sea svg').innerHTML=`<rect width="100" height="112" fill="#d5e1df"/><g fill="#d8d8b8" stroke="#8da395" stroke-width=".35">${rings.map(r=>`<path d="${poly(r)}"/>`).join('')}</g><g class="island-labels">${[['东沙',[116.7,20.7]],['西沙',[112.3,16.7]],['中沙',[114.4,15.8]],['南沙',[114.5,9.8]]].map(([name,c])=>{const [x,y]=ip(c);return `<circle cx="${x}" cy="${y}" r="1.2"/><text x="${x+3}" y="${y+2}">${name}</text>`}).join('')}</g>`;
}
const nationalCityIds=new Set(['xuchang','xiangyang','chibi','wujun']);
function cityShown(p,national){return isCareer()?biographies[state.focusPerson].items.some(m=>m.place===p.id):p.id===current().location||(state.selected?.type==='place'&&state.selected.id===p.id)||p.rank===1||!national||nationalCityIds.has(p.id)}
function overlaps(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function cityHitBoxes(national,unit){return state.cities?places.filter(p=>cityShown(p,national)).map(p=>{const [x,y]=point(p.coord);return {id:p.id,x:x/unit-13,y:y/unit-13,w:26,h:26}}):[]}
function renderCities(){
 const national=viewport().w>1900,unit=viewport().w/$('#map-container').clientWidth,scale=unit*.9,ev=current(),boxes=[...adminLabelBoxes],hits=cityHitBoxes(national,unit);
 const offsets={xinye:[29,-12],xiangyang:[-25,18],changban:[-33,-11],hanjin:[20,-13],jiangling:[-25,23],hankou:[-2,-18],fankou:[29,5],chibi:[10,25],wulin:[30,-12],huarong:[-26,24],chaisang:[18,22]};
 const preferred=state.selected?.type==='place'?state.selected.id:isCareer()?activeMilestone()?.place:ev.location;
 $('#cities').innerHTML=[...places].sort((a,b)=>(b.id===preferred)-(a.id===preferred)).map(p=>{
 const [x,y]=point(p.coord),active=!isPower()&&p.id===(state.view==='people'?(isCareer()?activeMilestone()?.place:null):ev.location),selected=state.selected?.type==='place'&&state.selected.id===p.id;
 const shown=cityShown(p,national),initialOffset=national?[0,-19]:(offsets[p.id]||[0,-19]);
 let name=state.mapMode==='modern'?(modernNames[p.id]||p.modern.replace(/^今/,'').split(/[；;（(]/)[0].replace(/一带.*$/,'').replace(/.*?(北京|太原|淄博|南京|西安|洛阳|成都|重庆|广州|武威|敦煌|辽阳|喀什|库车).*/,'$1')):(state.level==='county'&&placeAdmin[p.id]?placeAdmin[p.id][2].split(' · ')[0]:p.name);
 if(isCareer()&&active&&activeMilestone().siteName&&state.mapMode!=='modern')name=activeMilestone().siteName.split('（')[0];
 const modernName=modernNames[p.id]||p.modern.replace(/^今/,'').split(/[；;（(]/)[0].split('一带')[0],compare=state.mapMode==='compare'&&!national;
 const width=Math.max(name.length*12,compare?(modernName.length+2)*8:0),height=compare?29:17;
 const labelBox=([dx,dy])=>({x:x/unit+dx*.9-width/2,y:y/unit+dy*.9-13,w:width,h:height});
 const offset=shown&&[initialOffset,[0,32],[-(width/2+17)/.9,4],[(width/2+17)/.9,4]].find(o=>!boxes.concat(hits).some(b=>overlaps(labelBox(o),b)));
 const [dx,dy]=offset||initialOffset,label=Boolean(offset);if(label)boxes.push(labelBox(offset));
 const type=portIds.includes(p.id)?'port':fieldIds.includes(p.id)?'field':'fort',owner=isChibi()?p.owner?.[mapPhase()]:(activePerson()?undefined:ev.map?.owners?.[p.id]),powerOwner=powerSnapshot.control[placeAdmin[p.id]?.[3]]?.owner,color=isPower()?(powers[powerOwner]?.color||'#6f624a'):isCareer()?factions[activePerson().faction].color:owner?factions[owner].color:'#6f624a';
 return `<g class="city ${type}${selected||active?' selected':''}" data-place="${p.id}" transform="translate(${x},${y}) scale(${scale})" style="display:${shown?'':'none'}" role="button" tabindex="${shown?'0':'-1'}" aria-label="${p.name}，${p.modern}"><title>${p.name} · ${p.modern}</title><circle class="hit" r="14"/><circle class="city-dot" r="${active?8:6}" fill="${color}"/><use class="city-symbol" href="#city-${type}" x="-9" y="-10" width="18" height="21" style="color:${color}"/>${label?`<text text-anchor="middle" x="${dx}" y="${dy}">${name}</text>${compare?`<text class="modern-city-name" text-anchor="middle" x="${dx}" y="${dy+12}">今 ${modernName}</text>`:''}`:''}</g>`;
 }).join('');
 $('#cities').style.display=state.cities?'':'none';
 all('#cities [data-place]').forEach(el=>activate(el,()=>selectPlace(el.dataset.place)));
}

function renderStory(){
 const e=current(),i=index(),p=place(e.location),bookmarked=progress.eventBookmarks.includes(e.id),periodIndex=periods.indexOf(currentPeriod),previous=periods[periodIndex-1],next=periods[periodIndex+1];
 const tab=(mode,label)=>`<button id="${mode}-tab" role="tab" aria-controls="story-panel" aria-selected="${state.mode===mode}" data-mode="${mode}">${label}</button>`;
 const references=e.historical?refsMarkup(state.mode==='history'?e.references:(e.novelReferences||e.references)):state.mode==='novel'?`<a class="source-link" href="${e.source}" target="_blank" rel="noopener">《三国演义》第 ${e.chapter} 回 · 阅读原文 ↗</a>`:sourceLinks(historyReferences[e.id]);
 return `<div class="detail-kicker"><span>${e.historical?'史籍故事':'演义故事'} · ${eventLabel(e)}</span><button class="bookmark" id="bookmark" aria-pressed="${bookmarked}" aria-label="${bookmarked?'取消收藏':'收藏当前事件'}">${bookmarked?'◆':'◇'}</button></div><div class="story-hero"><span class="hero-number">${String(i+1).padStart(2,'0')}</span><span class="story-category">${e.kind} / ${stages[e.stage].label}</span><h2>${e.title}</h2><p>${e.summary}</p></div><button class="scene-location" data-detail-place="${p.id}"><span>⌖ ${e.historical?'地点':'场景'} · ${p.name}</span><small>区域约位，非精确现场 ↗</small></button><p class="detail-section-label">${e.historical?'与这件事有关的人物':'谁在这场故事里'}</p>${chips(e.cast)}<div class="detail-tabs" role="tablist" aria-label="叙事口径">${e.historical?tab('history','史籍故事')+tab('novel','演义对照'):tab('novel','演义故事')+tab('history','史实对照')}</div><div id="story-panel" role="tabpanel" aria-labelledby="${state.mode}-tab">${paragraphMarkup(state.mode==='novel'?e.detail:e.history)}${references}</div>${e.historical?`<p class="event-map-note">⌖ ${escape(e.map?.note||'地点为区域约位，连线表示本事件行动方向。')}</p>`:''}<div class="causal-box"><span>为什么这件事重要</span><p>${e.why}</p></div><div class="story-neighbors">${i>0?`<button data-event="${events[i-1].id}"><small>← 前一件事</small>${events[i-1].title}</button>`:previous?`<button data-event="${previous.events.at(-1).id}"><small>← 上一篇结尾</small>${previous.title}</button>`:''}${i<events.length-1?`<button data-event="${events[i+1].id}"><small>后一件事 →</small>${events[i+1].title}</button>`:next?`<button data-event="${next.events[0].id}"><small>继续下一篇 →</small>${next.title} · ${next.years}</button>`:'<span class="end-note">赤壁篇终 · 荆州争夺仍在继续</span>'}</div>`;
}
function lifeProse(item){
 return `<p class="life-summary">${escape(item.body)}</p>${item.sections.map(section=>`<section><h3>${escape(section.title)}</h3><p>${escape(section.text)}</p></section>`).join('')}<aside class="life-evidence"><h3>史料与说明</h3>${item.note?`<p>${escape(item.note)}</p>`:''}${item.references.map(ref=>`<a class="story-source" href="${escape(ref.url)}" target="_blank" rel="noopener">${escape(ref.title)} ↗</a>`).join('')}<small>据史籍整理为现代叙述，背景与影响包含阅读解说。</small></aside>`;
}
function lifeNavigation(bio){
 return [-1,1].map(step=>{const next=state.personNode+step,item=bio.items[next];return `<button data-life-step="${next}" ${item?'':'disabled'}><small>${step<0?'← 前一篇':'后一篇 →'}</small><span>${item?escape(item.title):step<0?'已到第一篇':'已到最后一篇'}</span></button>`}).join('');
}
function renderLifeReader(){
 const p=activePerson(),bio=biographies[p.id],item=activeMilestone();
 $('#reader-person').textContent=`${p.name} · ${item.when}`;
 $('#reader-count').textContent=`生平故事 ${state.personNode+1} / ${bio.items.length}`;
 $('#reader-title').textContent=item.title;
 $('#reader-content').innerHTML=lifeProse(item);
 $('#reader-navigation').innerHTML=lifeNavigation(bio);
 all('#reader-navigation [data-life-step]').forEach(b=>b.addEventListener('click',()=>selectMilestone(Number(b.dataset.lifeStep))));
 $('#reader-scroll').scrollTop=0;
}
function openLifeReader(){renderLifeReader();$('#life-reader').showModal();$('#reader-title').focus({preventScroll:true})}
$('#life-reader').addEventListener('close',()=>{const opener=$('#open-life-reader');opener?.scrollIntoView({block:'nearest'});opener?.focus({preventScroll:true})});
function renderPerson(id){
 const p=person(id),bio=biographies[id],related=events.filter(e=>e.cast.includes(id));
 return `<button class="directory-back" id="back-directory">← 人物谱 <span>${factions[p.faction].name}</span></button><div class="person-heading">${stamp(p,true)}<div><h2>${p.name}</h2><small>${p.zi==='—'?'':`字 ${p.zi} · `}${bio.life}</small></div></div><p class="person-era-label">${isChibi()&&chibi.people.some(p=>p.id===id)?'赤壁前后的身份':`${currentPeriod.years} 年 · 本篇人物背景`}</p><p class="detail-intro">${p.bio}</p><div class="person-view-tabs" role="tablist" aria-label="人物视角"><button role="tab" data-person-mode="career" aria-selected="${state.personMode==='career'}">人生行迹 <small>${bio.items.length}</small></button><button role="tab" data-person-mode="stories" aria-selected="${state.personMode==='stories'}">本篇故事 <small>${related.length}</small></button></div>${state.personMode==='career'?`<p class="map-explanation">沿年表读故事，了解背景、经过与影响。地点不详的事迹只列在年表中。</p><div class="life-timeline">${bio.items.map((item,i)=>`<section class="life-item ${i===state.personNode?'active':''}"><button class="life-toggle" data-milestone="${i}" aria-current="${i===state.personNode?'step':'false'}" aria-expanded="${i===state.personNode}"><span class="life-index">${String(i+1).padStart(2,'0')}</span><span class="life-content"><small>${item.when}</small><strong>${item.title}</strong></span><span class="life-chevron" aria-hidden="true">${i===state.personNode?'−':'＋'}</span></button>${i===state.personNode?`<div class="life-reading"><div class="life-actions"><button id="open-life-reader" aria-haspopup="dialog">展开阅读 ↗</button>${item.place?'<button id="milestone-map">地图看这一站 ⌖</button>':''}</div><p class="life-place">${item.place?'⌖ '+(item.siteName||place(item.place).name)+' · 地点约位':'地点未定 · 本条不在地图定位'}</p><article class="life-prose" aria-label="${item.title}的故事">${lifeProse(item)}</article><div class="life-neighbors">${lifeNavigation(bio)}</div></div>`:''}</section>`).join('')}</div><a class="source-link" href="${bio.source}" target="_blank" rel="noopener">${bio.sourceTitle} ↗</a>`:`<p class="map-explanation">${isChibi()?'以下是《三国演义》赤壁篇的关联故事，地图连线不作为个人史实行迹证明。':`${currentPeriod.title}中的相关事件。地图圆环标出事件地点，不表示本人曾经到场；查看人生行迹可阅读有史料依据的个人经历。`}</p>${eventButtons(related)}`}<p class="detail-section-label">人物关系 · 继续探索</p><div class="person-relations">${p.links.map(x=>{const other=people.find(p=>p.name===x.split(' · ')[0]);return other?`<button data-person="${other.id}"><strong>${other.name}</strong><small>${x.split(' · ')[1]}</small><span>↗</span></button>`:`<div>${x}</div>`}).join('')}</div>`;
}

function atlasNotice(){return `<p class="admin-reference">底图约 219 年 · 部分州界采用 220 年后安排。各篇共用，非当前故事年份的疆域。</p>`}
function regionReferences(r){return refsMarkup([r.source,...r.references])}
function adminChain(p){
 const a=placeAdmin[p.id],r=regionFor(p),old=historicalPlaceAdmin[p.id];
 if(!a)return `<p class="admin-reference">${adminExceptions[p.id]||'隶属关系尚待核对。'}</p>`;
 const changed=old[0]!==a[0]||old[3]!==a[3],geometryNote=locationGeometryNote(p);
 return `<p class="detail-section-label">底图参考州属 · 地点按文字关联</p><div class="admin-chain"><button data-state-detail="${a[0]}">${a[0]}</button><b>→</b><button data-region-detail="${r.id}">${a[1]}</button><b>→</b><span>${a[2]}</span></div>${atlasNotice()}${changed?`<p class="detail-body">旧东汉框架：${old[0]} → ${old[1]}。分置与改属见下方沿革；不由底图反推早期故事的辖境。</p>`:''}${geometryNote?`<p class="geometry-note">${geometryNote}</p>`:''}<p class="detail-body">${r.note}</p>${regionReferences(r)}`;
}
function renderPlace(id){
 const p=place(id);if(p.isAtlas)return renderAtlasCity(p);
 const related=events.filter(e=>e.location===id);
 return `<div class="detail-kicker">地点与隶属 <span>古今对照</span></div><h2>${p.name}</h2><p class="detail-intro">${p.modern}</p><div class="terrain-notice">${cityTerrain[p.id]||''}</div>${adminChain(p)}<p class="detail-body">${p.desc}</p><button class="detail-cta" id="place-compare">在同一位置叠加现代政区 <span>↗</span></button><p class="detail-section-label">在这里发生的故事 · ${related.length}</p>${related.length?eventButtons(related):'<p class="detail-intro">本篇尚无独立事件；保留此点用于理解全局地理。</p>'}<button class="back-button" id="back-story">← ${activePerson()?`返回${activePerson().name}的${isCareer()?'行迹':'故事'}`:'回到当前故事'}</button>`;
}
function renderAtlasCity(p){const related=events.filter(e=>e.location===p.id);return `<div class="detail-kicker">城池与地点索引 <span>${p.region||placeAdmin[p.id]?.[0]||'历史地名'}</span></div><div class="atlas-city-heading"><svg viewBox="-15 -17 30 35" aria-hidden="true"><use href="#city-fort" x="-12" y="-13" width="24" height="26"/></svg><h2>${p.name}</h2></div><p class="detail-intro">${p.modern}</p><div class="terrain-notice">${p.terrain||cityTerrain[p.id]||'地理约位'}</div>${adminChain(p)}<p class="detail-section-label">地名背景 · 不同年代的沿革</p><p class="detail-body">${p.desc}</p><button class="detail-cta" id="city-focus">放大查看这座城 <span>⌖</span></button><button class="detail-cta" id="place-compare">在同一位置叠加现代政区 <span>↗</span></button><p class="detail-section-label">本篇在这里发生的故事 · ${related.length}</p>${related.length?eventButtons(related):'<p class="detail-intro">本篇尚无独立事件，保留此点帮助理解周边地理。</p>'}<div class="causal-box"><span>如何看这个地点</span><p>城池符号表示区域约位，不复原当时城墙形制。上述沿革供跨时期阅读，具体事件年代见本篇故事。</p></div><button class="back-button" id="back-story">← ${activePerson()?`返回${activePerson().name}的${isCareer()?'行迹':'故事'}`:'回到当前故事'}</button>`}
function renderState(id){
 const area=states.find(s=>s.name===id),regions=ancientRegions.filter(r=>r.parent===id),closed=regions.filter(r=>r.polygons.length).length;
 return `<div class="detail-kicker">全篇共用古代政区 <span>州 → 郡级区域 → 地点</span></div><h2>${area.name}</h2><span class="precision-tag">底稿转写与州属关联 · 非逐年复原</span>${atlasNotice()}<p class="detail-body">本州收录底稿 ${regions.length} 个郡级标签，${closed} 个有闭合参考范围。州界由已绘郡域与缺界区域合成；行政区域与军事控制分别呈现。</p><p class="detail-section-label">底稿郡级区域 · ${regions.length}</p>${regions.map(r=>`<button class="region-place" data-region-detail="${r.id}"><strong>${r.name}</strong><small>${r.coverage==='closed-reference'?places.filter(p=>placeAdmin[p.id]?.[3]===r.id).length+' 个已收录地点':r.coverage==='emigre-label'?'侨置 · 无独立郡域':'范围待考'} →</small></button>`).join('')}${pendingRegions.some(r=>r.parent===id)?`<div class="causal-box pending-admin-note"><span>斜线区域 · 原图缺界</span><p>斜线部分按底稿仍属于${area.name}，不是没有行政归属。内部部分郡界未闭合，只保留已有线段；不把同一块待考区域重复分配给多个郡。</p></div>`:''}${refsMarkup([ancientSources[0]])}<button class="back-button" id="back-story">← 回到当前故事</button>`;
}
function renderRegion(id){
 const r=ancientRegions.find(r=>r.id===id),locations=places.filter(p=>placeAdmin[p.id]?.[3]===id),related=events.filter(e=>locations.some(p=>p.id===e.location));
 const status=r.coverage==='closed-reference'?'已根据原图线段整理闭合范围，可在地图高亮。曲线和坐标均为参考，不代表经过测绘或史学终审的精确边界。':r.coverage==='emigre-label'?'原图标为侨置。这里只标示名称位置，没有可独立确定的辖境，不高亮周围郡域。':'原图在这一带有未闭合边线，尚不能确定本郡的独立范围。保留名称与已画边线，不把整块斜线区当作本郡辖境。';
 return `<div class="detail-kicker">底稿逐郡索引 <span>州 → 郡级区域 → 地点</span></div><h2>${r.parent} · ${r.name}</h2><button class="region-parent" data-state-detail="${r.parent}">← 查看${r.parent}其他郡国</button><span class="precision-tag" data-coverage="${r.coverage}">${r.geometryStatus}</span>${atlasNotice()}<p class="detail-body">${status}</p>${r.aliases.length?`<p class="admin-reference">其他检索名称：${r.aliases.join('、')}</p>`:''}<p class="detail-section-label">名称、隶属与沿革</p><p class="detail-body">${r.note}</p>${r.oldFrameworkParent&&r.oldFrameworkParent!==r.parent?`<p class="detail-body">旧东汉框架属${r.oldFrameworkParent}；此处依底稿列入${r.parent}，不提前套用到早期故事。</p>`:''}${r.temporalCaution?'<p class="geometry-note">年代仍有疑点：保留底稿标签，并记录分置、改名或旋罢问题，不将其视为 219 年确证。</p>':''}<p class="detail-section-label">全图收录的县治与地点 · ${locations.length}</p>${locations.length?locations.map(p=>`<button class="region-place" data-detail-place="${p.id}"><strong>${placeAdmin[p.id][2]}</strong><small>${p.modern}</small></button>`).join(''):'<p class="detail-intro">全图暂未收录该郡的县治，可继续查看所在州的其他郡。</p>'}${regionReferences(r)}<p class="detail-section-label">这个区域里的故事 · ${related.length}</p>${eventButtons(related)}<button class="back-button" id="back-story">← ${activePerson()?`返回${activePerson().name}的${isCareer()?'行迹':'故事'}`:'回到当前故事'}</button>`;
}
function renderDirectory(){
 const ids=personIdsInPeriod(currentPeriod),pool=people.filter(p=>state.peopleScope==='all'||ids.has(p.id)).map(p=>person(p.id)),list=pool.filter(p=>state.factionFilter==='all'||p.faction===state.factionFilter);
 return `<div class="detail-kicker">从人物走进历史 <span>${pool.length} 位人物</span></div><h2 class="directory-title">他是谁，又走向哪里？</h2><p class="detail-intro">${currentPeriod.title} · ${currentPeriod.years} 年。选一个人，串起他参与的故事与人生行迹。</p><div class="people-scope"><button data-people-scope="period" aria-pressed="${state.peopleScope==='period'}">本篇人物 ${ids.size}</button><button data-people-scope="all" aria-pressed="${state.peopleScope==='all'}">全部人物 ${people.length}</button></div><div class="faction-filters" aria-label="按阵营筛选"><button data-faction="all" aria-pressed="${state.factionFilter==='all'}">全部 <small>${pool.length}</small></button>${Object.entries(factions).filter(([id])=>pool.some(p=>p.faction===id)).map(([id,f])=>`<button data-faction="${id}" aria-pressed="${state.factionFilter===id}" style="--faction-color:${f.color}">${['cao','liu','sun'].includes(id)?f.short+'方':f.name} <small>${pool.filter(p=>p.faction===id).length}</small></button>`).join('')}</div><p class="faction-caption">阵营为阅读分组；归属变化在人物事迹中说明。全部人物包括其他篇章的人物。</p><div class="people-directory">${list.map(p=>`<button class="directory-button" data-person="${p.id}">${stamp(p)}<span><strong>${p.name}</strong><small>${p.role}</small><em>${biographies[p.id].items.length} 条生平 · ${events.filter(e=>e.cast.includes(p.id)).length} 个本篇故事</em></span></button>`).join('')}</div>`;
}

function renderQuest(){
 const flags=questFlags(),tasks=isChibi()?[['看见三方的处境','分别查看曹操、刘备、孙权三方人物。','people'],['在地图上找到赤壁','打开赤壁，查看它的古今地理关系。','chibi'],['对照开端与转折','读过荆州易主和赤壁交锋阶段。','compare']]:[['认识这段历史中的人物','查看本篇至少三位人物，了解他们的处境。','people'],['从故事找到地点','打开本篇一个事件的地点卡，看看它在哪里。','place'],['串起开端与结尾','读本篇第一件和最后一件事，回顾局势变化。','period-ends']];
 return `<div class="detail-kicker">${currentPeriod.title} · 探索手记 <span>已读 ${events.filter(e=>progress.eventsSeen.includes(e.id)).length} / ${events.length} 件事</span></div><h2>从故事，走进全局。</h2><p class="detail-intro">记下感兴趣的片段，把人物、地点和局势连起来。</p><div class="quest-count">${flags.filter(Boolean).length}<small> / 3</small></div>${tasks.map(([name,desc,action],i)=>`<div class="quest-item ${flags[i]?'complete':''}"><span class="quest-check">${flags[i]?'✓':i+1}</span><div><h3>${name}</h3><p>${desc}</p>${flags[i]?'':`<button data-quest="${action}">沿着线索出发 →</button>`}</div></div>`).join('')}<div class="bookmarks">收藏的故事 · 所有篇章${eventButtons(allEvents.filter(e=>progress.eventBookmarks.includes(e.id)))}${progress.bookmarks.map(i=>`<button data-stage-jump="${i}">◇ 旧版收藏 · ${chibi.stages[i].label}</button>`).join('')}${!progress.eventBookmarks.length&&!progress.bookmarks.length?'<p>在故事右上角点 ◇，留下下次阅读的线索。</p>':''}</div>`;
}
function renderDetail(){
 if(isPower()){renderPowerDetail();return}
 const s=state.selected;$('#detail').innerHTML=s?.type==='person'?renderPerson(s.id):s?.type==='place'?renderPlace(s.id):s?.type==='region'?renderRegion(s.id):s?.type==='state'?renderState(s.id):state.view==='people'?renderDirectory():state.view==='quest'?renderQuest():renderStory();
 all('#detail [data-event]').forEach(b=>b.addEventListener('click',()=>selectEvent(b.dataset.event)));
 all('#detail [data-person]').forEach(b=>b.addEventListener('click',()=>selectPerson(b.dataset.person)));
 all('#detail [data-detail-place]').forEach(b=>b.addEventListener('click',()=>selectPlace(b.dataset.detailPlace)));
 all('#detail [data-state-detail]').forEach(b=>b.addEventListener('click',()=>{state.selected={type:'state',id:b.dataset.stateDetail};render();revealDetail()}));
 all('#detail [data-region-detail]').forEach(b=>b.addEventListener('click',()=>{state.selected={type:'region',id:b.dataset.regionDetail};render()}));
 all('[data-mode]').forEach(b=>b.addEventListener('click',()=>{state.mode=b.dataset.mode;renderDetail();$(`[data-mode="${state.mode}"]`).focus({preventScroll:true})}));
 $('#back-story')?.addEventListener('click',()=>{if(activePerson()){state.selected={type:'person',id:state.focusPerson};render();revealDetail()}else setView('world')});
 $('#back-directory')?.addEventListener('click',()=>setView('people'));
 all('[data-people-scope]').forEach(b=>b.addEventListener('click',()=>{state.peopleScope=b.dataset.peopleScope;state.factionFilter='all';renderDetail()}));
 all('[data-faction]').forEach(b=>b.addEventListener('click',()=>{state.factionFilter=b.dataset.faction;renderDetail()}));
 all('[data-person-mode]').forEach(b=>b.addEventListener('click',()=>{state.personMode=b.dataset.personMode;render();if(isCareer())fitPerson();else setScope('battle')}));
 all('[data-milestone]').forEach(b=>b.addEventListener('click',()=>selectMilestone(Number(b.dataset.milestone))));
 $('#open-life-reader')?.addEventListener('click',openLifeReader);
 all('#detail [data-life-step]').forEach(b=>b.addEventListener('click',()=>selectMilestone(Number(b.dataset.lifeStep))));
 $('#milestone-map')?.addEventListener('click',()=>{showMobile('map');focusPlace(activeMilestone().place)});
 $('#city-focus')?.addEventListener('click',()=>{showMobile('map');focusPlace(state.selected.id);$('#map-container').scrollIntoView({behavior:'smooth',block:'center'})});
 $('#bookmark')?.addEventListener('click',()=>{const i=progress.eventBookmarks.indexOf(state.event);if(i<0)progress.eventBookmarks.push(state.event);else progress.eventBookmarks.splice(i,1);save();renderDetail();toast(i<0?'故事已记入探索手记':'已取消收藏');$('#bookmark').focus({preventScroll:true})});
 $('#place-compare')?.addEventListener('click',()=>{showMobile('map');state.mapMode='compare';renderMap();focusPlace(state.selected.id);$('#map-container').scrollIntoView({behavior:'smooth',block:'center'})});
 all('[data-stage-jump]').forEach(b=>b.addEventListener('click',()=>selectEvent(chibi.events.find(e=>e.stage===Number(b.dataset.stageJump)).id)));
 all('[data-quest]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.quest==='people')setView('people');if(b.dataset.quest==='chibi')selectPlace('chibi');if(b.dataset.quest==='place')selectPlace(current().location);if(b.dataset.quest==='period-ends')selectEvent(progress.eventsSeen.includes(events[0].id)?events.at(-1).id:events[0].id);if(b.dataset.quest==='compare')setStage(progress.stagesSeen.includes(0)?3:0)}));
}
function render(){
 const e=current(),s=stages[state.stage],phaseEvents=events.filter(e=>e.stage===state.stage);
 document.body.dataset.explorer=state.view;document.body.dataset.period=currentPeriod.id;
 all('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===state.view);b.setAttribute('aria-pressed',String(b.dataset.view===state.view))});
 $('#power-timeline').hidden=!isPower();
 if(isPower()){$('.detail-footer>span:last-child').textContent='山河 · 势力版图';renderMap();renderDetail();return}
 $('#period-list').innerHTML=periods.map(period=>`<button data-period="${period.id}" aria-pressed="${period.id===currentPeriod.id}"><span class="period-number">${String(period.number).padStart(2,'0')}</span><span><strong>${period.title}</strong><small>${period.years} 年 · ${period.events.length} 事</small></span></button>`).join('');
 all('#period-list [data-period]').forEach(b=>b.addEventListener('click',()=>selectPeriod(b.dataset.period)));
 $('.chapter-heading h1').textContent=state.view==='people'?'人物群像':state.view==='quest'?'探索手记':currentPeriod.title;
 $('.chapter-heading').dataset.years=currentPeriod.years+' 年';
 $('.chapter-heading .volume').textContent='卷'+['一','二','三','四'][currentPeriod.number-1];
 $('.chapter-subtitle').textContent=currentPeriod.summary;
 $('.chapter-rule>span:first-child').textContent=isChibi()?'演义第 40—50 回':`${currentPeriod.years} 年 · 史籍主线`;
 $('.detail-footer>span:last-child').textContent='山河 · '+currentPeriod.title;
 $('#catalog-current').textContent=`${eventLabel(e)} · ${e.title}`;
 $('#chapters').innerHTML=stages.map((s,i)=>`<button class="chapter-button ${i===state.stage?'active':''}" data-stage="${i}" aria-current="${i===state.stage?'step':'false'}"><span class="chapter-number">${['一','二','三','四'][i]}</span><span><strong>${s.label}</strong></span></button>`).join('');
 all('[data-stage]').forEach(b=>b.addEventListener('click',()=>setStage(Number(b.dataset.stage))));
 $('#event-list').innerHTML=phaseEvents.map(e=>`<button class="episode-item ${e.id===state.event?'active':''}" data-event="${e.id}" aria-current="${e.id===state.event?'step':'false'}"><span class="episode-dot">${progress.eventsSeen.includes(e.id)?'·':''}</span><span><strong>${e.title}</strong><small>${eventLabel(e)} · ${e.kind}</small></span>${e.id===state.event?'<b>›</b>':''}</button>`).join('');
 all('#event-list [data-event]').forEach(b=>b.addEventListener('click',()=>selectEvent(b.dataset.event,false,false)));
 const list=$('#event-list'),active=list.querySelector('.active');
 if(active&&innerWidth>640){const top=active.offsetTop;if(top<list.scrollTop||top+active.offsetHeight>list.scrollTop+list.clientHeight)list.scrollTop=Math.max(0,top-list.clientHeight/3)}
 if(active&&innerWidth<=640){const left=active.offsetLeft;if(left<list.scrollLeft||left+active.offsetWidth>list.scrollLeft+list.clientWidth)list.scrollLeft=Math.max(0,left-list.clientWidth/3)}
 $('#episode-count').textContent=`${phaseEvents.length} 件事`;$('#content-count').textContent=`${events.length} 事 · ${personIdsInPeriod(currentPeriod).size} 人`;
 $('#people-grid').innerHTML=e.cast.slice(0,6).map(id=>{const p=person(id);return `<button class="person-button ${state.selected?.id===id?'active':''}" data-person="${id}" aria-label="查看${p.name}的视角">${stamp(p)}<span>${p.name}</span></button>`}).join('');
 all('#people-grid [data-person]').forEach(b=>b.addEventListener('click',()=>selectPerson(b.dataset.person)));
 $('#cast-count').textContent=`${e.cast.length} 位 · 点击进入人物线`;
 $('#timeline-labels').innerHTML=stages.map((s,i)=>`<button class="${i===state.stage?'active':''}" data-time="${i}">${s.label}</button>`).join('');
 all('[data-time]').forEach(b=>b.addEventListener('click',()=>setStage(Number(b.dataset.time),true)));
 all('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===state.view);b.setAttribute('aria-pressed',String(b.dataset.view===state.view))});
 $('#time-slider').value=state.stage;$('#time-slider').setAttribute('aria-valuetext',s.label);$('#time-slider').max=stages.length-1;
 $('#map-period').textContent=`${e.dateLabel||'208'} · ${s.label} · ${isChibi()?'小说叙事顺序':'史籍主线'}`;
 $('.year-display strong').textContent=e.year||208;$('.year-display small').textContent=isChibi()?'建安十三年':'东汉末年';
 $('.timeline-bottom>span:first-child').textContent=stages[0].label;$('.timeline-bottom>span:last-child').textContent=stages.at(-1).label;
 $('#scope-battle').textContent=isChibi()?'赤壁战场':'本篇地图';
 $('#map-kicker').textContent=stages[mapPhase()].kicker;$('#map-subtitle').textContent=e.title;
 $('#event-progress').textContent=`故事 ${String(index()+1).padStart(2,'0')} / ${events.length} · ${eventLabel(e)}`;$('#event-now').textContent=e.title;$('#change-text').textContent=e.why;
 $('#previous-event').disabled=index()===0;$('#next-event').disabled=index()===events.length-1;$('#next-stage').disabled=state.stage===stages.length-1;
 $('#quest-badge').textContent=`${questFlags().filter(Boolean).length}/3`;renderMap();renderDetail();
}
function selectEvent(id,fromPlayback=false,scroll=true,keepSelection=false){
 if(isPower())exitPower(false);
 const e=allEvents.find(e=>e.id===id);if(!e)return;if(!fromPlayback)stopPlayback();
 const switched=e.periodId!==currentPeriod.id;if(switched){setActivePeriod(e.periodId);state.scope='battle';keepSelection=false}
 state.event=id;state.stage=e.stage;$('#story-catalog').open=false;
 if(!keepSelection){state.selected=null;state.view='world';state.focusPerson=null}
 state.mode=e.historical?'history':'novel';mark();updateURL();render();
 if(switched)resetCamera();else ensureEventVisible();if(scroll)revealDetail();
}
function selectPeriod(id){const period=getPeriod(id);if(!period)return;selectEvent(progress.periodEvents[id]||period.events[0].id);state.scope='battle';resetCamera();updateURL()}
function setStage(i,keep=false){const e=events.find(e=>e.stage===i);if(e)selectEvent(e.id,false,false,keep)}
function setView(view){
 stopPlayback();closeMapPanels();
 if(view==='power'){
  if(!isPower()){powerReturn={view:state.view,selected:state.selected,focusPerson:state.focusPerson,camera:{...camera},scope:state.scope,mapMode:state.mapMode};state.view='power';state.selected=null;state.focusPerson=null;state.powerFocus=null;state.scope='battle';camera=powerCamera()}
  render();updateCamera();updateURL();showMobile('map');return;
 }
 const restored=isPower()?exitPower(view===powerReturn?.view):false;
 state.view=view;if(!restored){state.selected=null;state.focusPerson=null}
 render();if(view==='people'&&!restored)setScope('national');else updateCamera();updateURL();revealDetail();
}
function revealDetail(){closeMapPanels();showMobile('read');$('.explore-sidebar').scrollTop=0}
function selectPerson(id){
 if(isPower())exitPower(false);
 stopPlayback();
 if(!personIdsInPeriod(currentPeriod).has(id)){const period=periods.find(p=>p.events.some(e=>e.cast.includes(id)));if(period){setActivePeriod(period.id);const event=events.find(e=>e.cast.includes(id));state.event=event.id;state.stage=event.stage;state.mode=event.historical?'history':'novel';mark();updateURL()}}
 state.view='people';state.focusPerson=id;state.personMode=isChibi()?'career':'stories';state.personNode=0;state.selected={type:'person',id};
 if(!progress.visited.includes(id))progress.visited.push(id);save();render();if(isCareer())fitPerson();else setScope('battle');revealDetail();
}
function selectPlace(id){if(isPower()){const region=placeAdmin[id]?.[3];if(region)selectPowerRegion(region);else toast('此地点在当前势力参考图覆盖范围之外');return}if(document.body.classList.contains('map-expanded'))$('#map-expand').click();stopPlayback();state.selected={type:'place',id};if(id==='chibi')progress.placeVisited=true;if(!progress.placesVisited.includes(id))progress.placesVisited.push(id);save();render();revealDetail()}
function stopPlayback(){clearInterval(timer);state.playing=false;$('#play-symbol').textContent='▶';$('#play').setAttribute('aria-label','播放历史进程');$('#play-status').textContent=isChibi()?'按小说事件推进':'按本篇事件推进'}
function startPlayback(){if(index()===events.length-1)selectEvent(events[0].id);state.selected=null;state.view='world';state.playing=true;render();$('#play-symbol').textContent='Ⅱ';$('#play').setAttribute('aria-label','暂停历史进程');$('#play-status').textContent='逐事件重演 · 每件 8 秒';timer=setInterval(()=>{if(index()<events.length-1)selectEvent(events[index()+1].id,true,false);if(index()===events.length-1)stopPlayback()},8000)}
$('#story-catalog').addEventListener('toggle',()=>{if($('#story-catalog').open){const list=$('#event-list'),active=list.querySelector('.active');if(active)list.scrollTop=Math.max(0,active.offsetTop-list.clientHeight/3)}});
$('#play').addEventListener('click',()=>state.playing?stopPlayback():startPlayback());$('#next-stage').addEventListener('click',()=>setStage(Math.min(stages.length-1,state.stage+1)));$('#time-slider').addEventListener('input',e=>setStage(Number(e.target.value),true));
$('#previous-event').addEventListener('click',()=>selectEvent(events[index()-1].id,false,false));$('#next-event').addEventListener('click',()=>selectEvent(events[index()+1].id,false,false));$('#locate-event').addEventListener('click',()=>{showMobile('map');focusPlace(current().location)});
all('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
all('[data-map-mode]').forEach(b=>b.addEventListener('click',()=>{state.mapMode=b.dataset.mapMode;renderMap()}));$('#admin-level').addEventListener('change',e=>{state.level=e.target.value;renderMap()});
for(const [id,key] of [['terrain-toggle','terrain'],['cities-toggle','cities'],['territory-toggle','territories'],['route-toggle','routes']])$('#'+id).addEventListener('click',e=>{state[key]=!state[key];e.currentTarget.setAttribute('aria-pressed',String(state[key]));renderMap()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPlayback()});
function exitPower(restoreSelection){
 const old=powerReturn;powerReturn=null;
 if(old){state.view=old.view;state.scope=old.scope;state.mapMode=old.mapMode;camera={...old.camera};state.selected=restoreSelection?old.selected:null;state.focusPerson=restoreSelection?old.focusPerson:null}
 else{state.view='world';state.selected=null;state.focusPerson=null;state.scope='national';camera=nationalCamera()}
 return Boolean(old&&restoreSelection);
}
function powerCamera(){
 const a=point([92,44]),b=point([130,18]),r=$('#map-container').getBoundingClientRect();
 return {x:(a[0]+b[0])/2,y:(a[1]+b[1])/2,zoom:Math.min(baseWidth()/((b[0]-a[0])*1.12),baseWidth()*r.height/r.width/((b[1]-a[1])*1.15))};
}
function selectPowerRegion(id){
 state.selected={type:'region',id};renderAdmin();renderPowerDetail();
 if(document.body.classList.contains('map-expanded'))$('#map-expand').click();
 revealDetail();$('.power-region-detail')?.scrollIntoView({block:'nearest'});
}
function setPowerYear(value){
 state.powerYear=normalizePowerYear(value);powerSnapshot=getPowerSnapshot(state.powerYear);
 if(state.powerFocus&&!powerSnapshot.counts[state.powerFocus])state.powerFocus=null;
 renderAdmin();renderCities();renderPowerDetail();updateURL();
}
function renderPowerDetail(){
 $('#detail').innerHTML=powerDetail(powerSnapshot,state.selected,state.powerFocus);
 all('[data-power-year]').forEach(b=>b.addEventListener('click',()=>setPowerYear(b.dataset.powerYear)));
 all('[data-power-focus]').forEach(b=>b.addEventListener('click',()=>{state.powerFocus=state.powerFocus===b.dataset.powerFocus?null:b.dataset.powerFocus;state.selected=null;renderAdmin();renderPowerDetail()}));
 all('[data-power-region]').forEach(b=>b.addEventListener('click',()=>{selectPowerRegion(b.dataset.powerRegion);const area=ancientRegions.find(r=>r.id===b.dataset.powerRegion);const [x,y]=point(area.center);camera.x=x;camera.y=y;updateCamera()}));
 $('#clear-power-focus')?.addEventListener('click',()=>{state.powerFocus=null;renderAdmin();renderPowerDetail()});
 $('#clear-power-region')?.addEventListener('click',()=>{state.selected=null;renderAdmin();renderPowerDetail()});
 $('#return-from-power')?.addEventListener('click',()=>setView(powerReturn?.view||'world'));
}
function renderPowerMap(){
 const {year,latest,control}=powerSnapshot,unit=viewport().w/$('#map-container').clientWidth;
 if(powerRenderedYear!==year){
  $('#power-areas').innerHTML=powerAreas(powerSnapshot,geometryPath);powerRenderedYear=year;
  all('[data-power-area]').forEach(el=>activate(el,()=>selectPowerRegion(el.dataset.powerArea)));
 }
 $('#power-contested').setAttribute('patternTransform',`scale(${unit})`);
 all('[data-power-area]').forEach(el=>{
  const c=control[el.dataset.powerArea],matches=!state.powerFocus||c.owner===state.powerFocus||c.contenders.includes(state.powerFocus);
  el.classList.toggle('dimmed',!matches);el.classList.toggle('selected',state.selected?.type==='region'&&el.dataset.powerArea===state.selected.id);
 });
 const boxes=[],v=viewport();
 $('#power-labels').innerHTML=powerLabels(powerSnapshot).map(l=>{
  if(state.powerFocus&&state.powerFocus!==l.id)return '';
  const [x,y]=point(l.center),w=l.name.length*17+18,box={x:x/unit-w/2,y:y/unit-16,w,h:28};
  if(Math.abs(x-camera.x)>v.w/2||Math.abs(y-camera.y)>v.h/2||boxes.some(b=>overlaps(b,box)))return '';boxes.push(box);
  return `<g data-map-power="${l.id}" transform="translate(${x},${y}) scale(${unit})" role="button" tabindex="0" aria-label="突出显示${powerName(l.id,year)}"><text text-anchor="middle" fill="${l.color}">${l.name}</text></g>`;
 }).join('');
 all('[data-map-power]').forEach(el=>activate(el,()=>{state.powerFocus=state.powerFocus===el.dataset.mapPower?null:el.dataset.mapPower;state.selected=null;renderAdmin();renderPowerDetail()}));
 $('#map-period').textContent=`${year} 年末 · 势力概览`;
 $('#map-scope').textContent='群雄消长 · 固定参考地域';$('#map-kicker').textContent=year+' 年';$('#map-subtitle').textContent=latest.title;
 $('#map-reference').hidden=false;$('#scope-battle').textContent='版图全景';
 $('#atlas-status').textContent='势力随年份切换，按参考郡域概括归属；不是逐年精确疆界。地形、城池与现代政区可叠加对照。';
 $('.map-caption>span').textContent='边界底稿 Esiymbro · CC BY-SA 4.0';
 $('#power-year').value=year;$('#power-year').setAttribute('aria-valuetext',year+' 年末，'+latest.title);
 $('#power-year-label').textContent=year;$('#power-prev').disabled=year===POWER_MIN_YEAR;$('#power-next').disabled=year===POWER_MAX_YEAR;
 $('#power-year-status').textContent=latest.year===year?latest.title:`沿用 ${latest.year} 年节点`;
 $('#map-legend').innerHTML='<span><i class="power-hatch"></i>争夺／分治</span><span><i class="pending-key"></i>缺界未绘</span><button id="power-show-legend">势力图例 ↗</button>';
 $('#power-show-legend').addEventListener('click',()=>{if(document.body.classList.contains('map-expanded'))$('#map-expand').click();revealDetail()});
}
$('#power-year').addEventListener('input',e=>setPowerYear(e.target.value));
$('#power-prev').addEventListener('click',()=>{const y=adjacentPowerYear(state.powerYear,-1);if(y!==undefined)setPowerYear(y)});
$('#power-next').addEventListener('click',()=>{const y=adjacentPowerYear(state.powerYear,1);if(y!==undefined)setPowerYear(y)});
function baseWidth(){return Math.max(620,Math.min(1000,$('#map-container').clientWidth*1.23))}
function showMobile(panel){const changed=document.body.dataset.mobilePanel!==panel;document.body.dataset.mobilePanel=panel;if(changed&&matchMedia('(max-width:640px)').matches)window.scrollTo({top:0,behavior:'instant'});all('[data-panel]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.panel===panel)))}
function fitPerson(){const pts=biographies[state.focusPerson].items.filter(m=>m.place).map(m=>point(place(m.place).coord));if(!pts.length){state.scope='national';camera=nationalCamera();updateCamera();return}const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),r=$('#map-container').getBoundingClientRect(),w=Math.max(500,Math.max(...xs)-Math.min(...xs)),h=Math.max(370,Math.max(...ys)-Math.min(...ys));state.scope='person';camera={x:(Math.max(...xs)+Math.min(...xs))/2,y:(Math.max(...ys)+Math.min(...ys))/2,zoom:Math.min(1.5,baseWidth()/(w*1.55),baseWidth()*r.height/r.width/(h*1.65))};updateCamera()}
function selectMilestone(i){
 if(!activePerson()||!biographies[state.focusPerson].items[i])return;
 state.personNode=i;render();const item=activeMilestone();
 if(item.place){const [x,y]=point(place(item.place).coord);camera.x=x;camera.y=y;updateCamera()}
 if($('#life-reader').open){renderLifeReader();$('#reader-title').focus({preventScroll:true})}
 else {const heading=$(`[data-milestone="${i}"]`);heading?.scrollIntoView({block:'nearest'});heading?.focus({preventScroll:true})}
}
function renderCareerMap(){
 if(isPower())return;
 $('#career-markers').innerHTML='';
 if(state.view==='people'&&!activePerson()){$('#routes').innerHTML='';$('#event-marker').innerHTML='';return}
 if(!isCareer())return;
 const p=activePerson(),bio=biographies[p.id],pts=bio.items.filter(m=>m.place).map(m=>place(m.place).coord),unit=viewport().w/$('#map-container').clientWidth;
 $('#routes').innerHTML=pts.length>1?`<path class="route active career-route" d="${path(pts)}" stroke="${factions[p.faction].color}" vector-effect="non-scaling-stroke"/>`:'';
 $('#event-marker').innerHTML='';const selected=activeMilestone();if(selected.place){const [x,y]=point(place(selected.place).coord);$('#event-marker').innerHTML=`<circle cx="${x}" cy="${y}" r="${23*unit}" class="career-halo" stroke="${factions[p.faction].color}"/>`}
 $('#career-markers').innerHTML=bio.items.map((m,i)=>{if(!m.place)return '';const [x,y]=point(place(m.place).coord),active=i===state.personNode,n=bio.items.slice(0,i).filter(item=>item.place===m.place).length;return `<g data-map-milestone="${i}" transform="translate(${x},${y}) scale(${unit})" role="button" tabindex="0" aria-label="${p.name}：${m.when} ${m.title}" class="career-map-node ${active?'active':''}"><circle cx="${17+n*17}" cy="-10" r="8"/><text x="${17+n*17}" y="-7" text-anchor="middle">${i+1}</text></g>`}).join('');
 all('[data-map-milestone]').forEach(b=>activate(b,()=>{selectMilestone(Number(b.dataset.mapMilestone));revealDetail()}));
}
function viewport(){const r=$('#map-container').getBoundingClientRect(),w=baseWidth()/camera.zoom;return {w,h:w*r.height/r.width}}
function updateCamera(){const {w,h}=viewport();$('#history-map').setAttribute('viewBox',`${camera.x-w/2} ${camera.y-h/2} ${w} ${h}`);$('#zoom-in').disabled=camera.zoom>=4;$('#zoom-out').disabled=camera.zoom<=.075;if($('#modern-counties')){renderAdmin();renderCities();renderCareerMap()}}
function nationalCamera(){const a=point([72,55]),b=point([136,17]),r=$('#map-container').getBoundingClientRect();return {x:(a[0]+b[0])/2,y:(a[1]+b[1])/2,zoom:Math.min(baseWidth()/((b[0]-a[0])*1.13),baseWidth()*r.height/r.width/((b[1]-a[1])*1.15))}}
function periodCamera(){
 const ids=[...new Set(events.flatMap(e=>[e.location,...(e.map?.routes||[]).flatMap(route=>route.places)]))],pts=ids.map(id=>point(place(id).coord));
 const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),r=$('#map-container').getBoundingClientRect(),w=Math.max(450,Math.max(...xs)-Math.min(...xs)),h=Math.max(350,Math.max(...ys)-Math.min(...ys));
 return {x:(Math.min(...xs)+Math.max(...xs))/2,y:(Math.min(...ys)+Math.max(...ys))/2,zoom:Math.min(1.35,baseWidth()/(w*1.5),baseWidth()*r.height/r.width/(h*1.55))};
}
function resetCamera(){if(state.scope==='person'&&activePerson()){fitPerson();return}camera=state.scope==='national'?nationalCamera():isPower()?powerCamera():isChibi()?{x:$('#map-container').clientWidth<600?395:455,y:337,zoom:1}:periodCamera();updateCamera()}
function setScope(scope){state.scope=scope;resetCamera();updateURL()}
function focusPlace(id){const [x,y]=point(place(id).coord);state.scope=state.view==='people'?'person':'battle';camera={x,y,zoom:1.8};updateCamera()}
function ensureEventVisible(){if(state.scope==='national')return;const [x,y]=point(place(current().location).coord),{w,h}=viewport();if(Math.abs(x-camera.x)>w*.38||Math.abs(y-camera.y)>h*.36){camera.x=x;camera.y=y;updateCamera()}}
function zoomBy(factor,anchor){const before=viewport(),r=$('#map-container').getBoundingClientRect();const ax=anchor?(anchor.x-r.left)/r.width-.5:0,ay=anchor?(anchor.y-r.top)/r.height-.5:0;const wx=camera.x+ax*before.w,wy=camera.y+ay*before.h;camera.zoom=Math.max(.075,Math.min(4,camera.zoom*factor));const after=viewport();camera.x=wx-ax*after.w;camera.y=wy-ay*after.h;updateCamera()}
$('#scope-national').addEventListener('click',()=>setScope('national'));$('#scope-battle').addEventListener('click',()=>setScope('battle'));
$('#zoom-in').addEventListener('click',()=>zoomBy(1.35));$('#zoom-out').addEventListener('click',()=>zoomBy(1/1.35));$('#zoom-reset').addEventListener('click',resetCamera);
$('#map-expand').addEventListener('click',e=>{closeMapPanels();const expanded=document.body.classList.toggle('map-expanded');e.currentTarget.setAttribute('aria-pressed',String(expanded));e.currentTarget.textContent=expanded?'退出沉浸 ⤡':'沉浸地图 ⤢';if(state.scope==='national')camera=nationalCamera();updateCamera()});
const mapPanelButtons={'map-settings':'map-settings-toggle','timeline-panel':'timeline-toggle'};
function closeMapPanels(){for(const [id,button] of Object.entries(mapPanelButtons)){$('#'+id).hidden=true;$('#'+button).setAttribute('aria-expanded','false')}}
for(const [id,button] of Object.entries(mapPanelButtons))$('#'+button).addEventListener('click',()=>{const open=$('#'+id).hidden;closeMapPanels();$('#'+id).hidden=!open;$('#'+button).setAttribute('aria-expanded',String(open))});
all('[data-close-map-panel]').forEach(b=>b.addEventListener('click',()=>{closeMapPanels();$('#'+mapPanelButtons[b.dataset.closeMapPanel]).focus({preventScroll:true})}));
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.map-settings,.timeline-panel,#map-settings-toggle,#timeline-toggle'))closeMapPanels()});
document.addEventListener('keydown',e=>{if(e.key!=='Escape'||document.querySelector('dialog[open]'))return;const open=Object.keys(mapPanelButtons).find(id=>!$('#'+id).hidden);if(open){closeMapPanels();$('#'+mapPanelButtons[open]).focus({preventScroll:true})}else if(document.body.classList.contains('map-expanded')){$('#map-expand').click();$('#map-expand').focus({preventScroll:true})}});
$('#history-map').addEventListener('wheel',e=>{e.preventDefault();zoomBy(Math.exp(-Math.max(-120,Math.min(120,e.deltaY))*.0025),{x:e.clientX,y:e.clientY})},{passive:false});
$('#history-map').addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('.city,.region-label,.career-map-node,#battle-window'))return;e.preventDefault();dragMoved=false;drag={x:e.clientX,y:e.clientY,cx:camera.x,cy:camera.y};if(!e.target.closest('[data-state-name],[data-power-area],[data-map-power]'))e.currentTarget.setPointerCapture(e.pointerId);e.currentTarget.classList.add('dragging')});
$('#history-map').addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>4){dragMoved=true;e.currentTarget.setPointerCapture(e.pointerId)}const scale=viewport().w/$('#map-container').clientWidth,west=point([65,0])[0],east=point([143,0])[0],north=point([0,60])[1],south=point([0,1])[1];camera.x=Math.max(west,Math.min(east,drag.cx-dx*scale));camera.y=Math.max(north,Math.min(south,drag.cy-dy*scale));updateCamera()});
function endDrag(){drag=null;$('#history-map').classList.remove('dragging');setTimeout(()=>dragMoved=false,0)}
$('#history-map').addEventListener('pointerup',endDrag);$('#history-map').addEventListener('pointercancel',endDrag);
new ResizeObserver(()=>{if(state.scope==='national'&&camera.zoom<.35)camera=nationalCamera();updateCamera()}).observe($('#map-container'));

const entries=[
 ...periods.map(p=>({type:'period',id:p.id,title:p.title,sub:`历史第 ${p.number} 篇 · ${p.years} 年`,search:p.title+p.years+p.summary})),
 ...people.map(p=>({type:'person',id:p.id,title:p.name,sub:`人物 · ${p.zi}`,search:p.name+p.zi})),
 ...places.map(p=>({type:'place',id:p.id,title:p.name,sub:p.modern,search:p.name+p.modern+(placeAdmin[p.id]?.join('')||p.region)})),
 ...allEvents.map(e=>({type:'event',id:e.id,title:e.title,sub:`${getPeriod(e.periodId).title} · ${eventLabel(e)}`,search:e.title+e.summary+(e.historical?e.history:'')})),
 ...states.map(s=>({type:'state',id:s.name,title:s.name,sub:'建安底稿州属 · 非逐年复原',search:s.name+(s.name==='交州'?'交趾部':'')})),
 ...ancientRegions.map(r=>({type:'region',id:r.id,title:r.name,sub:`${r.parent} · ${r.geometryStatus}`,search:r.name+r.parent+r.aliases.join('')})),
 ...periods.flatMap(p=>p.stages.map((s,i)=>({type:'stage',id:p.id+'.'+i,title:s.label,sub:p.title+' · 事件阶段',search:s.label})))
];
function renderSearch(){
 const q=$('#search-input').value.trim().toLowerCase(),suggested=isChibi()?['borrow-arrows','kanze','nanjun','chibi','chain-plan','guanyu-mercy']:[currentPeriod.id,events[0].id,events.at(-1).id,...events[0].cast.slice(0,2)];
 const matches=(q?entries.filter(e=>e.search.toLowerCase().includes(q)):entries.filter(e=>suggested.includes(e.id))).slice(0,30);
 $('#search-results').innerHTML=matches.length?matches.map(e=>`<button class="search-result" data-result="${escape(e.type+':'+e.id)}"><span>${escape(e.title)}</span><small>${escape(e.sub)} ↗</small></button>`).join(''):'<p class="detail-body">已收录内容里还没有找到它。试试人物姓名、字、古今地名或事件。</p>';
 all('[data-result]').forEach(b=>b.addEventListener('click',()=>{
  const [type,id]=b.dataset.result.split(':');$('#search-dialog').close();
  if(type==='person')selectPerson(id);else if(type==='place')selectPlace(id);else if(type==='event')selectEvent(id);else if(type==='period')selectPeriod(id);
  else if(type==='stage'){const [period,i]=id.split('.');selectEvent(getPeriod(period).events.find(e=>e.stage===Number(i)).id)}
  else{stopPlayback();state.selected={type,id};render();const area=type==='state'?states.find(s=>s.name===id):ancientRegions.find(r=>r.id===id),pts=(area.polygons.length?area.polygons.flat(2):[area.center]).map(point),xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),[x,y]=point(area.center),r=$('#map-container').getBoundingClientRect(),w=Math.max(120,Math.max(...xs)-Math.min(...xs)),h=Math.max(120,Math.max(...ys)-Math.min(...ys));state.scope='battle';camera={x,y,zoom:Math.min(2.5,baseWidth()/(w*1.55),baseWidth()*r.height/r.width/(h*1.8))};updateCamera();updateURL();revealDetail()}
 }));
}
function openSearch(){$('#search-dialog').showModal();$('#search-input').value='';renderSearch();$('#search-input').focus()}
$('#search-open').addEventListener('click',openSearch);$('#search-input').addEventListener('input',renderSearch);$('#search-hint').textContent=`全部 ${periods.length} 篇 · ${allEvents.length} 个事件 · ${people.length} 位人物 · ${places.length} 个地点`;
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!document.querySelector('dialog[open]')){e.preventDefault();openSearch()}});
$('#source-links').innerHTML=[...new Map([...Object.values(sources),...allEvents.flatMap(e=>e.references||[])].map(ref=>[ref.url,ref])).values()].concat([...ancientSources,{title:'geoBoundaries · 现代省界 2019 / 县界 2017',url:'https://www.geoboundaries.org/countryDownloads.html'},{title:'Mapzen Terrain Tiles · 现代高程与数据署名',url:'https://registry.opendata.aws/terrain-tiles/'},{title:'Natural Earth · 公有领域自然地理数据',url:'https://www.naturalearthdata.com/about/terms-of-use/'}]).map(s=>`<a href="${s.url}" target="_blank" rel="noopener">${s.title} ↗</a>`).join('');
for(const id of ['about-open','sources-open','map-info','map-reference'])$('#'+id).addEventListener('click',()=>$('#about-dialog').showModal());all('[data-close]').forEach(b=>b.addEventListener('click',()=>$('#'+b.dataset.close).close()));
all('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
$('#reset-progress').addEventListener('click',()=>{Object.assign(progress,blank());save();setActivePeriod('chibi');state.stage=0;state.event=events[0].id;state.selected=null;state.focusPerson=null;state.view='quest';stopPlayback();history.replaceState(null,'',location.pathname);render();$('#about-dialog').close();toast('本地探索记录已清除')});
window.addEventListener('hashchange',()=>{
 const params=new URLSearchParams(location.hash.slice(1)),target=getPeriod(params.get('period'))||chibi;
 if(params.get('mode')==='power'){setView('power');setPowerYear(params.get('year')??229);return}
 const event=allEvents.find(e=>e.id===params.get('event'))||(params.has('stage')?target.events.find(e=>String(e.stage)===params.get('stage')):target.events[0]);
 if(event){selectEvent(event.id,false,false);state.scope=params.get('view')==='national'?'national':'battle';resetCamera();updateURL()}
});
showMobile(isPower()?'map':'read');all('[data-panel]').forEach(b=>b.addEventListener('click',()=>showMobile(b.dataset.panel)));
buildMap();if(!isPower())mark();render();if(isPower())state.scope='battle';resetCamera();
