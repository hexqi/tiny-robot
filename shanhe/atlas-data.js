import {faceRings, dissolveFaces, boundaryArcs, pendingAreas} from './atlas-topology.js';
// Teaching schematics authored for this prototype, NOT digitized historical boundaries.
// Shared Eastern Han reference framework for every period. Geometry is schematic, not a year-by-year jurisdiction reconstruction.
export const ancientSource = {title:'《后汉书》郡国志一至五 · 州郡县参考框架',url:'https://zh.wikisource.org/wiki/後漢書/卷109'};
export const ancientSources = [109,110,111,112,113].map((volume,i)=>({title:`《后汉书》郡国志${['一','二','三','四','五'][i]} · 隶属依据`,url:`https://zh.wikisource.org/wiki/後漢書/卷${volume}`}));
const sourceFor=parent=>ancientSources[parent==='司隶'?0:['豫州','冀州'].includes(parent)?1:['兖州','徐州'].includes(parent)?2:['青州','荆州','扬州'].includes(parent)?3:4];
const region=(id,name,parent,center,note='')=>({id,name,parent,center,ring:faceRings(id)[0],note,source:sourceFor(parent)});
export const ancientRegions = [
  region('nanyang','南阳郡','荆州',[111.95,33.45],'宛、新野属南阳郡。208 年前后曹操分置南乡郡，本层仍以旧郡框架帮助定位。'),
  region('nanjun','南郡','荆州',[110.55,31.15],'襄阳、当阳、江陵在东汉旧南郡框架内。曹操取得荆州后分置襄阳郡；此图不把旧郡轮廓当作 208 年末的精确区划。'),
  region('jiangxia','江夏郡','荆州',[114.25,31.55],'跨汉水、长江沿线的郡。夏口为战略地名，樊口为江口，并不是与江夏郡同级的行政单位。'),
  region('wuling','武陵郡','荆州',[110.25,28.55],'荆州南部诸郡之一；沅水流域构成其重要地理背景。'),
  region('changsha','长沙郡','荆州',[113.1,28.55],'长沙郡不是今天长沙市的同义词。此处只显示郡级概括范围。'),
  region('lingling','零陵郡','荆州',[111.1,26.4],'荆州南部诸郡之一。'),
  region('guiyang','桂阳郡','荆州',[113.6,26.1],'荆州南部诸郡之一，与今天贵州贵阳无关。'),
  region('yingchuan','颍川郡','豫州',[113.6,34.35],'许县属颍川郡。许是汉廷所在之地，不是今天省级区划中的独立区域。'),
  region('runan','汝南郡','豫州',[115,33.1],'汝南处在荆州东北、江淮以北的区域。'),
  region('jiujiang','九江郡','扬州',[117.0,32.7],'汉九江郡主要在淮南，合肥在此框架内；它与今天江西九江市的位置不同。'),
  region('lujiang','庐江郡','扬州',[116.85,30.85],'江淮与长江沿线的重要郡。晚汉分合频繁，所画是地域关系示意。'),
  region('yuzhang','豫章郡','扬州',[115.7,28.2],'柴桑在豫章郡北部的历史框架内。孙权在 208 年分置鄱阳郡等，图层不逐次复原这些调整。'),
  region('danyang','丹阳郡','扬州',[118.55,30.55],'丹阳郡范围远大于今天的丹阳市。'),
  region('wujun-region','吴郡','扬州',[120.45,31.85],'吴县是吴郡的治所；“吴”有县、郡与后来的国号等不同语境。'),
  region('kuaiji','会稽郡','扬州',[120.15,28.7],'会稽郡涵盖今浙江等地的部分区域；不能用今天绍兴市界代替。'),
];
export const states = [
  {name:'荆州',center:[110.1,30.1],color:'#aa854a',regions:['nanyang','nanjun','jiangxia','wuling','changsha','lingling','guiyang']},
  {name:'扬州',center:[118.8,29.35],color:'#548b82',regions:['jiujiang','lujiang','yuzhang','danyang','wujun-region','kuaiji']},
  {name:'豫州',center:[114.8,34.15],color:'#a36b5a',regions:['yingchuan','runan']},
];
export const placeAdmin = {
  xuchang:['豫州','颍川郡','许县','yingchuan'],wancheng:['荆州','南阳郡','宛县','nanyang'],xinye:['荆州','南阳郡','新野县','nanyang'],
  xiangyang:['荆州','南郡（旧属）','襄阳县','nanjun'],changban:['荆州','南郡','当阳县 · 长坂','nanjun'],jiangling:['荆州','南郡','江陵县','nanjun'],
  hankou:['荆州','江夏郡','夏口 · 江口地名','jiangxia'],fankou:['荆州','江夏郡','鄂县附近 · 樊口','jiangxia'],chibi:['荆州','江夏郡附近','赤壁 · 战场定位有争议','jiangxia'],
  chaisang:['扬州','豫章郡','柴桑县','yuzhang'],hefei:['扬州','九江郡','合肥县','jiujiang'],wujun:['扬州','吴郡','吴县','wujun-region'],
  hanjin:['荆州','南郡','汉津 · 渡口示意','nanjun'],huarong:['荆州','南郡','华容县附近 · 路线有争议','nanjun'],wulin:['荆州','南郡附近','乌林 · 曹军驻地示意','nanjun'],
};
export const provinceLabels = [
  ['河南',[113.9,34.85]],['湖北',[112.8,31.0]],['湖南',[111.7,27.6]],['江西',[116.25,27.6]],['安徽',[117.2,32.9]],['江苏',[119.6,33.1]],['浙江',[120.2,28.8]],['福建',[118.2,26.5]],['陕西',[109.7,34.7]],['重庆',[108.5,30.4]],['贵州',[108.6,27.3]],['山东',[118.1,35.5]],['上海',[121.5,31.5]],
];


