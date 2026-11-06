export const sources = {
  cao: { title: '《三国志》卷一 · 武帝纪', url: 'https://zh.wikisource.org/wiki/三國志/卷01' },
  liu: { title: '《三国志》卷三十二 · 先主传', url: 'https://zh.wikisource.org/wiki/三國志/卷32' },
  sun: { title: '《三国志》卷五十四 · 周瑜鲁肃吕蒙传', url: 'https://zh.wikisource.org/wiki/三國志/卷54' },
  zhuge: { title: '《三国志》卷三十五 · 诸葛亮传', url: 'https://zh.wikisource.org/wiki/三國志/卷35' },
};
export const factions = {
  cao: {name:'曹操势力',color:'#a65c4d',short:'曹'},
  liu: {name:'刘备集团',color:'#597d65',short:'刘'},
  sun: {name:'孙权势力',color:'#537d91',short:'孙'},
  jing: {name:'荆州地方势力',color:'#b09150',short:'荆'}
};
export const places = [
  {id:'xuchang',name:'许',modern:'今河南许昌一带',coord:[113.85,34.03],owner:['cao','cao','cao','cao'],desc:'汉献帝所在之地，也是曹操经营中原的重要政治中心。'},
  {id:'wancheng',name:'宛',modern:'今河南南阳一带',coord:[112.53,33.0],owner:['cao','cao','cao','cao'],desc:'南阳盆地的重镇，连接中原与荆襄地区。'},
  {id:'xinye',name:'新野',modern:'今河南新野一带',coord:[112.36,32.52],owner:['liu','cao','cao','cao'],desc:'刘备依附刘表期间曾驻于新野。曹军南下后，刘备向南转移。'},
  {id:'xiangyang',name:'襄阳',modern:'今湖北襄阳一带',coord:[112.14,32.04],owner:['jing','cao','cao','cao'],desc:'汉水沿岸的荆州重镇。刘琮降曹后，荆襄形势发生重大变化。'},
  {id:'changban',name:'长坂',modern:'今湖北当阳一带',coord:[111.79,30.82],owner:['jing','cao','cao','cao'],desc:'刘备南撤时遭曹军追击的关键地点。此后刘备转向汉津，与水军会合。'},
  {id:'jiangling',name:'江陵',modern:'今湖北荆州一带',coord:[112.19,30.35],owner:['jing','cao','cao','cao'],desc:'长江中游的军事与物资重镇。赤壁之后的南郡争夺仍将继续，并非一战即定。'},
  {id:'hankou',name:'夏口',modern:'今湖北武汉一带',coord:[114.30,30.55],owner:['jing','liu','liu','liu'],desc:'汉水与长江相会的战略节点。刘备与刘琦方面的力量在这一带联结。'},
  {id:'fankou',name:'樊口',modern:'今湖北鄂州一带',coord:[114.80,30.40],owner:['jing','liu','liu','liu'],desc:'刘备军在长江中游活动的地点之一。不同史料对相关部署的记述侧重点有所不同。'},
  {id:'chibi',name:'赤壁',modern:'以今湖北赤壁市附近作示意',coord:[113.63,29.88],owner:['jing','cao','cao','sun'],desc:'孙刘联军与曹军交战的关键区域。古战场具体位置存在讨论，此处采用常见定位作概览示意。'},
  {id:'chaisang',name:'柴桑',modern:'今江西九江一带',coord:[115.89,29.68],owner:['sun','sun','sun','sun'],desc:'孙权方面商议抗曹与部署军事行动的重要背景地点。'},
  {id:'hefei',name:'合肥',modern:'今安徽合肥一带',coord:[117.28,31.86],owner:['cao','cao','cao','cao'],desc:'江淮地区的重要据点。长江战场之外，孙曹之间还有另一条相互牵制的战线。'},
  {id:'wujun',name:'吴',modern:'今江苏苏州一带',coord:[120.58,31.30],owner:['sun','sun','sun','sun'],desc:'孙氏经营江东的腹地。江东各地的资源与人力，是孙权作出决策的基础。'},
];
export const stages = [
 {id:'south',label:'曹操南征',title:'北方的兵锋，指向荆州',period:'建安十三年 · 南征之初',season:'208 · 南征',kicker:'风起荆襄',intro:'北方局势渐定，曹操将目光投向南方。一条汉水，把中原与荆州连在一起。',body:'曹操率军南下，荆州面临军事压力。刘表去世后，刘琮继位；依附刘表的刘备，则处在曹军推进的前沿。江东的孙权也开始关注这场变化。',change:'先看地理：从中原进入长江流域，荆襄是一道重要门户。',question:'为什么荆州会成为各方争夺的关键？',answer:'荆襄连接南阳盆地、汉水和长江。它既是南下通道，也连接江东与更西面的地区。地理位置使它成为各方必须考虑的枢纽。',novel:'《三国演义》用荆州内部的继承与权力冲突铺陈局势。阅读时可以将戏剧化人物言行，与史书记录的南征和继承事件分别理解。',source:['cao','liu'],routes:{cao:['xuchang','wancheng'],liu:['xinye'],sun:['wujun','chaisang']},positions:{cao:'wancheng',liu:'xinye',sun:'chaisang'},notes:{cao:'趁势南下，争取荆州。',liu:'依附刘表，面临北方来军。',sun:'经营江东，关注荆州变化。'}},
 {id:'retreat',label:'长坂南渡',title:'一场南撤，改变了刘备的方向',period:'建安十三年 · 荆州易手后',season:'208 · 南撤',kicker:'局势骤变',intro:'刘琮降曹。刘备向南撤离，却在长坂遭到追击。前方的选择，越来越少。',body:'刘琮向曹操投降，刘备率众南行。曹军在当阳长坂追上刘备。刘备随后转向汉津，与关羽的船队等力量会合，向江夏方向转移。',change:'襄阳、江陵进入曹操控制；刘备转向长江中游，寻找新的立足点。',question:'刘备为什么没有继续向江陵前进？',answer:'长坂的追击打断了原来的南撤方向。转向水路，与关羽及刘琦方面的力量会合，为刘备保存力量和寻求联盟提供了条件。',novel:'长坂桥、赵云救主等情节在《三国演义》中得到集中描写。此处地图只重现宏观转移方向，人物细节需要分别查对相关传记。',source:['liu','cao'],routes:{cao:['wancheng','xiangyang','changban','jiangling'],liu:['xinye','xiangyang','changban','hankou'],sun:['wujun','chaisang']},positions:{cao:'jiangling',liu:'hankou',sun:'chaisang'},notes:{cao:'接收荆州，继续向长江推进。',liu:'转向江夏，与水军及刘琦部会合。',sun:'曹军已至长江，战与和必须抉择。'}},
 {id:'alliance',label:'孙刘合盟',title:'隔江相望的人，成为了盟友',period:'建安十三年 · 赤壁战前',season:'208 · 战前',kicker:'赤壁前夜',intro:'鲁肃往来联络，诸葛亮出使孙权。共同的压力，让两股力量走到了一起。',body:'面对曹操南下，刘备与孙权方面展开联络。诸葛亮参与出使，鲁肃推动联结，周瑜主张抗曹。孙权决定出兵，与刘备共同对抗曹军。',change:'刘备与孙权建立军事合作，长江战场由分散应对转为联合抵抗。',question:'结盟的双方，各自需要什么？',answer:'刘备需要生存空间与军事支持；孙权需要阻止曹军继续进入江东。双方处境不同，却在此时拥有共同的军事目标。',novel:'“舌战群儒”“智激周瑜”等桥段强化了说服与较量的戏剧性。史书可支持出使、讨论和联合抗曹的主线；不能将整段小说对白视为实录。',source:['sun','zhuge','liu'],routes:{cao:['xiangyang','jiangling','chibi'],liu:['hankou','fankou','chibi'],sun:['chaisang','fankou','chibi']},positions:{cao:'jiangling',liu:'fankou',sun:'chaisang'},notes:{cao:'凭借荆州的军事资源，向东施压。',liu:'派诸葛亮出使，寻求联合抗曹。',sun:'听取鲁肃、周瑜等人的意见，决定抵抗。'}},
 {id:'battle',label:'赤壁交锋',title:'江上的火光，照出了新的局势',period:'建安十三年 · 赤壁之战',season:'208 · 决战',kicker:'江流转折',intro:'双方在赤壁一带交战。火攻成为关键环节，曹军随后退却，南下的进程受阻。',body:'孙刘联军与曹军交战。周瑜传记载了黄盖提出火攻并付诸实施的经过，武帝纪也记述了交战不利与疫病。曹军撤退，之后各方仍将继续争夺荆州。',change:'曹操此次南下受挫。孙刘获得转圜空间，但荆州的归属远未就此尘埃落定。',question:'赤壁一战，就形成了魏蜀吴三国吗？',answer:'没有。208 年仍是东汉末年的势力竞争。后来的建国与疆域形成还有较长过程；赤壁是重要转折，而不是三国疆域一次定型的时刻。',novel:'“借东风”“草船借箭”等文学叙事塑造了鲜明的赤壁印象。火攻在周瑜传中有记载，而小说中的完整计谋链需要与史书分开阅读。',source:['sun','cao','liu'],routes:{cao:['chibi','jiangling'],liu:['fankou','chibi'],sun:['chaisang','chibi']},positions:{cao:'jiangling',liu:'chibi',sun:'chaisang'},notes:{cao:'军队退却，留兵继续据守江陵等要地。',liu:'与孙权方面协同作战，获得转圜空间。',sun:'周瑜等率军交战，后续继续争夺南郡。'}},
];
export const people = [
 {id:'cao',name:'曹操',zi:'孟德',faction:'cao',role:'汉丞相',seal:'曹',bio:'掌握汉廷与北方大部资源的军事政治人物。此次南征，意在将优势推进到长江流域。',links:['刘琮 · 接受其投降','刘备 · 军事对手','孙权 · 南方对手']},
 {id:'liu',name:'刘备',zi:'玄德',faction:'liu',role:'左将军',seal:'刘',bio:'依附刘表的刘备，在荆州局势突变后南撤。他的选择从争取立足之地，转向与孙权合作。',links:['关羽 · 部属与同伴','诸葛亮 · 谋臣','孙权 · 联合抗曹']},
 {id:'sun',name:'孙权',zi:'仲谋',faction:'sun',role:'江东领袖',seal:'孙',bio:'继承孙氏在江东的基业。曹军南下之际，他在主战与主和意见之间作出联合抗曹的决定。',links:['周瑜 · 领军将领','鲁肃 · 重要谋臣','刘备 · 联合抗曹']},
 {id:'zhou',name:'周瑜',zi:'公瑾',faction:'sun',role:'孙权部将',seal:'周',bio:'主张抵抗曹操，是孙权方面的重要领军人物。赤壁火攻的经过，见于《三国志·周瑜传》。',links:['孙权 · 所事之主','鲁肃 · 同僚','黄盖 · 协同作战']},
 {id:'zhuge',name:'诸葛亮',zi:'孔明',faction:'liu',role:'刘备谋臣',seal:'葛',bio:'刘备方面的谋臣，参与出使孙权、推动联合抗曹。此时的身份与后来蜀汉丞相的身份应当区分。',links:['刘备 · 所事之主','鲁肃 · 联盟联络','孙权 · 出使对象']},
 {id:'lu',name:'鲁肃',zi:'子敬',faction:'sun',role:'孙权谋臣',seal:'鲁',bio:'重视荆州形势，参与孙刘之间的联络，主张联合刘备对抗曹操。',links:['孙权 · 所事之主','周瑜 · 同僚','刘备 · 联盟联络']}
];
