/* Only a user gesture loads ./webgl-config.js, then the Unity build.
 * Integration contract (the build owner supplies the real file, no stub):
 * window.PALETTE_WEBGL_CONFIG = { loaderUrl, dataUrl, frameworkUrl, codeUrl,
 *   streamingAssetsUrl, companyName, productName, productVersion };
 * All values must be nonempty strings. Asset URLs resolve relative to this page
 * and must stay within this same-origin player directory. Keep the deployed data
 * URL directory stable between updates to preserve Unity's browser save path.
 * The Unity build owns stage limits, in-game languages, audio and persistence.
 */
(function () {
  'use strict';
  const copy = {
    en: {
      skip:'Skip to the game', back:'← Game details', language:'Website language',
      eyebrow:'A LITTLE COLOUR, A LITTLE TIME', badge:'All 999 stages / free browser game',
      intro:'A first brushstroke. Mix red, yellow and blue, and learn to bring the board together in one colour.',
      player:'Palette of Water browser game', canvas:'Palette of Water game', coverTitle:'All 999 stages, one brushstroke at a time',
      idle:'Ready for a little colour? Choose Start to load the game.', start:'Start game', enter:'Play with sound', retry:'Reload and try again',
      gesture:'You choose when to start. After loading, tap Play with sound to enable game audio.', progress:'Game loading',
      loading:'Preparing your palette…', opening:'Opening the sketchbook…', slow:'Still loading. Please keep this tab open a little longer.', ready:'Your palette is ready. Tap Play with sound to begin.',
      unavailable:'The browser game is being prepared. Please come back a little later.',
      error:'The game could not load. Check your connection and try again in a current browser.',
      unsupported:'This browser cannot run the game. Try a current browser with WebGL 2 and WebAssembly enabled.',
      storage:'Browser storage is unavailable or full. Your progress may not be saved. Try a normal browser tab with storage allowed.',
      notesTitle:'999 stages, saved here',
      save:'Progress is saved in this browser only, separately from Android. Clearing site data or using private browsing can remove your save.',
      scope:'All 999 stages are free. Clear a stage to open the next; replay cleared stages from the in-game menu. The free Android game is under Google Play review.',
      controls:'Tap or click to mix and paint. A portrait layout works best; you can keep playing without entering fullscreen.',
      details:'Game details & gameplay videos', games:'All FNDG games'
    },
    ko: {
      skip:'게임으로 건너뛰기', back:'← 게임 소개', language:'웹사이트 언어',
      eyebrow:'물감 한 방울, 잠깐의 여유', badge:'999 스테이지 모두 무료 / 브라우저 게임',
      intro:'첫 번째 붓질부터 차근차근. 빨강, 노랑, 파랑을 섞으며 보드를 한 가지 색으로 완성하는 방법을 배워보세요.',
      player:'Palette of Water 브라우저 게임', canvas:'Palette of Water 게임', coverTitle:'한 단계씩 이어지는 999 스테이지',
      idle:'색을 섞어볼까요? 시작 버튼을 누르면 게임을 불러옵니다.', start:'게임 시작', enter:'소리와 함께 플레이', retry:'새로고침 후 다시 시도',
      gesture:'시작할 때를 직접 정하세요. 로딩 후 소리와 함께 플레이를 누르면 게임 오디오가 활성화됩니다.', progress:'게임 불러오기',
      loading:'팔레트를 준비하고 있어요…', opening:'스케치북을 열고 있어요…', slow:'아직 불러오는 중이에요. 이 탭을 조금 더 열어두세요.', ready:'팔레트가 준비됐어요. 소리와 함께 플레이를 눌러 시작하세요.',
      unavailable:'브라우저 게임을 준비하고 있어요. 잠시 후 다시 찾아주세요.',
      error:'게임을 불러오지 못했어요. 연결을 확인하고 최신 브라우저에서 다시 시도해 주세요.',
      unsupported:'이 브라우저에서는 게임을 실행할 수 없어요. WebGL 2와 WebAssembly를 사용할 수 있는 최신 브라우저로 열어주세요.',
      storage:'브라우저 저장소를 사용할 수 없거나 공간이 부족해 진행이 저장되지 않을 수 있어요. 저장소를 허용한 일반 창을 사용해 주세요.',
      notesTitle:'999 스테이지, 이 브라우저에 저장',
      save:'진행은 이 브라우저에만 저장되며 Android와 연동되지 않습니다. 사이트 데이터를 지우거나 시크릿 모드를 사용하면 저장 기록이 사라질 수 있어요.',
      scope:'999 스테이지 모두 무료예요. 한 단계를 완성하면 다음 단계가 열리며, 게임 안의 메뉴에서 완료한 단계를 다시 고를 수 있어요. Android 무료 버전은 Google Play 심사 중입니다.',
      controls:'터치하거나 클릭해서 물감을 섞고 칠해보세요. 세로 화면을 권장하며 전체 화면으로 전환하지 않아도 플레이할 수 있어요.',
      details:'게임 소개와 플레이 영상', games:'FNDG의 모든 게임'
    },
    ja: {
      skip:'ゲームへスキップ', back:'← ゲーム紹介', language:'サイトの言語',
      eyebrow:'ひとしずくの色、ひと息の時間', badge:'全999ステージ無料 / ブラウザゲーム',
      intro:'最初のひと筆から。赤・黄・青を混ぜながら、盤面を一色にそろえる遊び方を学びましょう。',
      player:'Palette of Water ブラウザゲーム', canvas:'Palette of Water ゲーム', coverTitle:'一歩ずつ進む全999ステージ',
      idle:'色を混ぜてみませんか？開始ボタンでゲームを読み込みます。', start:'ゲームを開始', enter:'音声ありでプレイ', retry:'再読み込みして試す',
      gesture:'開始はお好きなときに。読み込み後「音声ありでプレイ」を押すとゲーム音声が有効になります。', progress:'ゲームの読み込み',
      loading:'パレットを準備しています…', opening:'スケッチブックを開いています…', slow:'読み込み中です。このタブをもう少し開いたままにしてください。', ready:'パレットの準備ができました。「音声ありでプレイ」を押して始めましょう。',
      unavailable:'ブラウザゲームを準備中です。しばらくしてからまたお越しください。',
      error:'ゲームを読み込めませんでした。接続を確認し、新しいブラウザでお試しください。',
      unsupported:'このブラウザでは実行できません。WebGL 2とWebAssemblyが有効な新しいブラウザでお試しください。',
      storage:'ブラウザの保存領域が使えないか、空き容量が不足しています。進行を保存できない可能性があるため、保存を許可した通常のタブをお使いください。',
      notesTitle:'999ステージを、このブラウザに',
      save:'進行はこのブラウザにのみ保存され、Androidとは同期されません。サイトデータの削除やプライベートブラウズで記録が失われる場合があります。',
      scope:'全999ステージが無料です。クリアすると次のステージが開き、ゲーム内のメニューでクリア済みのステージを選べます。無料Android版はGoogle Playで審査中です。',
      controls:'タップまたはクリックで混ぜて塗りましょう。縦画面がおすすめです。全画面に切り替えずに遊べます。',
      details:'ゲーム紹介とプレイ映像', games:'FNDGのすべてのゲーム'
    },
    zh: {
      skip:'跳至游戏', back:'← 游戏介绍', language:'网站语言',
      eyebrow:'一滴色彩，片刻闲暇', badge:'全部999关 / 免费浏览器游戏',
      intro:'从第一笔开始，混合红、黄、蓝，学习如何让棋盘变成同一种颜色。',
      player:'Palette of Water 浏览器游戏', canvas:'Palette of Water 游戏', coverTitle:'一步步完成全部999关',
      idle:'准备好调色了吗？点击开始加载游戏。', start:'开始游戏', enter:'开启声音并游玩', retry:'刷新后重试',
      gesture:'由你决定何时开始。加载后点击“开启声音并游玩”即可启用游戏音频。', progress:'游戏加载',
      loading:'正在准备调色盘…', opening:'正在打开画册…', slow:'仍在加载，请继续保持此页面打开。', ready:'调色盘已准备好。点击“开启声音并游玩”开始吧。',
      unavailable:'浏览器游戏正在准备中，请稍后再来。',
      error:'游戏加载失败。请检查网络，并在最新版浏览器中重试。',
      unsupported:'此浏览器无法运行游戏。请使用启用了WebGL 2和WebAssembly的最新版浏览器。',
      storage:'浏览器存储不可用或空间不足，进度可能无法保存。请使用允许存储的普通浏览器窗口。',
      notesTitle:'999关进度，保存在这里',
      save:'进度仅保存在此浏览器中，不与Android同步。清除网站数据或使用无痕模式可能导致存档丢失。',
      scope:'全部999关免费。完成关卡即可解锁下一关，也可以从游戏内菜单重玩已完成的关卡。免费Android版目前正在接受Google Play审核。',
      controls:'轻点或点击即可调色与上色。推荐使用竖屏，无需切换全屏也能游玩。',
      details:'游戏介绍与演示视频', games:'FNDG的所有游戏'
    },
    'zh-Hant': {
      skip:'跳至遊戲', back:'← 遊戲介紹', language:'網站語言',
      eyebrow:'一滴色彩，片刻閒暇', badge:'全部999關 / 免費瀏覽器遊戲',
      intro:'從第一筆開始，混合紅、黃、藍，學習如何讓棋盤變成同一種顏色。',
      player:'Palette of Water 瀏覽器遊戲', canvas:'Palette of Water 遊戲', coverTitle:'一步步完成全部999關',
      idle:'準備好調色了嗎？點擊開始載入遊戲。', start:'開始遊戲', enter:'開啟聲音並遊玩', retry:'重新整理後重試',
      gesture:'由你決定何時開始。載入後點擊「開啟聲音並遊玩」即可啟用遊戲音訊。', progress:'遊戲載入',
      loading:'正在準備調色盤…', opening:'正在開啟畫冊…', slow:'仍在載入，請繼續保持此頁面開啟。', ready:'調色盤已準備好。點擊「開啟聲音並遊玩」開始吧。',
      unavailable:'瀏覽器遊戲正在準備中，請稍後再來。',
      error:'遊戲載入失敗。請檢查網路，並在最新版瀏覽器中重試。',
      unsupported:'此瀏覽器無法執行遊戲。請使用啟用了WebGL 2和WebAssembly的最新版瀏覽器。',
      storage:'瀏覽器儲存空間無法使用或已滿，進度可能無法儲存。請使用允許儲存的普通瀏覽器視窗。',
      notesTitle:'999關進度，儲存在這裡',
      save:'進度僅儲存在此瀏覽器中，不與Android同步。清除網站資料或使用無痕模式可能導致存檔遺失。',
      scope:'全部999關免費。完成關卡即可解鎖下一關，也可以從遊戲內選單重玩已完成的關卡。免費Android版目前正在接受Google Play審核。',
      controls:'輕點或點擊即可調色與上色。推薦使用直向畫面，無需切換全螢幕也能遊玩。',
      details:'遊戲介紹與示範影片', games:'FNDG的所有遊戲'
    }
  };
  const root = document.documentElement;
  const canvas = document.getElementById('unity-canvas');
  const player = document.getElementById('player');
  const cover = document.getElementById('cover');
  const status = document.getElementById('status');
  const progress = document.getElementById('progress');
  const start = document.getElementById('start');
  const enter = document.getElementById('enter');
  const retry = document.getElementById('retry');
  const notice = document.getElementById('notice');
  let locale = 'en';
  let phase = 'idle';
  let statusKey = 'idle';
  let percent = null;
  let slowTimer;
  let unity;
  let storageUnavailable = false;
  const hasLocale = value => Object.prototype.hasOwnProperty.call(copy, value);

  function renderStatus() {
    status.textContent = copy[locale][statusKey] + (percent === null ? '' : ' ' + percent + '%');
  }
  function applyLocale(value) {
    locale = hasLocale(value) ? value : 'en';
    root.lang = locale;
    root.setAttribute('data-locale', locale);
    document.title = 'Palette of Water · ' + copy[locale].badge + ' — FNDG';
    document.querySelectorAll('[data-copy]').forEach(el => { el.textContent = copy[locale][el.dataset.copy]; });
    document.querySelectorAll('[data-label]').forEach(el => { el.setAttribute('aria-label', copy[locale][el.dataset.label]); });
    document.querySelectorAll('[data-loc]').forEach(el => { el.setAttribute('aria-pressed', String(el.dataset.loc === locale)); });
    renderStatus();
    if (storageUnavailable) notice.textContent = copy[locale].storage;
  }
  function initialLocale() {
    let value;
    try { value = localStorage.getItem('fndg-locale'); } catch (_) { /* Browser-language fallback still works. */ }
    if (hasLocale(value)) return value;
    const language = (navigator.language || '').toLowerCase();
    return language.startsWith('ko') ? 'ko' : language.startsWith('ja') ? 'ja' : /^zh-(tw|hk|mo|hant)/.test(language) ? 'zh-Hant' : language.startsWith('zh') ? 'zh' : 'en';
  }
  document.querySelectorAll('[data-loc]').forEach(button => {
    button.addEventListener('click', () => {
      applyLocale(button.dataset.loc);
      try { localStorage.setItem('fndg-locale', locale); } catch (_) { /* Language selection works without storage. */ }
    });
  });
  function storageNotice() {
    storageUnavailable = true;
    notice.textContent = copy[locale].storage;
    notice.hidden = false;
  }
  function setStatus(key, value = null) {
    statusKey = key;
    percent = value;
    renderStatus();
  }
  function fail(key, detail) {
    if (phase === 'failed') return;
    phase = 'failed';
    window.clearTimeout(slowTimer);
    player.setAttribute('aria-busy', 'false');
    cover.hidden = false;
    start.hidden = true;
    enter.hidden = true;
    progress.hidden = true;
    retry.hidden = false;
    canvas.classList.remove('ready');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.tabIndex = -1;
    setStatus(key);
    retry.focus({preventScroll:true});
    console.warn('Palette of Water:', detail);
  }
  function readBuild() {
    const build = window.PALETTE_WEBGL_CONFIG;
    const keys = ['loaderUrl','dataUrl','frameworkUrl','codeUrl','streamingAssetsUrl','companyName','productName','productVersion'];
    if (!build || keys.some(key => typeof build[key] !== 'string' || !build[key].trim())) throw new Error('Incomplete WebGL configuration');
    const base = new URL('./', document.baseURI);
    const result = {};
    keys.forEach(key => {
      if (key.endsWith('Url')) {
        const url = new URL(build[key], base);
        if (!/^https?:$/.test(url.protocol) || url.origin !== base.origin || !url.pathname.startsWith(base.pathname) || url.username || url.password || url.hash) throw new Error('Build assets must stay in the player directory');
        result[key] = url.href;
      } else result[key] = build[key];
    });
    return result;
  }
  function loadScript(src, timeout) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      let timer;
      function finish(error) {
        window.clearTimeout(timer);
        script.onload = script.onerror = null;
        if (error) { script.remove(); reject(error); } else resolve();
      }
      script.src = src;
      script.onload = () => finish();
      script.onerror = () => finish(new Error('Script could not load: ' + src));
      timer = window.setTimeout(() => finish(new Error('Script load timed out: ' + src)), timeout);
      document.body.appendChild(script);
    });
  }
  function canPlay() {
    if (typeof WebAssembly !== 'object') return false;
    try {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return false;
      const loseContext = gl.getExtension('WEBGL_lose_context');
      if (loseContext) loseContext.loseContext();
      return true;
    } catch (_) { return false; }
  }
  start.addEventListener('click', async () => {
    if (phase !== 'idle') return;
    phase = 'loading';
    start.disabled = true;
    start.hidden = true;
    if (!canPlay()) { fail('unsupported', 'WebGL 2 or WebAssembly unavailable'); return; }
    player.setAttribute('aria-busy', 'true');
    progress.hidden = false;
    setStatus('loading', 0);
    try { if (!window.indexedDB) storageNotice(); } catch (_) { storageNotice(); }
    let build;
    try {
      await loadScript('./webgl-config.js?v=full999-20261008', 20000);
      build = readBuild();
    } catch (error) { fail('unavailable', error); return; }
    const config = {
      dataUrl:build.dataUrl, frameworkUrl:build.frameworkUrl, codeUrl:build.codeUrl,
      streamingAssetsUrl:build.streamingAssetsUrl, companyName:build.companyName,
      productName:build.productName, productVersion:build.productVersion,
      autoSyncPersistentDataPath:true,
      devicePixelRatio:Math.min(window.devicePixelRatio || 1, 2),
      showBanner(message, type) {
        const text = String(message);
        if (/indexeddb|indexed db|idbfs|persist|storage|quota/i.test(text)) storageNotice();
        else if (type === 'error') fail('error', text);
        else console.warn('Palette of Water:', text);
      }
    };
    slowTimer = window.setTimeout(() => { if (phase === 'loading') setStatus('slow'); }, 45000);
    try {
      await loadScript(build.loaderUrl, 90000);
      if (phase !== 'loading') return;
      if (typeof window.createUnityInstance !== 'function') throw new Error('Unity loader did not initialize');
      unity = await window.createUnityInstance(canvas, config, value => {
        if (phase !== 'loading') return;
        const ratio = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
        progress.value = ratio;
        setStatus(ratio >= .9 ? 'opening' : 'loading', Math.round(ratio * 100));
      });
      window.clearTimeout(slowTimer);
      if (phase === 'failed') { if (unity && unity.Quit) await unity.Quit(); return; }
      phase = 'ready';
      player.setAttribute('aria-busy', 'false');
      progress.hidden = true;
      enter.hidden = false;
      setStatus('ready');
      enter.focus({preventScroll:true});
    } catch (error) { fail('error', error); }
  });
  enter.addEventListener('click', () => {
    if (phase !== 'ready') return;
    // A fresh gesture AFTER Unity has installed its audio-unlock listeners.
    // Let this event bubble normally; do not synthesize input or autoplay clicks.
    phase = 'playing';
    cover.hidden = true;
    canvas.classList.add('ready');
    canvas.removeAttribute('aria-hidden');
    canvas.tabIndex = 0;
    canvas.focus({preventScroll:true});
    player.scrollIntoView({block:'center',behavior:'auto'});
  });
  retry.addEventListener('click', () => window.location.reload());
  canvas.addEventListener('contextmenu', event => event.preventDefault());
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); fail('error', 'WebGL context lost'); });
  applyLocale(initialLocale());
  start.disabled = false;
})();
