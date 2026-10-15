export interface History { seen: string[]; trail: string[]; cursor: number; queue: string[] }
export const emptyHistory = (): History => ({seen: [], trail: [], cursor: -1, queue: []});
function shuffle(ids: string[], random: () => number): string[] {
 const result = [...ids];
 for (let i = result.length - 1; i > 0; i--) {
  const j = Math.floor(random() * (i + 1));
  [result[i], result[j]] = [result[j], result[i]];
 }
 return result;
}
export function restore(raw: string|null, ids: string[], random = Math.random): History {
 try {
  const v = JSON.parse(raw ?? 'null');
  if (!v || !Array.isArray(v.seen) || !Array.isArray(v.trail) || !Number.isInteger(v.cursor) || v.cursor < -1 || v.cursor >= v.trail.length) return emptyHistory();
  const valid = (id: unknown): id is string => typeof id === 'string' && ids.includes(id);
  const trail = v.trail.filter(valid) as string[];
  const cursor = v.trail.slice(0, v.cursor + 1).filter(valid).length - 1;
  const seen = [...new Set<string>(v.seen.filter(valid))];
  // v1にはqueueがないため、未読から移行する。保存済みの順序は変更しない。
  const queue = Array.isArray(v.queue) ? [...new Set<string>(v.queue.filter(valid))] : [];
  const added = ids.filter(id => !seen.includes(id) && !queue.includes(id));
  return {seen, trail, cursor, queue: [...shuffle(added, random), ...queue]};
 } catch { return emptyHistory(); }
}
export function next(h: History, ids: string[], random = Math.random): History {
 if (!ids.length) return emptyHistory();
 if (h.cursor < h.trail.length - 1) return {...h, cursor: h.cursor + 1};
 const added = ids.filter(id => !h.seen.includes(id) && !h.queue.includes(id));
 let queue = [...shuffle(added, random), ...h.queue.filter(id => ids.includes(id))];
 if (!queue.length) {
  queue = shuffle(ids, random);
  // 周回境界で同じ一文を続けない。周回中は重複させない。
  if (queue.length > 1 && queue[0] === h.trail[h.cursor]) {
   [queue[0], queue[1]] = [queue[1], queue[0]];
  }
 }
 const [id, ...remaining] = queue;
 const trail = [...h.trail, id].slice(-500);
 return {seen: [...new Set([...h.seen, id])], trail, cursor: trail.length - 1, queue: remaining};
}
export function previous(h: History): History { return {...h, cursor: Math.max(0, h.cursor - 1)}; }
