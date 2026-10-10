/* BloomGlee player: no advertising or analytics scripts. */
(function () {
  'use strict';
  const copy = {
    ko:{title:'BloomGlee',back:'← 게임 소개',retry:'다시 시도',tip:'블록을 끌어 놓아 한 줄이나 3×3 구획을 채워보세요.',save:'진행 기록은 이 브라우저에만 저장됩니다.',notes:'웹 버전 안내',loading:'정원을 준비하고 있어요…',opening:'정원을 열고 있어요…',slow:'정원을 불러오고 있어요. 이 창을 조금 더 열어두세요.',error:'게임을 불러오지 못했습니다. 연결을 확인하고 최신 브라우저에서 다시 시도해 주세요.',storage:'브라우저 저장소를 사용할 수 없습니다. 기록이 저장되지 않을 수 있어요. 저장소 접근이 허용된 일반 창을 사용해 주세요.'},
    en:{title:'BloomGlee',back:'← Game info',retry:'Try again',tip:'Drag blocks to fill a line or a marked 3×3 box.',save:'Progress is saved in this browser only.',notes:'Web version info',loading:'Preparing your garden…',opening:'Opening your garden…',slow:'Still loading. Please keep this tab open a little longer.',error:'The game could not load. Check your connection and try again in a current browser.',storage:'Browser storage is unavailable. Your records may not be saved. Use a normal browser tab with storage allowed.'},
    ja:{title:'BloomGlee',back:'← ゲーム紹介',retry:'再試行',tip:'ブロックをドラッグして一列か3×3の区画を埋めましょう。',save:'進行状況はこのブラウザにのみ保存されます。',notes:'Web版について',loading:'庭を準備しています…',opening:'庭を開いています…',slow:'読み込み中です。このタブをもう少し開いたままにしてください。',error:'読み込めませんでした。接続を確認し、新しいブラウザで再試行してください。',storage:'ブラウザに記録を保存できない可能性があります。ストレージが許可された通常のタブを使ってください。'},
    zh:{title:'BloomGlee',back:'← 游戏介绍',retry:'重试',tip:'拖动方块，填满一行或标出的3×3区域。',save:'游戏进度仅保存在此浏览器中。',notes:'网页版说明',loading:'正在准备花园…',opening:'正在打开花园…',slow:'仍在加载，请继续保持此页面打开。',error:'游戏无法加载。请检查网络，并在最新版浏览器中重试。',storage:'浏览器存储不可用，记录可能无法保存。请使用允许存储的普通浏览器窗口。'},
    'zh-Hant':{title:'BloomGlee',back:'← 遊戲介紹',retry:'重試',tip:'拖曳方塊，填滿一行或標出的3×3區域。',save:'遊戲進度僅儲存在此瀏覽器中。',notes:'網頁版說明',loading:'正在準備花園…',opening:'正在開啟花園…',slow:'仍在載入，請繼續保持此頁面開啟。',error:'遊戲無法載入。請檢查網路，並在最新版瀏覽器中重試。',storage:'瀏覽器儲存空間無法使用，紀錄可能無法儲存。請使用允許儲存的普通瀏覽器視窗。'}
  };
  let locale;
  try { locale=localStorage.getItem('fndg-locale'); } catch (_) {}
  if (!copy[locale]) { const n=(navigator.language||'').toLowerCase(); locale=n.startsWith('ko')?'ko':n.startsWith('ja')?'ja':/^zh-(tw|hk|mo|hant)/.test(n)?'zh-Hant':n.startsWith('zh')?'zh':'en'; }
  const downloadNotes={"ko": "첫 실행 시 약 193MB를 내려받습니다. 잠시만 기다려 주세요.", "en": "The first load downloads about 193 MB. Please allow a little time.", "ja": "初回は約193MBのゲームデータを読み込みます。しばらくお待ちください。", "zh": "首次启动需要下载约193MB的游戏文件，请稍候。", "zh-Hant": "首次啟動需要下載約193MB的遊戲檔案，請稍候。"};
  document.getElementById('download-note').textContent=downloadNotes[locale];
  const text=copy[locale];
  document.documentElement.lang=locale;
  document.title=text.title+' — FNDG';
  document.querySelectorAll('[data-copy]').forEach(el=>{el.textContent=text[el.dataset.copy];});
  const canvas=document.getElementById('unity-canvas'),area=document.getElementById('game-area'),loading=document.getElementById('loading'),status=document.getElementById('status'),progress=document.getElementById('progress'),retry=document.getElementById('retry'),notice=document.getElementById('notice');
  let failed=false,loaded=false,saveNotice=false,slowLoad;
  status.textContent=text.loading;
  function fitCanvas(){const r=area.getBoundingClientRect(),ratio=9/16,h=Math.max(1,Math.min(r.height-10,(r.width-12)/ratio,1280));canvas.style.height=Math.floor(h)+'px';canvas.style.width=Math.floor(h*ratio)+'px';}
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(fitCanvas).observe(area);
  window.addEventListener('resize',fitCanvas,{passive:true});
  if(window.visualViewport)window.visualViewport.addEventListener('resize',fitCanvas,{passive:true});
  fitCanvas();
  function storageNotice(){if(saveNotice)return;saveNotice=true;notice.textContent=text.storage;notice.hidden=false;}
  function loadError(detail){if(failed)return;failed=true;window.clearTimeout(slowLoad);loading.hidden=false;status.textContent=text.error;progress.hidden=true;retry.hidden=false;console.error('BloomGlee load failed:',detail);}
  retry.addEventListener('click',()=>window.location.reload());
  canvas.addEventListener('wheel',e=>e.preventDefault(),{passive:false});
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  const build=window.GARDEN_PUZZLE_BUILD;
  if(!build||typeof WebAssembly!=='object'){loadError('Build configuration or WebAssembly unavailable');return;}
  if(!window.indexedDB)storageNotice();
  const config={arguments:[],dataUrl:build.dataUrl,frameworkUrl:build.frameworkUrl,codeUrl:build.codeUrl,streamingAssetsUrl:'StreamingAssets',companyName:'Frogndog',productName:'BloomGlee',productVersion:build.version,autoSyncPersistentDataPath:true,devicePixelRatio:Math.min(window.devicePixelRatio||1,1.5),showBanner:function(message,type){const value=String(message);if(/indexeddb|indexed db|idbfs|persist|storage|quota/i.test(value))storageNotice();if(type==='error')loadError(value);else console.warn('BloomGlee:',value);}};
  slowLoad=window.setTimeout(()=>{if(!loaded&&!failed)status.textContent=text.slow;},45000);
  const loader=document.createElement('script');
  loader.src=build.loaderUrl;
  loader.onerror=()=>loadError('Player loader download failed');
  loader.onload=async()=>{
    if(typeof createUnityInstance!=='function'){loadError('Player loader did not initialize');return;}
    if(build.chunkManifestUrl){
      try {
        if(!window.BloomGleeChunkedData||typeof window.BloomGleeChunkedData.install!=='function')throw new Error('Chunked data loader unavailable');
        await window.BloomGleeChunkedData.install({manifestUrl:build.chunkManifestUrl,dataUrl:config.dataUrl});
      } catch(error){loadError(error);return;}
    }
    createUnityInstance(canvas,config,value=>{progress.value=value;if(!failed)status.textContent=value<.9?text.loading+' '+Math.round(value*100)+'%':text.opening;}).then(unity=>{loaded=true;window.clearTimeout(slowLoad);if(failed){unity.Quit();return;}loading.hidden=true;canvas.classList.add('ready');canvas.removeAttribute('aria-hidden');fitCanvas();}).catch(loadError);
  };
  document.body.appendChild(loader);
})();
