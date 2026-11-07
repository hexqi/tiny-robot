import { ancientRegions } from './reference-atlas.js';

// Geographic reading model, not year-by-year administrative GIS. The fixed
// reference areas are used even before their names/units existed. Each rule
// records an interpretation of the cited narrative, not a sourced polygon.
export const POWER_MIN_YEAR = 184, POWER_MAX_YEAR = 280;
export const powerSources = {
  ling: {title:'《后汉书》孝灵帝纪',url:'https://zh.wikisource.org/wiki/後漢書/卷8'},
  han: {title:'《后汉书》孝献帝纪',url:'https://zh.wikisource.org/wiki/後漢書/卷9'},
  cao: {title:'《三国志》武帝纪',url:'https://zh.wikisource.org/wiki/三國志/卷01'},
  yuan: {title:'《三国志》董卓、袁绍、袁术传',url:'https://zh.wikisource.org/wiki/三國志/卷06'},
  north: {title:'《三国志》公孙瓒、公孙度、陶谦、张绣、张鲁传',url:'https://zh.wikisource.org/wiki/三國志/卷08'},
  lubu: {title:'《三国志》吕布传',url:'https://zh.wikisource.org/wiki/三國志/卷07'},
  yi: {title:'《三国志》刘焉、刘璋传',url:'https://zh.wikisource.org/wiki/三國志/卷31'},
  liu: {title:'《三国志》先主传',url:'https://zh.wikisource.org/wiki/三國志/卷32'},
  eastHan: {title:'《三国志》刘封传及注引《魏略》',url:'https://zh.wikisource.org/wiki/三國志/卷40'},
  shu: {title:'《三国志》后主传',url:'https://zh.wikisource.org/wiki/三國志/卷33'},
  sunce: {title:'《三国志》孙坚、孙策传',url:'https://zh.wikisource.org/wiki/三國志/卷46'},
  sun: {title:'《三国志》吴主传',url:'https://zh.wikisource.org/wiki/三國志/卷47'},
  wu: {title:'《三国志》三嗣主传',url:'https://zh.wikisource.org/wiki/三國志/卷48'},
  shi: {title:'《三国志》士燮传',url:'https://zh.wikisource.org/wiki/三國志/卷49'},
  rebellion: {title:'《三国志》毌丘俭、诸葛诞传',url:'https://zh.wikisource.org/wiki/三國志/卷28'},
  wei: {title:'《三国志》文帝纪',url:'https://zh.wikisource.org/wiki/三國志/卷02'},
  sima: {title:'《晋书》宣帝纪',url:'https://zh.wikisource.org/wiki/晉書/卷001'},
  jin: {title:'《晋书》武帝纪',url:'https://zh.wikisource.org/wiki/晉書/卷003'},
};
export const powers = {
  han:{color:'#939c89',name:()=> '汉廷及州郡官府',short:()=> '汉廷／官府',note:'官府体系的合并阅读类别，不表示汉廷对各地保持同等实际控制。'},
  local:{color:'#a58d78',name:()=> '地方诸部',short:()=> '地方诸部',note:'多支地方势力的合并标记，不是一个统一政权；未细分的控制关系保留不确定性。'},
  dong:{color:'#916a98',name:y=>y<192?'董卓集团':'李傕、郭汜集团',short:y=>y<192?'董卓':'李傕、郭汜',note:'关中与汉廷所在地域的概括，内部冲突、城池易手不等于整郡连续控制。'},
  cao:{color:'#557fac',name:y=>y<220?'曹操集团':'曹魏',short:y=>y<220?'曹操':'魏',note:'220 年起称魏；司马氏执政仍标曹魏，至 265 年才改为西晋。'},
  liu:{color:'#5d956c',name:y=>y<221?'刘备集团':'蜀汉',short:y=>y<221?'刘备':'蜀',note:'221 年起标为蜀汉；归属随实际割据阶段呈现，不把依附时期当成独占大范围领土。'},
  sun:{color:'#c66b53',name:y=>y<200?'孙策集团':y<229?'孙权集团':'孙吴',short:y=>y<200?'孙策':y<229?'孙权':'吴',note:'孙氏在江东的控制逐步形成；山区、江北及荆州分治另作说明，229 年起标为孙吴。'},
  jin:{color:'#8a72b3',name:()=> '西晋',short:()=> '晋',note:'265 年晋代魏；280 年平吴。只着色本参考图覆盖的区域，不代表现代国界或所有边疆。'},
  yuan:{color:'#c39a45',name:y=>y<202?'袁绍集团':'袁氏诸子',short:y=>y<202?'袁绍':'袁氏',note:'河北袁氏势力的合并概览，袁谭、袁尚等内部争夺在节点说明中保留。'},
  yuanshu:{color:'#bb7e3f',name:()=> '袁术集团',short:()=> '袁术',note:'南阳与淮南分别在不同阶段出现，不能把袁术曾经活动过的地方同时涂色。'},
  gongsun:{color:'#7a99a4',name:()=> '公孙瓒集团',short:()=> '公孙瓒',note:'幽州西部的主要军政集团；与刘虞旧部、乌桓等的争夺不作精确战线复原。'},
  liaodong:{color:'#a97773',name:y=>y<204?'公孙度集团':y<221?'公孙康集团':y<228?'公孙恭集团':'公孙渊集团',short:()=> '辽东公孙氏',note:'与公孙瓒分别呈现；乐浪、带方及玄菟只提供文字关联，不伪造缺失的独立郡面。'},
  liubiao:{color:'#9a9861',name:()=> '刘表集团',short:()=> '刘表',note:'荆州的区域概括，江夏、南阳及各地豪强不是同一强度的控制。'},
  yi:{color:'#6f9e92',name:y=>y<194?'刘焉集团':'刘璋集团',short:y=>y<194?'刘焉':'刘璋',note:'益州刘氏的概括范围；南中地方社会及张鲁据汉中另列。'},
  zhanglu:{color:'#a58c59',name:()=> '张鲁集团',short:()=> '张鲁',note:'以汉中为核心；东部申氏等地方势力另列，不以原汉中行政关联推定张鲁全部直辖。'},
  zhangxiu:{color:'#af7b65',name:()=> '张绣集团',short:()=> '张绣',note:'宛城周围的独立军事集团，与刘表有联系；色块是据点周边地域概括。'},
  taoqian:{color:'#a18aad',name:()=> '陶谦集团',short:()=> '陶谦',note:'徐州的概括分组，北部边缘战事未还原到逐县。'},
  lubu:{color:'#b486a0',name:()=> '吕布集团',short:()=> '吕布',note:'兖州争夺与徐州占据分开记录，不把一次军事行动等同永久领土。'},
  hanfu:{color:'#b39c72',name:()=> '韩馥集团',short:()=> '韩馥',note:'191 年让冀州于袁绍；渤海的袁绍据点另列。'},
  liuyu:{color:'#819bb1',name:()=> '刘虞集团',short:()=> '刘虞',note:'幽州州牧的地域概括，不等同每支边地军队的实际控制。'},
  liudai:{color:'#918b70',name:()=> '刘岱等兖州官府',short:()=> '刘岱',note:'兖州官府的合并阅读分组；曹操据东郡后单独列出。'},
  kongrong:{color:'#b79587',name:()=> '孔融集团',short:()=> '孔融',note:'以北海为主要地理参照，黄巾及周边势力交错不等于全郡均一控制。'},
  shi:{color:'#6c999c',name:()=> '士燮等交州地方势力',short:()=> '士燮等',note:'士氏、各郡地方官及其归附关系的概括，210 年后承认孙权权威，226 年后改列孙氏直接统辖。'},
  rebel:{color:'#bb8c55',name:()=> '诸葛诞及援军',short:()=> '诸葛诞',note:'只在 257 年寿春争夺中列作参与方，不将淮南全部判给叛军。'},
};
const list=s=>s.trim().split(/\s+/).filter(Boolean);
const byState=(...names)=>ancientRegions.filter(r=>names.includes(r.parent)).map(r=>r.id);
const allIds=ancientRegions.map(r=>r.id);
const westYou=list('shanggu yuyang liaoxi dai youbeiping guangyang zhuo');
const eastYou=list('liaodong xuantu liaodong-dependent lelang daifang');
const threeFu=list('jingzhao fufeng fengyi');
const westLong=list('anding beidi hanyang hanxing longxi wudu');
const hanZhong=list('hanzhong xicheng shangyong fangling');
const southJing=list('wuling changsha lingling guiyang');
const southYi=list('zhuti yuesui zangke yizhou-jun yongchang');
const southYang=list('danyang wujun-region kuaiji yuzhang poyang luling xindu-yang linchuan-danyang');
const lowerJiao=list('jiaozhi jiuzhen rinan');
const assign=(owner,regions,note='')=>({owner,regions:typeof regions==='string'?list(regions):regions,note});
const dispute=(contenders,regions,note)=>({...assign('contested',regions,note),contenders});
const node=(year,title,summary,sourceIds,changes=[])=>({year,title,summary,sourceIds,changes});
export const powerTimeline = [
  node(184,'黄巾之后，汉廷未解危局','以年末为观察点：黄巾主力已遭镇压，州郡官府仍在，西北出现叛乱。官府合色不代表朝廷实际掌控程度一致。',['ling','cao'],[
    assign('han',allIds),dispute(['han','local'],'jincheng','凉州叛乱起于金城等地；只示相关区域，非完整叛军边界。')]),
  node(188,'州牧兴起','刘焉入益州。西北和边地控制逐渐地方化；晚设郡域只用作地理参照。',['yi','cao'],[
    assign('yi',byState('益州')),assign('local',[...byState('凉州'),...westLong],'西北多支军政势力概括，不能解读为同属一个政权。')]),
  node(189,'董卓入洛阳','汉廷控制权落入董卓之手；关中、洛阳与州郡之间开始分裂。',['han','yuan'],[
    assign('dong',[...byState('司隶'),...threeFu])]),
  node(190,'关东起兵，群雄分据','讨董联盟并非一个统一国家。这里分别展示主要军政集团的区域概览；交州等地方控制仍粗略分组。',['yuan','north','yi','shi'],[
    assign('hanfu',byState('冀州')),assign('yuan','bohai'),assign('liuyu',westYou),assign('liaodong',eastYou),
    assign('liudai',byState('兖州')),assign('taoqian',byState('徐州')),assign('kongrong','beihai'),
    assign('liubiao',byState('荆州').filter(id=>!hanZhong.includes(id))),assign('yuanshu','nanyang nanxiang'),assign('liubiao','qichun'),
    assign('shi',byState('交州'),'交州内部有不同地方官与军政关系，士氏并非独占全州。')]),
  node(191,'袁绍入冀州，张鲁据汉中','袁绍取得冀州主导权；曹操据东郡。张鲁在汉中形成独立势力，时间与范围采用概括节点。',['cao','yuan','north','eastHan'],[
    assign('yuan',byState('冀州')),assign('cao','dongjun'),assign('zhanglu','hanzhong'),
    assign('local','xicheng shangyong fangling','东汉末申氏等地方势力与张鲁、曹方的关系交错；按地方控制保留，起始年为概览节点，不表示各地同时独立。'),
    dispute(['yuan','gongsun'],'hejian anping pingyuan-region','公孙瓒与袁绍争夺，不能视为任何一方完整独占。')]),
  node(192,'曹操领兖州','曹操接掌兖州，青州黄巾降附；不因此将整个青州涂为曹操。董卓死后，关中转由李傕、郭汜等掌握。',['cao','yuan'],[
    assign('cao',byState('兖州'))]),
  node(193,'幽州与淮南重组','公孙瓒杀刘虞，幽州仍有反对势力；袁术转入淮南。南阳暂列刘表影响下的地域参照。',['north','yuan','cao'],[
    assign('gongsun',westYou),assign('yuanshu','jiujiang lujiang'),assign('liubiao','nanyang nanxiang')]),
  node(194,'兖州争夺，刘备领徐州','吕布入兖州，曹操仍保有鄄城等据点，故整片标争夺。陶谦死后刘备领徐州；益州刘焉死，刘璋继任。',['cao','lubu','liu','yi'],[
    dispute(['cao','lubu'],byState('兖州'),'曹操与吕布交战，少数保留城池不足以定义整郡分界。'),assign('liu',byState('徐州'))]),
  node(195,'曹操复兖州，孙策渡江','曹操收复兖州；孙策开始经营江东。江南山区与地方势力仍需逐步整合。',['cao','sunce'],[
    assign('cao',byState('兖州')),assign('sun','danyang wujun-region linchuan-danyang xindu-yang'),
    assign('han','henan henei hedong','献帝东归，沿途诸将与官府并立，未统一归入曹操。')]),
  node(196,'迎帝都许，吕布据徐州','曹操迎汉帝到许，吕布夺徐州；孙策扩展会稽。青州袁氏、孔融及地方势力的消长按此节点概括。',['cao','lubu','sunce','yuan'],[
    assign('cao',byState('豫州')),assign('cao','henan henei'),assign('lubu',byState('徐州')),
    assign('yuan',byState('青州')),assign('sun','kuaiji'),assign('zhangxiu','nanyang nanxiang')]),
  node(197,'袁术称帝','称帝改变政治关系，没有自动生成更大的疆土；淮南与江东仍分别呈现。',['yuan','cao']),
  node(198,'下邳之战','吕布败亡，徐州转入曹操势力。关中的原李傕集团瓦解，曹操以官府与驻军逐步经营三辅。',['cao','lubu'],[
    assign('cao',byState('徐州')),assign('cao',[...threeFu,...byState('司隶')])]),
  node(199,'袁绍灭公孙瓒，袁术败亡','河北袁氏扩展；孙策向庐江、豫章发展。刘备年末重新据徐州部分地区，不能把整个徐州同时判给他。',['cao','yuan','liu','sunce'],[
    assign('yuan',westYou),assign('yuan',byState('冀州')),assign('yuan',byState('并州')),
    assign('cao','nanyang nanxiang jiujiang'),assign('sun',southYang),assign('liu','xiapi-region pengcheng-region'),
    dispute(['cao','sun'],'lujiang','皖城、江北与沿江据点多方交错；不以郡名划出精确分治线。')]),
  node(200,'官渡胜负，河北尚在袁氏手中','曹操击败袁绍，但并未立即取得整个河北；地图保留袁氏地区，避免把战役胜利等同吞并。',['cao','yuan','liu'],[
    assign('cao',byState('徐州'))]),
  node(202,'袁氏继承与内战','袁绍死后诸子相争，图上以袁氏合并分组，局部内战不伪装为精确分界。',['yuan','cao']),
  node(204,'曹操攻取邺城','冀州南部转入曹操势力，北部与袁谭地区仍待整合。',['cao'],[
    assign('cao','wei zhao ganling julu-region')]),
  node(205,'冀青整合','曹操击败袁谭并进一步控制冀、青；这是阶段性地域概览。',['cao'],[
    assign('cao',[...byState('冀州'),...byState('青州')])]),
  node(206,'高干败亡','并州高干反曹后被平定，相关区域改列曹操。',['cao'],[assign('cao',byState('并州'))]),
  node(207,'北征乌桓','曹操平定乌桓、袁氏余部；辽东公孙氏保持自己的军政体系，未在此时并入曹操。',['cao','north'],[assign('cao',westYou)]),
  node(208,'赤壁之后，荆州分裂','刘表死、曹操南下，孙刘联盟在赤壁获胜。南郡与江夏控制交错，荆南归附进程跨年，按争夺／过渡呈现。',['cao','liu','sun'],[
    assign('cao','nanyang nanxiang xiangyang-region zhangling qichun'),
    dispute(['cao','sun','liu'],'nanjun yidu','赤壁后江陵攻守仍未结束，不提前涂成刘备全部占据。'),
    dispute(['cao','sun','liu'],'jiangxia','江夏出现不同阵营的分治，本郡参考面不等于任何一方完整辖境。'),
    dispute(['liu','local'],southJing,'刘备南征、地方太守归附跨越赤壁前后，年末以过渡区表达。')]),
  node(209,'荆南归附，周瑜据江陵','刘备取得荆南四郡，周瑜攻取江陵。南郡与宜都采用地域概括，不画借地谈判中的逐县范围。',['liu','sun'],[
    assign('liu',southJing),assign('sun','nanjun'),assign('liu','yidu')]),
  node(210,'刘备经营南郡','南郡转由刘备经营。交州士氏承认孙权权威，仍保留地方势力色块，区分归附与直接统辖。',['liu','sun','shi'],[
    assign('liu','nanjun'),assign('shi',byState('交州'),'士燮等归附孙权，但地方统治仍由士氏及当地官府经营。')]),
  node(211,'潼关之战','曹操击败关中联军，三辅与安定控制加强；陇右、西北仍有地方军与后续战事。',['cao'],[
    assign('cao',[...threeFu,'anding'])]),
  node(213,'陇右反复','马超与曹军、地方势力在陇右反复争战，用争夺区表达，不将短期攻城视为全年独占。',['cao','north'],[
    dispute(['cao','local'],'hanyang hanxing longxi wudu','陇右各地归附与反攻并不同时，按相关地域概括。')]),
  node(214,'刘备入成都','刘备取得益州，曹军继续平定陇右与河西；汉中仍由张鲁掌握。',['liu','yi','cao'],[
    assign('liu',byState('益州').filter(id=>id!=='hanzhong')),assign('cao',[...byState('凉州'),...westLong,'yinping'])]),
  node(215,'汉中易手，湘水划分','曹操取得汉中；孙刘议和分荆州，长沙、桂阳等归孙权，南郡、武陵、零陵归刘备。江夏和庐江仍按分治处理。',['cao','liu','sun'],[
    assign('cao',hanZhong),assign('sun','changsha guiyang'),
    dispute(['cao','sun'],'jiangxia','孙刘划分不意味着曹方江夏据点同时消失，故不整郡判给孙权。')]),
  node(219,'刘备得汉中，孙权取荆州','刘备取得汉中并扩展上庸方向；孙权袭取关羽控制的荆州地区，北方襄樊仍属曹方。',['liu','sun','cao','eastHan'],[
    assign('liu',hanZhong),assign('sun','nanjun yidu wuling lingling')]),
  node(220,'魏代汉','曹丕建立魏。孟达归魏，上庸等东部地域转属魏；刘备与孙权仍是独立军政集团。',['wei','liu','eastHan'],[
    assign('cao','xicheng shangyong fangling')]),
  node(221,'蜀汉建立','刘备称帝。蜀汉与孙权交战，但出兵路线不直接扩成永久领土。',['liu']),
  node(222,'夷陵之后','刘备败退，孙权保有荆州主要既得地区；孙权此前受魏封爵，不等于江东成为魏的直接辖境。',['liu','sun']),
  node(223,'蕲春与南中','孙权部攻取蕲春；蜀汉南中出现叛乱与地方对抗，不能画成均一稳定的蜀汉控制区。',['sun','shu'],[
    assign('sun','qichun'),dispute(['liu','local'],southYi,'南中各地反叛、归附与地方势力并存；永昌等地情况不同，合并为不均一控制区。')]),
  node(225,'诸葛亮南征','南中重新纳入蜀汉政治体系；色块表示主要归属，不等于每处山地都有相同强度的驻军控制。',['shu'],[assign('liu',southYi)]),
  node(226,'孙氏接管交州','士燮死后，孙权通过吕岱等重组交州统治；主色改为孙氏，地方冲突另见原典。',['shi','sun'],[assign('sun',byState('交州'))]),
  node(228,'北伐陇右','蜀汉首次北伐引发陇右响应，随后退军。年末概览不把短暂响应画成持续吞并。',['shu']),
  node(229,'三国鼎立，蜀得武都阴平','孙权称帝；蜀汉取得武都、阴平，北部边缘出现实际变化。',['shu','sun'],[assign('liu','wudu yinping')]),
  node(234,'五丈原之后','诸葛亮北伐结束，魏蜀吴长期对峙。没有收录控制变化的年份沿用最近节点，不表示边境从无交战。',['shu']),
  node(238,'辽东归魏','司马懿平公孙渊，辽东公孙氏政权终结。原图未闭合的乐浪、带方仍不伪造郡域。',['north'],[assign('cao',eastYou)]),
  node(249,'高平陵政变','司马氏掌握魏国中枢，国号仍为魏；不在此时提前涂成西晋。',['sima']),
  node(257,'寿春之围','诸葛诞起兵，吴军参与，寿春周边标为争夺；不把整个淮南判给叛军。',['rebellion'],[
    dispute(['cao','rebel','sun'],'jiujiang','寿春围城期间，魏军与诸葛诞、吴援军对抗；该纹理表示相关地域而非全郡易主。')]),
  node(258,'寿春平定','诸葛诞败亡，九江参考地域恢复为魏方；吴在江北的复杂据点仍按庐江分治表达。',['rebellion'],[assign('cao','jiujiang')]),
  node(263,'蜀汉灭亡','魏军灭蜀；交趾等地发生反吴并向魏靠拢的变动，南方暂列过渡区。',['shu','wu'],[
    assign('cao',[...byState('益州'),'wudu']),dispute(['cao','sun','local'],lowerJiao,'交趾叛吴归魏及九真、日南响应的过程采用阶段概括，次年建立魏方节点。')]),
  node(264,'魏守巴东，交趾易帜','罗宪守永安抵御吴军，魏取得蜀地后的边界并未立即被吴改写；交趾方向转为魏方。',['wu'],[
    assign('cao',lowerJiao,'按交趾等地归魏的区域概览，远方实际控制与当地力量仍有差异。')]),
  node(265,'西晋代魏','司马炎建立晋，魏方原有地域转为西晋；孙吴继续存在。',['jin']),
  node(270,'西北再起战事','西北出现持续反抗与争战，金城、河西相关地域用纹理概括，不外推到整个凉州或关中。',['jin'],[
    dispute(['jin','local'],'jincheng xiping wuwei','西北战争涉及不同部众及城池，参考郡域仅标相关区域。')]),
  node(271,'吴收复交趾','吴军重新取得交趾等地，结束魏晋在该方向的阶段性控制。',['wu'],[assign('sun',lowerJiao)]),
  node(272,'西陵之战','步阐降晋后，陆抗平定西陵。年末仍以吴方呈现宜都相关地域，不把短期投降视为全年晋境。',['wu']),
  node(279,'晋军准备南下','晋平西北叛乱后大举伐吴；年末保留吴方主要范围；南海、苍梧另有郭马叛乱。翌年按平吴的政治归属切换。',['jin','wu'],[
    assign('jin','jincheng xiping wuwei'),dispute(['sun','local'],'nanhai cangwu','郭马起兵波及南海、苍梧等地；只标相关地域，非精确叛军范围。')]),
  node(280,'晋灭吴，三国归一','孙皓投降，三国对峙结束。统一只在本参考图覆盖区域着色，图外边疆与未绘区域不据此判断。',['jin','wu'],[
    assign('jin',allIds,'按晋接收吴旧境后的主要政治归属概括；郭马余部等地方实际控制与安抚过程未完整复原。')]),
];
export const powerMilestones = [184,190,200,208,214,219,220,229,238,263,265,280];
export const powerName=(id,year,short=false)=>id==='contested'?'争夺／分治':powers[id][short?'short':'name'](year);
export function normalizePowerYear(value) {
  const n=Number(value);return Number.isFinite(n)?Math.max(POWER_MIN_YEAR,Math.min(POWER_MAX_YEAR,Math.round(n))):208;
}
export function getPowerSnapshot(value) {
  const year=normalizePowerYear(value),control={};let latest;
  for(const item of powerTimeline){
    if(item.year>year)break;latest=item;
    for(const change of item.changes)for(const id of change.regions)control[id]={owner:change.owner,contenders:change.contenders||[],since:item.year,note:change.note||item.summary,sourceIds:item.sourceIds};
  }
  // State succession changes the political label, not the geometry.
  if(year>=265)for(const c of Object.values(control)){
    if(c.owner==='cao'){c.owner='jin';c.since=Math.max(c.since,265);c.note='魏方地域随晋代魏改列西晋。此前的地域记录：'+c.note;c.sourceIds=[...new Set([...c.sourceIds,'jin'])]}
    c.contenders=c.contenders.map(id=>id==='cao'?'jin':id);
  }
  const counts={};let disputed=0;
  for(const r of ancientRegions.filter(r=>r.polygons.length)){
    const id=control[r.id].owner;if(id==='contested')disputed++;else counts[id]=(counts[id]||0)+1;
  }
  return {year,latest,control,counts,disputed};
}
