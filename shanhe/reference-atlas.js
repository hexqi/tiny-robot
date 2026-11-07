import { collatedAtlas } from './assets/history-reference/collated-atlas.js';
import { placeAdmin as oldPlaceAdmin, adminExceptions } from './atlas-data.js';

// All chapters share this reference map. Its dates are independent of story dates.
export { adminExceptions };
export const atlasMetadata = collatedAtlas;
export const ancientSources = [
  { title: 'Esiymbro · 建安州郡参考图 · CC BY-SA 4.0', url: collatedAtlas.source.url },
  { title: '地图改编许可 · CC BY-SA 4.0', url: collatedAtlas.source.licenseUrl },
  ...collatedAtlas.sources,
];
const refs = new Map(collatedAtlas.sources.map(s => [s.id, s]));
export const ancientRegions = collatedAtlas.regions.map(r => ({
  ...r,
  ring: r.polygons[0]?.[0] || [],
  source: ancientSources[0],
  references: r.sourceRefs.map(id => refs.get(id)),
}));
export const states = collatedAtlas.states;
export const pendingRegions = collatedAtlas.pendingRegions;
export const adminBoundaries = collatedAtlas.boundaries;
export const historicalPlaceAdmin = oldPlaceAdmin;

// Keep the existing location index and approximate coordinates. These assignments
// describe the reference map, not a promise of jurisdiction at each story date.
const changes = { xiangyang: 'xiangyang-region', yiling: 'yidu', yongan: 'guling', langzhong: 'baxi', dangqu: 'dangqu-region' };
export const placeAdmin = Object.fromEntries(Object.entries(oldPlaceAdmin).map(([id, old]) => {
  const r = ancientRegions.find(r => r.id === (changes[id] || old[3]));
  if (!r) throw new Error(`Missing reference commandery for ${id}`);
  return [id, [r.parent, r.name, old[2].replace(' · 旧巴郡框架', ''), r.id]];
}));

function inRing([x, y], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
export function containsCoordinate(polygons, coord) {
  return polygons.some(([outer, ...holes]) => inRing(coord, outer) && !holes.some(r => inRing(coord, r)));
}
export function locationGeometryNote(p) {
  const r = ancientRegions.find(r => r.id === placeAdmin[p.id]?.[3]);
  if (!r) return '';
  if (r.coverage !== 'closed-reference') return `${r.name}的独立范围尚未确定，地点按文字隶属关联。`;
  return containsCoordinate(r.polygons, p.coord) ? '' : '此地点约位落在参考轮廓之外：城址定位、底稿边线与年代仍有差异。隶属按文字关联，未为贴合轮廓移动地点。';
}
