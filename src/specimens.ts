export interface Specimen {
 id: string; text: string; source: string; url: string; context: string;
 status: 'published' | 'draft';
 verification: { status: 'verified' | 'needs-review'; checkedAt?: string };
}
export const specimens: Specimen[] = [
 {id:'A',text:'40代からは素材の良さで勝負しましょう◎',source:'BAYCREW’S STORE',url:'https://baycrews.jp/feature/detail/6084',context:'40代向けファッション記事における、服の素材や質感についてのアドバイス。',status:'published',verification:{status:'verified',checkedAt:'2026-10-15'}},
 {id:'B',text:'壁はなくなりませんが、これまでより働きやすくなることは間違いありません。',source:'リードブレーン',url:'https://leadbrain.co.jp/contents/lb/8802/',context:'社会保険に関する「130万円の壁」の解説。',status:'published',verification:{status:'verified',checkedAt:'2026-10-15'}}
];
export const published = specimens.filter(s=>s.status==='published' && s.verification.status==='verified');
