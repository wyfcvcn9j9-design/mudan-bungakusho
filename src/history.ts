export interface History { seen: string[]; trail: string[]; cursor: number }
export const emptyHistory = (): History => ({seen:[],trail:[],cursor:-1});
export function restore(raw: string|null, ids: string[]): History {
 try {
  const v=JSON.parse(raw??'null');
  if(!v || !Array.isArray(v.seen) || !Array.isArray(v.trail) || !Number.isInteger(v.cursor)) return emptyHistory();
  const trail=v.trail.slice(0,v.cursor+1).filter((id: unknown)=>typeof id==='string' && ids.includes(id)) as string[];
  return {seen:[...new Set<string>(v.seen.filter((id: unknown)=>typeof id==='string' && ids.includes(id)))],trail,cursor:trail.length-1};
 } catch { return emptyHistory(); }
}
export function next(h: History, ids: string[], random=Math.random): History {
 if(!ids.length) return emptyHistory();
 if(h.cursor<h.trail.length-1) return {...h,cursor:h.cursor+1};
 const unread=ids.filter(id=>!h.seen.includes(id));
 const candidates=unread.length?unread:ids.filter(id=>id!==h.trail[h.cursor]);
 const pool=candidates.length?candidates:ids;
 const id=pool[Math.min(pool.length-1,Math.floor(random()*pool.length))];
 const trail=[...h.trail,id].slice(-500);
 return {seen:[...new Set([...h.seen,id])],trail,cursor:trail.length-1};
}
export function previous(h: History): History {return {...h,cursor:Math.max(0,h.cursor-1)};}
