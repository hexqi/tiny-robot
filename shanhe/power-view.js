import { ancientRegions, pendingRegions } from './reference-atlas.js';
import { powers, powerName, powerSources, powerTimeline, powerMilestones } from './power-data.js';

const refs=ids=>[...new Set(ids)].map(id=>`<a class="source-link" href="${powerSources[id].url}" target="_blank" rel="noopener">${powerSources[id].title} ↗</a>`).join('');
const badge=(id,year)=>`<i style="--power-color:${powers[id]?.color||'#958570'}"></i>${powerName(id,year)}`;
export function powerDetail(snapshot, selected, focus) {
 const {year,latest,control,counts,disputed}=snapshot;
 const chosen=selected?.type==='region'?ancientRegions.find(r=>r.id===selected.id):null;
 const chosenState=selected?.type==='state'?selected.id:null;
 const rows=ancientRegions.filter(r=>chosenState?r.parent===chosenState:focus?control[r.id].owner===focus||control[r.id].contenders.includes(focus):false);
 const c=chosen?control[chosen.id]:null;
 return `<div class="detail-kicker">汉末至三国 <span>184—280 · 年末概览</span></div>
 <div class="power-heading"><h2>${year}<small>年</small></h2><p>${latest.title}</p></div>
 <p class="power-method">色块按固定参考郡域概括主要归属，纹理表示争夺或分治；不是逐年精确疆界。</p>
 <div class="power-jumps" aria-label="关键年份">${powerMilestones.map(y=>`<button data-power-year="${y}" aria-pressed="${y===year}">${y}</button>`).join('')}</div>
 <section class="power-summary"><span>${latest.year===year?'当年节点':`最近收录节点 · ${latest.year} 年`}</span><p>${latest.summary}</p>${latest.year!==year?`<small>${year} 年未另录改变控制区域的节点，沿用 ${latest.year} 年的概览；不表示当年没有战争。</small>`:''}</section>
 <div class="power-section-heading"><h3>势力图例</h3>${focus?'<button id="clear-power-focus">显示全部 ×</button>':''}</div>
 <p class="power-count-note">数字为已绘参考区域数量，不是当年郡数、面积或国力。</p>
 <div class="power-roster">${Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([id,count])=>`<button data-power-focus="${id}" aria-pressed="${focus===id}"><span>${badge(id,year)}</span><small>${count}</small></button>`).join('')}${disputed?`<div class="power-disputed"><span><i class="power-hatch"></i>争夺／分治</span><small>${disputed}</small></div>`:''}</div>
 ${chosen?`<section class="power-region-detail" data-power-region-detail="${chosen.id}"><button id="clear-power-region" class="region-parent">← 返回当年概览</button><span class="detail-section-label">选中地理区域 · ${chosen.parent}</span><h3>${chosen.name}</h3><p class="power-owner">${c.owner==='contested'?'争夺／分治：'+c.contenders.map(id=>powerName(id,year)).join('、'):badge(c.owner,year)}</p><p class="detail-body">${c.note}</p><p class="admin-reference">本条最近控制记录：${c.since} 年。名称与轮廓取固定建安参考图，不表示该郡在 ${year} 年已经同名存在。</p>${chosen.polygons.length?'':`<p class="geometry-note">${chosen.geometryStatus}，只列文字关联，不生成独立色块。</p>`}${refs(c.sourceIds)}</section>`:''}
 ${focus?`<p class="detail-body power-focus-note">${powers[focus].note}</p>`:''}
 ${rows.length?`<section class="power-region-list"><h3>${chosenState||powerName(focus,year)} · 区域索引</h3>${rows.map(r=>`<button data-power-region="${r.id}"><span>${r.name}</span><small>${control[r.id].owner==='contested'?'分治／争夺':r.polygons.length?r.parent:'范围未绘'} →</small></button>`).join('')}</section>`:''}
 <details class="power-evidence"><summary>本阶段史料与地图口径</summary>${refs(latest.sourceIds)}<p>史籍支持政治归属和转折事件，色块是本项目按参考地域作出的概括，并非史籍提供的坐标。未收录的局部割据、短期进退和不同强度的控制仍存在。</p><p>底稿约 219 年，部分州界采用 220 年后安排。14 个缺界郡、2 个侨置标签不生成独立范围；图外未着色不表示无人控制。沿海为现代参考岸线。</p></details>
 <button class="back-button" id="return-from-power">← 返回进入前的阅读</button>`;
}
export function powerAreas(snapshot, geometryPath) {
 return ancientRegions.filter(r=>r.polygons.length).map(r=>{
  const c=snapshot.control[r.id],color=powers[c.owner]?.color||'#b49b76';
  return `<path data-power-area="${r.id}" data-owner="${c.owner}" fill="${c.owner==='contested'?'url(#power-contested)':color}" d="${geometryPath(r.polygons)}" fill-rule="evenodd"><title>${r.name} · ${snapshot.year} 年 · ${powerName(c.owner,snapshot.year)}</title></path>`;
 }).join('')+pendingRegions.map(r=>`<path class="power-unmapped" fill="url(#pending-hatch)" d="${geometryPath(r.polygons)}" pointer-events="none" fill-rule="evenodd"><title>${r.parent} · 原图缺界，保留待考范围</title></path>`).join('');
}
export function powerLabels(snapshot) {
 // Pick a label anchor within an owned reference area, never a centroid in the sea.
 return Object.keys(snapshot.counts).filter(id=>id!=='local'&&id!=='han').map(id=>{
  const regions=ancientRegions.filter(r=>r.polygons.length&&snapshot.control[r.id].owner===id);
  const avg=regions.reduce((a,r)=>[a[0]+r.center[0]/regions.length,a[1]+r.center[1]/regions.length],[0,0]);
  const anchor=regions.reduce((best,r)=>Math.hypot(r.center[0]-avg[0],r.center[1]-avg[1])<Math.hypot(best.center[0]-avg[0],best.center[1]-avg[1])?r:best);
  return {id,center:anchor.center,name:powerName(id,snapshot.year,true),color:powers[id].color,count:regions.length};
 }).sort((a,b)=>b.count-a.count);
}
export function adjacentPowerYear(year,direction) {
 return direction<0?[...powerTimeline].reverse().find(n=>n.year<year)?.year:powerTimeline.find(n=>n.year>year)?.year;
}
