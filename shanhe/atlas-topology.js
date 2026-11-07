// Original teaching geometry, NOT measured historical boundaries.
// One coordinate per vertex. Adjacent faces share vertex IDs; do not maintain separate state outlines.
// Outer face rings are counter-clockwise, holes clockwise. All shared edges are fully noded.
export const atlasVertices = {
  v001: [92.5,39],
  v002: [93.1,41.5],
  v003: [95.5,38.8],
  v004: [95.5,41.4],
  v005: [96.7,40.2],
  v006: [98,41.7],
  v007: [98.5,26],
  v008: [99,37.7],
  v009: [99.6,22.8],
  v010: [100.2,29.5],
  v011: [101.4,36.9],
  v012: [101.5,32],
  v013: [101.5,40.8],
  v014: [101.6,38.9],
  v015: [101.8,29.8],
  v016: [102.4,31.7],
  v017: [102.5,34.5],
  v018: [102.8,22.4],
  v019: [103.2,39.2],
  v020: [103.5,29.2],
  v021: [103.5,32.9],
  v022: [103.6,21],
  v023: [103.7,36.9],
  v024: [103.9,31.1],
  v025: [104.5,33.3],
  v026: [104.5,38.2],
  v027: [104.5,40.5],
  v028: [104.6,30.85],
  v029: [104.7,18.6],
  v030: [104.7,30.1],
  v031: [105.3,31.1],
  v032: [105.5,32.6],
  v033: [105.7,23],
  v034: [106,18],
  v035: [106,28.4],
  v036: [106.2,32],
  v037: [106.45,33.65],
  v038: [106.65,35.5],
  v039: [107,25],
  v040: [107.2,40.5],
  v041: [108,20.5],
  v042: [108.1,35.55],
  v043: [108.1,38.3],
  v044: [108.2,33.55],
  v045: [108.3,29.5],
  v046: [108.3,32],
  v047: [108.35,34.9],
  v048: [108.5,27],
  v049: [109,41.7],
  v050: [109.4,32],
  v051: [109.4,36.7],
  v052: [109.5,34.95],
  v053: [109.9,31.4],
  v054: [109.9,33.7],
  v055: [110,20.6],
  v056: [110,25.2],
  v057: [110.2,29.7],
  v058: [110.25,34.65],
  v059: [110.45,36.5],
  v060: [110.5,33],
  v061: [110.8,26.6],
  v062: [111.2,22.1],
  v063: [111.25,36.75],
  v064: [111.3,34.4],
  v065: [111.3,38.3],
  v066: [111.5,32.55],
  v067: [111.65,35.05],
  v068: [111.7,34.05],
  v069: [111.7,35.7],
  v070: [112,28],
  v071: [112,42],
  v072: [112.1,29.45],
  v073: [112.1,36.3],
  v074: [112.3,38.9],
  v075: [112.4,24.5],
  v076: [112.5,25.2],
  v077: [112.6,32],
  v078: [112.6,35.95],
  v079: [112.7,34.5],
  v080: [112.85,36.8],
  v081: [113.2,26.8],
  v082: [113.2,33.8],
  v083: [113.4,31.3],
  v084: [113.4,35.2],
  v085: [113.4,35.8],
  v086: [113.5,38.8],
  v087: [113.58,29.91],
  v088: [113.6,32.2],
  v089: [113.65,37.5],
  v090: [113.75,36.35],
  v091: [113.8,29.97],
  v092: [114,21.7],
  v093: [114,41.1],
  v094: [114.05,35.4],
  v095: [114.1,33.1],
  v096: [114.12,35.1],
  v097: [114.2,27.5],
  v098: [114.2,35.5],
  v099: [114.25,37],
  v100: [114.3,29.45],
  v101: [114.3,34.8],
  v102: [114.4,37.7],
  v103: [114.5,34.5],
  v104: [114.5,39.05],
  v105: [114.5,39.7],
  v106: [114.55,38.3],
  v107: [114.6,32.4],
  v108: [114.6,33.7],
  v109: [114.6,35.4],
  v110: [114.85,35.65],
  v111: [114.95,38.65],
  v112: [115,34.65],
  v113: [115.2,26.6],
  v114: [115.35,35.05],
  v115: [115.35,35.85],
  v116: [115.35,36.95],
  v117: [115.4,25.2],
  v118: [115.4,29.85],
  v119: [115.5,39.6],
  v120: [115.55,36.35],
  v121: [115.65,34.15],
  v122: [115.65,38.25],
  v123: [115.65,38.8],
  v124: [115.7,31.6],
  v125: [115.75,35.7],
  v126: [115.8,37.4],
  v127: [115.8,40.2],
  v128: [115.9,39.6],
  v129: [116,41.5],
  v130: [116.05,36.7],
  v131: [116.1,30.3],
  v132: [116.2,34],
  v133: [116.2,37.5],
  v134: [116.25,36.1],
  v135: [116.25,40.5],
  v136: [116.3,34.9],
  v137: [116.3,39.5],
  v138: [116.45,34.4],
  v139: [116.5,24.3],
  v140: [116.5,31.5],
  v141: [116.5,32.7],
  v142: [116.5,37.25],
  v143: [116.5,38.1],
  v144: [116.65,34.4],
  v145: [116.65,35.45],
  v146: [116.8,22.8],
  v147: [116.85,35.05],
  v148: [116.85,38.7],
  v149: [117,29.85],
  v150: [117,33.2],
  v151: [117.1,26.2],
  v152: [117.1,39.6],
  v153: [117.15,34.7],
  v154: [117.2,36.55],
  v155: [117.25,37.15],
  v156: [117.25,40.2],
  v157: [117.35,35.25],
  v158: [117.4,37.65],
  v159: [117.5,33.8],
  v160: [117.5,34.85],
  v161: [117.75,34.4],
  v162: [117.8,33.6],
  v163: [117.8,38.6],
  v164: [118,25.2],
  v165: [118,28.7],
  v166: [118,30.6],
  v167: [118.1,35.5],
  v168: [118.1,37.4],
  v169: [118.15,36.35],
  v170: [118.2,31.5],
  v171: [118.6,32.4],
  v172: [118.6,34.55],
  v173: [118.8,41],
  v174: [118.9,36.3],
  v175: [118.9,40.05],
  v176: [119,32.9],
  v177: [119,37.8],
  v178: [119.1,33.85],
  v179: [119.15,37.05],
  v180: [119.2,35.2],
  v181: [119.35,32.2],
  v182: [119.4,39.65],
  v183: [119.6,30.5],
  v184: [119.6,41.8],
  v185: [119.7,34.3],
  v186: [119.7,35.5],
  v187: [120.2,34.1],
  v188: [120.5,26.5],
  v189: [120.5,40.15],
  v190: [120.7,32.5],
  v191: [120.8,37.9],
  v192: [120.8,42],
  v193: [121,30],
  v194: [121,42.5],
  v195: [121.2,40],
  v196: [121.2,41.1],
  v197: [121.7,36.7],
  v198: [121.8,39],
  v199: [122,29.6],
  v200: [122,31.4],
  v201: [122,41.8],
  v202: [122.7,37.3],
  v203: [123.2,39.4],
  v204: [123.3,42.1],
  v205: [124,42.7],
  v206: [124.5,41.7],
  v207: [124.7,40.3],
  v208: [125.2,41.7],
};

