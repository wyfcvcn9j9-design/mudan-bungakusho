import './style.css';
import { published } from './specimens';
import { next, previous, restore } from './history';
const key='mudan-bungakusho:history:v1', ids=published.map(s=>s.id);
let saved:string|null=null;
try{saved=localStorage.getItem(key);}catch{}
const restored=restore(saved,ids);
let history=restored.cursor>=0?restored:next(restored,ids), opened=false, busy=false, suppressClick=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelector('#app')!.innerHTML=`<header><h1>無断文学賞</h1><span class="header-note" aria-hidden="true">一文を、そのまま。</span></header><main><div class="stage"><article class="card"><button class="sentence" aria-expanded="false" aria-controls="answer"><span class="text"></span></button><section id="answer" hidden><div class="answer-top"><span>本来の文脈</span><button class="close" aria-label="答え合わせを閉じる">閉じる ×</button></div><p class="context"></p><a target="_blank" rel="noopener noreferrer"><span class="source"></span><span aria-hidden="true"> ↗</span><span class="sr-only">の元記事を開く（新しいタブ）</span></a></section></article></div><p class="hint">一文をタップして、出典をひらく</p></main><footer><nav aria-label="標本の移動"><button class="prev" aria-label="前の標本へ"><span aria-hidden="true">←</span> 前の一文</button><span class="swipe-hint">左右にスワイプ</span><button class="next" aria-label="次の標本へ">次の一文 <span aria-hidden="true">→</span></button></nav></footer><div class="sr-only" role="status" aria-live="polite" id="status"></div>`;
const $=<T extends HTMLElement>(s:string)=>document.querySelector<T>(s)!;
const card=$('.card'),stage=$('.stage'),sentence=$<HTMLButtonElement>('.sentence');
function reveal(value:boolean){opened=value;$('#answer').hidden=!opened;sentence.setAttribute('aria-expanded',String(opened));$('.hint').textContent=opened?'もう一度タップして、閉じる':'一文をタップして、出典をひらく';}
function render(){
 const s=published.find(s=>s.id===history.trail[history.cursor]);
 if(s){$('.text').textContent=s.text;$('.context').textContent=s.context;$('.source').textContent=s.source;$<HTMLAnchorElement>('#answer a').href=s.url;}
 else{$('.text').textContent='公開中の標本はありません。';sentence.disabled=true;$<HTMLButtonElement>('.next').disabled=true;}
 $<HTMLButtonElement>('.prev').disabled=history.cursor<=0;reveal(false);
 try{localStorage.setItem(key,JSON.stringify(history));}catch{}
}
async function move(direction:1|-1){
 if(busy||!ids.length||(direction===-1&&history.cursor<=0)){card.style.transform='';return;}
 busy=true;reveal(false);
 const duration=reduced.matches?0:180,distance=stage.clientWidth;
 if(duration)await card.animate([{transform:card.style.transform||'translateX(0)'},{transform:`translateX(${-direction*distance}px)`,opacity:0}],{duration,easing:'ease-in',fill:'forwards'}).finished;
 card.getAnimations().forEach(a=>a.cancel());
 history=direction===1?next(history,ids):previous(history);card.style.transform='';render();
 if(duration)await card.animate([{transform:`translateX(${direction*distance}px)`,opacity:0},{transform:'translateX(0)',opacity:1}],{duration,easing:'ease-out'}).finished;
 busy=false;$('#status').textContent='一文を切り替えました。';
}
sentence.addEventListener('click',()=>{if(!busy&&!suppressClick)reveal(!opened);});
$('.close').addEventListener('click',()=>{reveal(false);sentence.focus();});
$('.prev').addEventListener('click',()=>void move(-1));$('.next').addEventListener('click',()=>void move(1));
document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();void move(e.key==='ArrowLeft'?-1:1);}if(e.key==='Escape'&&opened){reveal(false);sentence.focus();}});
let gesture:{x:number;y:number;dx:number;axis:'x'|'y'|null;pointer:number}|null=null;
stage.addEventListener('pointerdown',e=>{if(busy||!e.isPrimary||e.button!==0||(e.target as HTMLElement).closest('a,.close'))return;suppressClick=false;gesture={x:e.clientX,y:e.clientY,dx:0,axis:null,pointer:e.pointerId};});
stage.addEventListener('pointermove',e=>{
 if(!gesture||gesture.pointer!==e.pointerId)return;
 const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
 if(!gesture.axis&&Math.hypot(dx,dy)>9)gesture.axis=Math.abs(dx)>Math.abs(dy)*1.3?'x':'y';
 if(gesture.axis)suppressClick=true;
 if(gesture.axis==='x'){if(!stage.hasPointerCapture(e.pointerId))stage.setPointerCapture(e.pointerId);gesture.dx=dx;card.style.transform=`translateX(${dx>0&&history.cursor<=0?dx*.16:dx}px)`;}
});
function finish(cancelled=false){
 if(!gesture)return;
 const {dx,axis}=gesture;gesture=null;
 if(!cancelled&&axis==='x'&&Math.abs(dx)>55)void move(dx<0?1:-1);
 else{const from=card.style.transform;card.style.transform='';if(!reduced.matches&&from)card.animate([{transform:from},{transform:'translateX(0)'}],{duration:150});}
 setTimeout(()=>{suppressClick=false;},0);
}
stage.addEventListener('pointerup',()=>finish());stage.addEventListener('pointercancel',()=>finish(true));window.addEventListener('pointerup',()=>finish());
render();
