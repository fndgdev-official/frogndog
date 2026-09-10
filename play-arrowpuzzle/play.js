/* Real Unity player. No analytics, advertising, or consent scripts are loaded by this shell. */
(function () {
  'use strict';
  const canvas = document.getElementById('unity-canvas');
  const area = document.getElementById('game-area');
  const loading = document.getElementById('loading');
  const status = document.getElementById('status');
  const progress = document.getElementById('progress');
  const retry = document.getElementById('retry');
  const notice = document.getElementById('notice');
  let instance = null;
  let failed = false;
  let loaded = false;
  let saveNoticeShown = false;

  function fitCanvas() {
    const bounds = area.getBoundingClientRect();
    const ratio = 9 / 19.5;
    const height = Math.max(1, Math.min(bounds.height - 10, (bounds.width - 12) / ratio, 1170));
    canvas.style.height = Math.floor(height) + 'px';
    canvas.style.width = Math.floor(height * ratio) + 'px';
  }
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(fitCanvas).observe(area);
  window.addEventListener('resize', fitCanvas, { passive: true });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', fitCanvas, { passive: true });
  fitCanvas();

  function showSaveNotice() {
    if (saveNoticeShown) return;
    saveNoticeShown = true;
    notice.textContent = 'Browser storage is unavailable. Progress may not be saved. Try a normal browser tab with storage allowed.';
    notice.hidden = false;
  }

  function showLoadError(detail) {
    if (failed) return;
    failed = true;
    loading.hidden = false;
    status.textContent = 'The game could not load. Check your connection and try again in a current browser.';
    progress.hidden = true;
    retry.hidden = false;
    document.querySelector('.load-note').textContent = 'Your saved progress is kept when you reload.';
    console.error('Arrow Puzzle load failed:', detail);
  }
  retry.addEventListener('click', function () { window.location.reload(); });

  function showBanner(message, type) {
    const text = String(message);
    if (/indexeddb|indexed db|idbfs|persist|storage|quota/i.test(text)) showSaveNotice();
    if (type === 'error') showLoadError(text);
    else console.warn('Arrow Puzzle:', text);
  }

  // Keep wheel gestures on the game; surrounding navigation retains normal browser behavior.
  canvas.addEventListener('wheel', function (event) { event.preventDefault(); }, { passive: false });
  canvas.addEventListener('contextmenu', function (event) { event.preventDefault(); });

  // The controller already saves after every move. These lifecycle calls cover tab navigation too.
  function saveProgress() {
    if (!instance || failed) return;
    try { instance.SendMessage('Arrow Escape', 'Save'); }
    catch (error) { console.warn('Arrow Puzzle lifecycle save:', error); }
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) saveProgress(); });
  window.addEventListener('pagehide', saveProgress);

  const build = window.ARROW_PUZZLE_BUILD;
  if (!build || typeof WebAssembly !== 'object') {
    showLoadError('The build configuration or browser WebAssembly support is unavailable.');
    return;
  }
  if (!window.indexedDB) showSaveNotice();
  const config = {
    arguments: [],
    dataUrl: build.dataUrl,
    frameworkUrl: build.frameworkUrl,
    codeUrl: build.codeUrl,
    streamingAssetsUrl: 'StreamingAssets',
    companyName: 'FNDG',
    productName: 'Arrow Puzzle',
    productVersion: build.version,
    autoSyncPersistentDataPath: true,
    devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    showBanner: showBanner
  };
  const slowLoad = window.setTimeout(function () {
    if (!loaded && !failed) status.textContent = 'Still loading… Please keep this tab open.';
  }, 45000);
  const loader = document.createElement('script');
  loader.src = build.loaderUrl;
  loader.onerror = function () { window.clearTimeout(slowLoad); showLoadError('The player loader could not be downloaded.'); };
  loader.onload = function () {
    if (typeof createUnityInstance !== 'function') { showLoadError('The player loader did not initialize.'); return; }
    createUnityInstance(canvas, config, function (value) {
      progress.value = value;
      if (!failed) status.textContent = value < 0.9 ? 'Loading 1,000 puzzles… ' + Math.round(value * 100) + '%' : 'Opening your puzzle…';
    }).then(function (unity) {
      instance = unity;
      loaded = true;
      window.clearTimeout(slowLoad);
      if (failed) return;
      loading.hidden = true;
      canvas.classList.add('ready');
      canvas.removeAttribute('aria-hidden');
      fitCanvas();
    }).catch(function (error) { window.clearTimeout(slowLoad); showLoadError(error); });
  };
  document.body.appendChild(loader);
})();
