// Pure data registry: do not import the world or map adapters here.
import {period5,period5PlaceAdmin,period5FieldIds,period5PortIds} from './period-5.js';
import {period6,period6PlaceAdmin,period6FieldIds,period6PortIds} from './period-6.js';
import {period7,period7PlaceAdmin,period7FieldIds,period7PortIds} from './period-7.js';
import {period8,period8PlaceAdmin,period8FieldIds,period8PortIds} from './period-8.js';

export const laterPeriods=[period5,period6,period7,period8];
export const laterPlaceAdmin={...period5PlaceAdmin,...period6PlaceAdmin,...period7PlaceAdmin,...period8PlaceAdmin};
export const laterFieldIds=[...period5FieldIds,...period6FieldIds,...period7FieldIds,...period8FieldIds];
export const laterPortIds=[...period5PortIds,...period6PortIds,...period7PortIds,...period8PortIds];
export const laterAdminExceptions=Object.fromEntries(laterPeriods.flatMap(p=>p.places)
 .filter(p=>!laterPlaceAdmin[p.id]).map(p=>[p.id,'此处是历史行动涉及的区域约位，尚无可靠的单一参考郡关联，不据此推定精确县治或边界。']));