export const atlasFaces = {
  'nanyang': [["v060","v066","v077","v088","v095","v082","v079","v068"]],
  'nanjun': [["v053","v057","v072","v087","v091","v083","v088","v077","v066","v060","v054","v050"]],
  'jiangxia': [["v083","v091","v087","v100","v118","v131","v124","v107","v088"]],
  'wuling': [["v048","v061","v070","v072","v057","v053","v045"]],
  'changsha': [["v070","v081","v097","v100","v087","v072"]],
  'lingling': [["v056","v076","v081","v070","v061","v048"]],
  'guiyang': [["v076","v117","v113","v097","v081"]],
  'yingchuan': [["v082","v095","v108","v101","v079"]],
  'runan': [["v095","v088","v107","v124","v141","v132","v121","v108"]],
  'jiujiang': [["v124","v140","v170","v171","v162","v159","v150","v141"]],
  'lujiang': [["v131","v118","v149","v166","v170","v140","v124"]],
  'yuzhang': [["v100","v097","v113","v151","v165","v149","v118"]],
  'danyang': [["v170","v166","v149","v165","v183","v181","v171"]],
  'wujun-region': [["v183","v193","v200","v190","v181"]],
  'kuaiji': [["v165","v151","v164","v188","v199","v193","v183"]],
  'henan': [["v064","v068","v079","v101","v096","v084","v067"]],
  'henei': [["v067","v084","v096","v094","v098","v090","v085","v078","v073","v069"]],
  'hedong': [["v058","v067","v069","v073","v063","v059"]],
  'hongnong': [["v054","v060","v068","v064","v067","v058"]],
  'jingzhao': [["v044","v054","v058","v052","v047"]],
  'fufeng': [["v037","v044","v047","v042","v038"]],
  'fengyi': [["v047","v052","v058","v059","v051","v042"]],
  'chen': [["v108","v121","v112","v103","v101"]],
  'liang': [["v121","v138","v136","v114","v112"]],
  'pei': [["v138","v121","v132","v141","v150","v144","v153","v147","v136"]],
  'wei': [["v098","v110","v120","v116","v099","v090"]],
  'julu-region': [["v099","v116","v126","v122","v106","v102"]],
  'changshan': [["v089","v099","v102","v106","v111","v104","v105","v086"]],
  'zhongshan': [["v104","v111","v106","v122","v123","v119","v105"]],
  'hejian': [["v122","v143","v148","v163","v152","v137","v119","v123"]],
  'bohai': [["v133","v142","v158","v163","v148","v143"]],
  'chenliu-region': [["v101","v103","v112","v114","v109","v094","v096"]],
  'dongjun': [["v094","v109","v114","v115","v125","v134","v130","v120","v110","v098"]],
  'jiyin': [["v114","v136","v145","v134","v125","v115"]],
  'taishan': [["v145","v157","v167","v169","v154","v134"]],
  'pengcheng-region': [["v144","v150","v159","v161","v160","v153"]],
  'xiapi-region': [["v159","v162","v171","v176","v178","v172","v161"]],
  'donghai': [["v161","v172","v185","v180","v167","v157","v160"]],
  'pingyuan-region': [["v130","v134","v154","v155","v142","v133"]],
  'qi': [["v154","v169","v174","v179","v168","v155"]],
  'guangyang': [["v128","v137","v152","v156","v135","v127"]],
  'liaoxi': [["v175","v182","v189","v196","v192","v184","v173"]],
  'liaodong': [["v196","v189","v195","v198","v203","v207","v206","v204","v201"]],
  'taiyuan': [["v063","v073","v080","v089","v086","v074","v065"]],
  'shangdang': [["v073","v078","v085","v090","v099","v089","v080"]],
  'hanzhong': [["v032","v036","v046","v050","v054","v044","v037"]],
  'shu': [["v015","v020","v030","v028","v024","v016"]],
  'guanghan': [["v016","v024","v028","v031","v036","v032","v021"]],
  'ba': [["v030","v035","v045","v053","v050","v046","v036","v031","v028"]],
  'wuwei': [["v011","v023","v026","v019","v014"]],
  'dunhuang-region': [["v001","v003","v005","v004","v002"]],
  'nanhai': [["v092","v146","v139","v117","v075","v062"]],
  'unmapped-ji': [["v116","v120","v130","v133","v143","v122","v126"]],
  'unmapped-yan': [["v136","v147","v153","v160","v157","v145"]],
  'unmapped-xu': [["v167","v180","v185","v172","v178","v176","v171","v181","v190","v187","v186","v174","v169"]],
  'unmapped-qing': [["v142","v155","v168","v179","v174","v186","v197","v202","v191","v177","v158"]],
  'unmapped-you': [["v093","v105","v119","v137","v128","v127","v135","v156","v152","v163","v182","v175","v173","v184","v192","v196","v201","v204","v206","v207","v208","v205","v194","v129"]],
  'unmapped-bing': [["v040","v043","v051","v059","v063","v065","v074","v086","v105","v093","v071","v049"]],
  'unmapped-yi': [["v007","v009","v018","v033","v039","v048","v045","v035","v030","v020","v015","v016","v021","v012","v010"]],
  'unmapped-liang': [["v002","v004","v005","v003","v008","v011","v017","v025","v037","v038","v042","v051","v043","v040","v027","v013","v006"],["v011","v014","v019","v026","v023"]],
  'unmapped-jiao': [["v018","v022","v029","v034","v041","v055","v092","v062","v075","v117","v076","v056","v048","v039","v033"]],
};

