import {stages as chibiStages,people as basePeople,places as basePlaces,factions as baseFactions} from './data.js';
import {events as chibiEvents,extraPeople,extraPlaces} from './story-data.js';
import {biographies as baseBiographies} from './biographies.js';
import {atlasCities} from './landscape-data.js';
import {period1} from './period-1.js';
import {period2} from './period-2.js';
import {period3} from './period-3.js';
import {laterPeriods} from './period-extensions.js';

const chibi={id:'chibi',number:4,title:'赤壁风云',years:'208',summary:'从荆州易主，到华容道。把散落的故事，连成一盘天下。',stages:chibiStages,events:chibiEvents,people:[...basePeople,...extraPeople],places:[],biographies:baseBiographies,personContexts:{}};
const historicalPeriods=[period1,period2,period3,...laterPeriods];
export const periods=[period1,period2,period3,chibi,...laterPeriods].map(period=>({
 ...period,
 stages:period.stages.map(stage=>({routes:{},...stage})),
 events:period.events.map(event=>({...event,periodId:period.id,historical:period.id!=='chibi'})),
}));
export const allEvents=periods.flatMap(period=>period.events);
export const allPeople=[...basePeople,...extraPeople,...historicalPeriods.flatMap(period=>period.people)];
export const allPlaces=[...basePlaces,...extraPlaces,...atlasCities,...historicalPeriods.flatMap(period=>period.places)];
export const allBiographies=Object.assign({},baseBiographies,...historicalPeriods.map(period=>period.biographies));
export const factions={...baseFactions,
 han:{name:'汉廷人物',short:'汉廷',color:'#a58b4d'},
 yellow:{name:'黄巾人物',short:'黄巾',color:'#ba8d30'},
 dong:{name:'董卓集团',short:'董卓',color:'#8b6a84'},
 yuan:{name:'袁氏人物',short:'袁氏',color:'#7775a2'},
 other:{name:'其他群雄',short:'群雄',color:'#7b8563'},
 jin:{name:'西晋人物',short:'晋',color:'#8a72b3'},
};
export const getPeriod=id=>periods.find(period=>period.id===id);
export const eventLabel=event=>event.historical?(event.dateLabel||`${event.year} 年`):`第 ${event.chapter} 回`;
export const personIdsInPeriod=period=>new Set(period.id==='chibi'?chibi.people.map(p=>p.id):period.events.flatMap(event=>event.cast));
