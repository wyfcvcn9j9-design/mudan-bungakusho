export interface Specimen {
 id: string; text: string; source: string; url: string; context: string;
 status: 'published' | 'draft';
 verification: { status: 'verified' | 'needs-review'; checkedAt?: string };
}
export const specimens: Specimen[] = [
 {id:'A',text:'40代からは素材の良さで勝負しましょう◎',source:'BAYCREW’S STORE',url:'https://baycrews.jp/feature/detail/6084',context:'40代向けファッション記事における、服の素材や質感についてのアドバイス。',status:'published',verification:{status:'verified',checkedAt:'2026-10-15'}},
 {id:'B',text:'壁はなくなりませんが、これまでより働きやすくなることは間違いありません。',source:'リードブレーン',url:'https://leadbrain.co.jp/contents/lb/8802/',context:'社会保険に関する「130万円の壁」の解説。',status:'published',verification:{status:'verified',checkedAt:'2026-10-15'}},
 {"id": "selection-04", "text": "近づきすぎると逃げられて、リアルタイムで翌日に再挑戦する事になるので注意。", "source": "GameWith", "url": "https://gamewith.jp/genshin/article/show/361212", "context": "『原神』の任務で暝彩鳥を捕獲する際の注意点。", "status": "published", "verification": {"status": "verified", "checkedAt": "2026-10-15"}},
 {"id": "selection-08", "text": "最初は触らずにふわっとしてくるまで待ちます。", "source": "楽天レシピ／京たまご8836", "url": "https://recipe.rakuten.co.jp/recipe/1460035050/", "context": "茗荷と卵の味噌汁。溶き卵を沸騰した汁に加えた直後の手順。", "status": "published", "verification": {"status": "verified", "checkedAt": "2026-10-15"}},
 {"id": "selection-16", "text": "青色のところに逃げれば大丈夫です。", "source": "日本将棋連盟", "url": "https://www.shogi.or.jp/knowledge/shogi/04.php", "context": "王手を受けた玉が逃げられるマスを図の色で説明。", "status": "published", "verification": {"status": "verified", "checkedAt": "2026-10-15"}},
 {"id": "selection-19", "text": "残した枝が、これからの枝先になります。", "source": "植木屋 庭番", "url": "https://garden-niwaban.com/blog/kirimodoshi/", "context": "枝の分かれ目で切り戻した後、残した枝が新たな先端になるという説明。", "status": "published", "verification": {"status": "verified", "checkedAt": "2026-10-15"}}
];
export const published = specimens.filter(s=>s.status==='published' && s.verification.status==='verified');
