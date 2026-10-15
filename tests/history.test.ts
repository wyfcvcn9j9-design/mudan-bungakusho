import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyHistory, next, previous, restore } from '../src/history';
const ids = ['A','B','C','D'];
test('first selection is random and one cycle has no duplicates', () => {
 const a=next(emptyHistory(),ids,()=>0), b=next(emptyHistory(),ids,()=>.99);
 assert.notEqual(a.trail[0],b.trail[0]);
 let h=a; for(let i=1;i<4;i++) h=next(h,ids,()=>0);
 assert.equal(new Set(h.trail).size,4); assert.deepEqual(h.queue,[]);
 const last=h.trail[3];
 for(let i=0;i<4;i++) h=next(h,ids,()=>.99);
 assert.notEqual(h.trail[4],last); assert.equal(new Set(h.trail.slice(4)).size,4);
});
test('reload preserves current position, forward trail and queue exactly',()=>{
 let h=next(next(next(emptyHistory(),ids),ids),ids);h=previous(h);
 const restored=restore(JSON.stringify(h),ids);
 assert.deepEqual(restored,h);
 assert.deepEqual(next(restored,ids),next(h,ids));
});
test('new specimens are unread ahead of old-cycle queue',()=>{
 let h=emptyHistory(); for(let i=0;i<5;i++)h=next(h,ids,()=>0);
 const expanded=[...ids,'E','F'];h=restore(JSON.stringify(h),expanded,()=>0);
 assert.deepEqual(new Set(h.queue.slice(0,2)),new Set(['E','F']));
 h=next(h,expanded);h=next(h,expanded);
 assert.deepEqual(new Set(h.trail.slice(-2)),new Set(['E','F']));
});
test('v1 migration retains seen, cursor and forward history',()=>{
 const h=restore(JSON.stringify({seen:['A','B'],trail:['A','B'],cursor:0}),ids,()=>0);
 assert.equal(h.cursor,0);assert.deepEqual(h.trail,['A','B']);assert.deepEqual(new Set(h.queue),new Set(['C','D']));
 assert.equal(next(h,ids).cursor,1);
});
test('removed IDs, corrupt storage, empty and single item',()=>{
 assert.deepEqual(restore('{',ids),emptyHistory());
 assert.deepEqual(next(emptyHistory(),[]),emptyHistory());
 const h=restore(JSON.stringify({seen:['gone','A'],trail:['gone','A','B'],cursor:1,queue:['gone','C']}),ids);
 assert.deepEqual(h.trail,['A','B']);assert.equal(h.cursor,0);assert.ok(!h.queue.includes('gone'));
 let single=next(emptyHistory(),['A']);single=next(single,['A']);assert.deepEqual(single.trail,['A','A']);
});
test('long navigation retains bounded history without affecting queue',()=>{
 let h=emptyHistory();for(let i=0;i<700;i++)h=next(h,ids);
 assert.equal(h.trail.length,500);assert.equal(h.cursor,499);
 assert.deepEqual(restore(JSON.stringify(h),ids),h);
});
