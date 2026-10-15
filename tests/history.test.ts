import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptyHistory,next,previous,restore} from '../src/history';
test('initial selection uses randomness',()=>{assert.equal(next(emptyHistory(),['A','B'],()=>0).trail[0],'A');assert.equal(next(emptyHistory(),['A','B'],()=>.99).trail[0],'B');});
test('unread first, then avoid immediate repeat',()=>{let h=next(emptyHistory(),['A','B'],()=>0);h=next(h,['A','B'],()=>0);assert.deepEqual(h.trail,['A','B']);h=next(h,['A','B'],()=>0);assert.deepEqual(h.trail,['A','B','A']);});
test('previous and forward preserve trail',()=>{const h=next(next(emptyHistory(),['A','B']),['A','B']);const back=previous(h);assert.equal(back.cursor,0);assert.deepEqual(next(back,['A','B']),h);});
test('reload prioritizes unread and does not reset',()=>{const h=next(emptyHistory(),['A','B'],()=>0);const fresh=next(restore(JSON.stringify(h),['A','B']),['A','B'],()=>0);assert.equal(fresh.trail[fresh.cursor],'B');});
test('corrupt storage and removed specimens are safe',()=>{assert.deepEqual(restore('{',['A']),emptyHistory());assert.deepEqual(restore(JSON.stringify({seen:['gone'],trail:['gone'],cursor:0}),['A']),emptyHistory());assert.deepEqual(next(emptyHistory(),[]),emptyHistory());});
test('one specimen and newly added specimens',()=>{const h=next(emptyHistory(),['A']);assert.equal(next(h,['A']).trail[1],'A');assert.equal(next(h,['A','C']).trail[1],'C');});