// Additional metadata for the shared northern and western reference regions.
ancientRegions.push(
  region('henan','河南尹','司隶',[112.55,34.95],'洛阳、荥阳、中牟在河南尹框架内。官渡是中牟附近战场，不是与河南尹同级的行政区。'),
  region('henei','河内郡','司隶',[112.8,35.55],'黄河北岸、太行山以南的郡。不能将今天的黄河河道直接当作汉代郡界。'),
  region('hedong','河东郡','司隶',[111.25,35.65],'汾河下游和黄河东岸的重要地区；献帝东归经过河东，轮廓不复原各次渡河地点。'),
  region('hongnong','弘农郡','司隶',[110.55,34.35],'联系长安、洛阳的关隘与河谷地带，不能以现代市界代替汉代辖境。'),
  region('jingzhao','京兆尹','司隶',[109.05,34.6],'长安在京兆尹内。京兆尹属于三辅，是郡级行政单位；司隶是上一级监察地域。'),
  region('fufeng','右扶风','司隶',[107.45,34.65],'美阳以及五丈原所在方向属于三辅西部。五丈原为地形和战场地名，不是独立郡县。'),
  region('fengyi','左冯翊','司隶',[109.3,35.55],'关中北部与黄河西侧的三辅地域；与京兆尹、右扶风同属司隶框架。'),
  region('chen','陈国','豫州',[114.7,34.05],'东汉郡国体系中的陈国，与“郡”处在同一行政层级；国名不表示当时存在独立割据王国。'),
  region('liang','梁国','豫州',[115.7,34.6],'以睢阳一带为中心的郡级王国，连接兖、豫、徐之间的地域。'),
  region('pei','沛国','豫州',[116.5,33.95],'小沛即沛县，按《郡国志》属豫州沛国。它在徐州争夺故事中反复出现，但不因此自动归为徐州行政区。'),
  region('wei','魏郡','冀州',[114.65,36.8],'邺、黎阳同属魏郡。后来的魏郡扩境及魏国建置不提前套入官渡时期。'),
  region('julu-region','巨鹿郡','冀州',[115.45,37.6],'巨鹿、广宗、下曲阳见《郡国志》巨鹿郡条。下曲阳不是今天保定的曲阳县，巨鹿郡代表点也不是整场黄巾战事的唯一地点。'),
  region('changshan','常山国','冀州',[113.95,38.3],'太行山东麓的郡级王国。此处采用东汉框架，国与郡同层展示。'),
  region('zhongshan','中山国','冀州',[114.95,39.1],'中山国在冀州北部，上曲阳与巨鹿郡的下曲阳需要区分。'),
  region('hejian','河间国','冀州',[116.1,38.7],'《郡国志》易县列河间国，并注明旧属涿郡。易京按易县附近作约位，不直接沿用今天保定易县的位置。'),
  region('bohai','渤海郡','冀州',[117,38.1],'原典亦写作勃海郡，南皮是其属县。这里表示郡级地域，不以现代渤海海岸线推定古海岸。'),
  region('chenliu-region','陈留郡','兖州',[114.65,35.03],'陈留、酸枣属兖州陈留郡。延津和乌巢见酸枣条下注，是渡口、聚落或战场地名；地图不把它们画成独立县。'),
  region('dongjun','东郡','兖州',[115.4,36.05],'濮阳、白马属于东郡。白马与黎阳隔黄河故道相对，后者属冀州魏郡；两者不能合并为一个行政区。'),
  region('jiyin','济阴郡','兖州',[115.85,35.4],'鄄城在东汉济阴郡框架内，曹操与吕布争夺兖州时曾为重要据点。'),
  region('taishan','泰山郡','兖州',[117.25,35.95],'兖州东部的山地与平原相接区域。这里没有把郡的名称等同于今天泰安市界；兖州其他郡国未逐一绘制。'),
  region('pengcheng-region','彭城国','徐州',[117.3,34.55],'彭城国为徐州的郡级单位。彭城县、彭城国和整个徐州属于不同层级。'),
  region('xiapi-region','下邳国','徐州',[118.2,33.65],'下邳国在徐州南部，治所下邳在淮泗流域。吕布、刘备、曹操争夺的城池只是该国辖域中的一个节点。'),
  region('donghai','东海郡','徐州',[118.35,34.95],'徐州东部的郡。范围只表达与下邳、彭城的相对位置，非古海岸复原。'),
  region('pingyuan-region','平原郡','青州',[116.65,37.05],'平原郡属青州；它虽在黄河与河北战争叙事中出现，不能直接按今天省名归入冀州。'),
  region('qi','齐国','青州',[118.35,36.65],'临淄为齐国属县。青州地域横跨今天山东部分地区，图上只细画与已收录地点直接相关的重点郡国。'),
  region('guangyang','广阳郡','幽州',[116.45,40.2],'蓟县在广阳郡框架内，是认识幽州的重要节点；不能把古幽州等同于今天北京市。'),
  region('liaoxi','辽西郡','幽州',[120.15,40.85],'柳城、白狼山按辽西地区约位；东汉边郡省并与乌桓活动范围有变化，不把示意轮廓当作207年的直接控制边界。'),
  region('liaodong','辽东郡','幽州',[123.25,40.7],'襄平属辽东郡。汉末公孙氏在当地经营，郡名与上级框架不意味着当时由曹操直接控制。'),
  region('taiyuan','太原郡','并州',[112,37.9],'晋阳属太原郡。汾河谷地是认识并州的重要地理线索，郡域不是今天太原市界。'),
  region('shangdang','上党郡','并州',[112.75,36.5],'壶关属上党郡。太行山上的关隘联系河北与山西高地，地图仅表达大致区域。'),
  region('hanzhong','汉中郡','益州',[107.2,33.4],'南郑属汉中郡。汉中在东汉旧益州框架内，军政控制需另看事件，不随州名推定。'),
  region('shu','蜀郡','益州',[103.4,30.5],'成都属蜀郡；蜀郡和整个益州不是同一范围。西部山地区域只画概略轮廓。'),
  region('guanghan','广汉郡','益州',[104.7,31.65],'雒县、雒城在广汉郡。雒与洛阳的洛不同，界面保留原有地名区分。'),
  region('ba','巴郡','益州',[107,30.8],'江州、阆中、宕渠、鱼复用东汉旧巴郡框架关联。汉末分巴西、巴东等变化及后来的永安名另看具体年代；此层不逐次复原。'),
  region('wuwei','武威郡','凉州',[102.5,38.25],'姑臧属武威郡。河西走廊的郡域与绿洲分布相联，边地控制不能由行政名称直接推定。'),
  region('dunhuang-region','敦煌郡','凉州',[94.5,40.55],'敦煌郡位于河西走廊西端；西域诸地不是因此自动归入凉州，本图保留独立地名索引。'),
  region('nanhai','南海郡','交趾部',[113.5,23.8],'番禺属南海郡。东汉文献使用交趾刺史部，汉末改称交州的沿革不压成现代广东省界。')
);
const sharedStates=[
 ['司隶',[110.7,35.35],'#9b8056'],
 ['冀州',[115.9,37.9],'#7c845e'],
 ['兖州',[116.5,35.7],'#9b756b'],
 ['徐州',[119,34.8],'#8e9162'],
 ['青州',[119.15,37.2],'#728f83'],
 ['幽州',[117.6,40.55],'#778b98'],
 ['并州',[111.2,39.2],'#9b8764'],
 ['益州',[104.7,28.1],'#73866b'],
 ['凉州',[102,36.5],'#ae9367'],
 ['交趾部',[109,23.4],'#699084']
];
for(const [name,center,color] of sharedStates)states.push({name,center,color,regions:[]});
for(const state of states)state.regions=ancientRegions.filter(r=>r.parent===state.name).map(r=>r.id);
export const pendingRegions=pendingAreas.map(p=>({...p,rings:faceRings(p.id)}));
export const adminBoundaries=boundaryArcs([...ancientRegions,...pendingRegions]);
export const stateRings=states.map(s=>{
 const ids=[...s.regions,...pendingAreas.filter(p=>p.parent===s.name).map(p=>p.id)],rings=dissolveFaces(ids);
 if(rings.length!==1)throw new Error(s.name+' must have one connected state outline');
 return rings[0];
});
const admin=(regionId,label)=>{const r=ancientRegions.find(r=>r.id===regionId);return [r.parent,r.name,label,regionId]};
Object.assign(placeAdmin,{
 guandu:admin('henan','中牟县附近 · 官渡战场'),changan:admin('jingzhao','长安县'),luoyang:admin('henan','雒阳县 · 今写洛阳'),xingyang:admin('henan','荥阳县'),
 meiyang:admin('fufeng','美阳县'),wuzhang:admin('fufeng','五丈原 · 地形与战场'),
 julu:admin('julu-region','巨鹿郡 · 郡级代表点'),guangzong:admin('julu-region','广宗县'),xiaquyang:admin('julu-region','下曲阳县'),ye:admin('wei','邺县'),liyang:admin('wei','黎阳县'),nanpi:admin('bohai','南皮县'),yijing:admin('hejian','易县附近 · 易京'),
 changshe:admin('yingchuan','长社县'),runan:admin('runan','汝南郡 · 区域代表点'),xiaopei:admin('pei','沛县 · 小沛'),
 chenliu:admin('chenliu-region','陈留县'),suanzao:admin('chenliu-region','酸枣县'),yanjin:admin('chenliu-region','酸枣县北 · 延津渡口约位'),wuchao:admin('chenliu-region','酸枣县东 · 乌巢约位'),puyang:admin('dongjun','濮阳县'),baima:admin('dongjun','白马县'),juancheng:admin('jiyin','鄄城县'),
 pengcheng:admin('pengcheng-region','彭城县'),xiapi:admin('xiapi-region','下邳县'),pingyuan:admin('pingyuan-region','平原县'),linzi:admin('qi','临淄县'),
 ji:admin('guangyang','蓟县'),xiangping:admin('liaodong','襄平县'),bailang:admin('liaoxi','白狼山 · 战场区域约位'),liucheng:admin('liaoxi','柳城 · 辽西地区约位'),
 jinyang:admin('taiyuan','晋阳县'),huguan:admin('shangdang','壶关县'),
 shouchun:admin('jiujiang','寿春县'),jianye:admin('danyang','秣陵县'),qua:admin('wujun-region','曲阿县'),ruxu:admin('lujiang','濡须口 · 水口区域约位'),
 yiling:admin('nanjun','夷陵县'),yiyang:admin('changsha','益阳县'),linxiang:admin('changsha','临湘县'),
 chengdu:admin('shu','成都县'),luocheng:admin('guanghan','雒县 · 雒城'),nanzheng:admin('hanzhong','南郑县'),jiangzhou:admin('ba','江州县 · 旧巴郡框架'),langzhong:admin('ba','阆中县 · 旧巴郡框架'),dangqu:admin('ba','宕渠县 · 旧巴郡框架'),yongan:admin('ba','鱼复县 · 后称永安'),
 panyu:admin('nanhai','番禺县'),guzang:admin('wuwei','姑臧县'),dunhuang:admin('dunhuang-region','敦煌县')
});
export const adminExceptions={shule:'西域绿洲地域，不套入东汉州郡县层级。',qiuci:'西域绿洲地域；不是并州上郡的同名龟兹属国。'};
