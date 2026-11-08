// Names change with the observed year; the location ID and coordinates stay stable.
// Sources: Sanguozhi 47 (Jian'an 17), 02 (Huangchu 2), 32 (Zhangwu 2).
const naming={
 jianye:{year:212,before:'秣陵',after:'建业',aliases:['秣陵','建业','建鄴'],description:'孙权于 211 年移治秣陵，212 年改名建业，229 年迁都于此。采用同一地点约位，名称按所观察年份显示，不复原历次城垣。'},
 xuchang:{year:221,before:'许',after:'许昌',aliases:['许','许县','许昌'],description:'汉末许县是曹操迎奉汉献帝后的政治中心；221 年曹丕改许县为许昌县。名称随观察年份切换，点位仍为古城附近约位。'},
 yongan:{year:222,before:'鱼复',after:'永安',aliases:['鱼复','魚復','永安','白帝城'],description:'刘备于 222 年夷陵战败后退至鱼复，改县名为永安，翌年在此托孤。鱼复、永安与白帝城在故事中相互关联，地图以奉节一带约位，不表示城址完全重合。'},
};
export const placeAliases=id=>naming[id]?.aliases||[];
export function placeAtYear(place,year){
 const rule=naming[place?.id];
 return rule&&Number.isFinite(year)?{...place,name:year>=rule.year?rule.after:rule.before,desc:rule.description}:place;
}