// Known state membership; the finer commandery boundaries have not been drawn here.
export const pendingAreas = [
  {
    "id": "unmapped-ji",
    "parent": "冀州"
  },
  {
    "id": "unmapped-yan",
    "parent": "兖州"
  },
  {
    "id": "unmapped-xu",
    "parent": "徐州"
  },
  {
    "id": "unmapped-qing",
    "parent": "青州"
  },
  {
    "id": "unmapped-you",
    "parent": "幽州"
  },
  {
    "id": "unmapped-bing",
    "parent": "并州"
  },
  {
    "id": "unmapped-yi",
    "parent": "益州"
  },
  {
    "id": "unmapped-liang",
    "parent": "凉州"
  },
  {
    "id": "unmapped-jiao",
    "parent": "交趾部"
  }
];

export function faceRings(id){
 const rings=atlasFaces[id];if(!rings)throw new Error('Unknown atlas face: '+id);
 return rings.map(r=>r.map(id=>{const p=atlasVertices[id];if(!p)throw new Error('Unknown atlas vertex: '+id);return p}));
}

// Draw each shared edge once. Join consecutive edges with the same two owners
// so a dashed commandery boundary keeps its phase through intermediate vertices.
export function boundaryArcs(faces){
 const edges=new Map(),groups=new Map(),arcs=[];
 const key=(a,b)=>[a,b].sort().join(':');
 for(const face of faces)for(const ring of atlasFaces[face.id])for(let i=0;i<ring.length;i++){
  const a=ring[i],b=ring[(i+1)%ring.length],id=key(a,b);
  if(!edges.has(id))edges.set(id,{a,b,owners:[]});
  edges.get(id).owners.push(face);
 }
 for(const edge of edges.values()){
  const id=edge.owners.map(f=>f.id).sort().join('|');
  if(!groups.has(id))groups.set(id,[]);groups.get(id).push(edge);
 }
 for(const group of groups.values()){
  const adjacent=new Map(),remaining=new Set(group.map(e=>key(e.a,e.b))),owners=group[0].owners;
  for(const {a,b} of group){
   if(!adjacent.has(a))adjacent.set(a,[]);if(!adjacent.has(b))adjacent.set(b,[]);
   adjacent.get(a).push(b);adjacent.get(b).push(a);
  }
  while(remaining.size){
   const endpoint=[...adjacent].find(([a,neighbors])=>neighbors.filter(b=>remaining.has(key(a,b))).length===1);
   let vertex=endpoint?.[0]||remaining.values().next().value.split(':')[0];
   const points=[atlasVertices[vertex]];
   while(true){
    const next=adjacent.get(vertex).find(b=>remaining.has(key(vertex,b)));if(!next)break;
    remaining.delete(key(vertex,next));points.push(atlasVertices[next]);vertex=next;
   }
   const states=[...new Set(owners.map(f=>f.parent))];
   arcs.push({id:'boundary-'+arcs.length,kind:owners.length===1||states.length>1?'state':'region',faces:owners.map(f=>f.id),states,points});
  }
 }
 return arcs;
}

// Cancel opposite half-edges. The remaining edges are the outline of the parent state.
export function dissolveFaces(ids){
 const edges=new Map();
 for(const id of ids)for(const ring of atlasFaces[id])for(let i=0;i<ring.length;i++){
  const a=ring[i],b=ring[(i+1)%ring.length],key=a+'>'+b,reverse=b+'>'+a;
  if(edges.has(reverse))edges.delete(reverse);else {if(edges.has(key))throw new Error('Duplicate directed boundary: '+key);edges.set(key,[a,b])}
 }
 const next=new Map();for(const [a,b] of edges.values()){if(next.has(a))throw new Error('Non-manifold state boundary: '+a);next.set(a,b)}
 const rings=[];
 while(next.size){
  const start=next.keys().next().value,ring=[];let current=start;
  do {ring.push(atlasVertices[current]);const target=next.get(current);if(!target)throw new Error('Open state boundary: '+current);next.delete(current);current=target}while(current!==start);
  rings.push(ring);
 }
 return rings;
}
