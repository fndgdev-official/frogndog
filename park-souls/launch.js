'use strict';
(() => {
  const launch = document.getElementById('launch-game');
  const download = document.getElementById('download-game');
  const downloadStatus = document.getElementById('download-status');
  const launchStatus = document.getElementById('launch-status');
  const unsupportedNote = document.getElementById('unsupported-note');
  if (!launch || !download || !downloadStatus || !launchStatus) return;

  const copy = {
    ko: {
      play: '설치한 게임 실행',
      download: 'Windows 설치 파일 받기',
      unsupportedPlay: 'Windows PC · 키보드 · 마우스 필요',
      unsupportedDownload: 'Windows PC에서 다운로드',
      unsupportedStatus: '키보드와 마우스가 연결된 Windows PC에서 이 페이지를 열어 주세요.',
      unavailable: '다운로드를 준비 중입니다. 잠시 후 다시 확인해 주세요.',
      installer: '소형 Windows 설치 프로그램',
      resources: '게임 다운로드',
      setup: '실행하면 진행률을 보며 게임을 다운로드·설치합니다. 중단해도 이어받을 수 있습니다.',
      launchAttempt: '브라우저에서 Park Souls를 열지 물으면 열기를 선택해 주세요. 아무 반응이 없으면 아래 설치 안내를 확인해 주세요. 이 페이지에서는 게임 설치 여부를 확인할 수 없습니다.'
    },
    en: {
      play: 'Play Installed Game',
      download: 'Get Windows Installer',
      unsupportedPlay: 'Windows PC + keyboard + mouse required',
      unsupportedDownload: 'Download on a Windows PC',
      unsupportedStatus: 'Open this page on a Windows PC with a keyboard and mouse.',
      unavailable: 'Download is being prepared. Check back soon.',
      installer: 'Small Windows installer',
      resources: 'Game download',
      setup: 'Run it to download and install the game with a progress bar. Interrupted downloads can resume.',
      launchAttempt: 'Your browser may ask to open Park Souls. Choose Open to continue. If nothing happens, follow the setup guide below; this page cannot check whether the game is installed.'
    },
    ja: {
      play: 'インストール済みのゲームを起動',
      download: 'Windowsインストーラーを入手',
      unsupportedPlay: 'Windows PC・キーボード・マウスが必要',
      unsupportedDownload: 'Windows PCでダウンロード',
      unsupportedStatus: 'キーボードとマウスを接続したWindows PCで、このページを開いてください。',
      unavailable: 'ダウンロードを準備中です。しばらくしてからご確認ください。',
      installer: '小容量のWindowsインストーラー',
      resources: 'ゲームのダウンロード',
      setup: '実行すると進行状況を確認しながらゲームをダウンロード・インストールできます。中断後も再開できます。',
      launchAttempt: 'ブラウザーにPark Soulsを開くか確認されたら、「開く」を選んでください。何も起きない場合は、下のセットアップ手順をご確認ください。このページではゲームがインストールされているかどうかを確認できません。'
    },
    zh: {
      play: '启动已安装的游戏',
      download: '获取Windows安装程序',
      unsupportedPlay: '需要Windows电脑、键盘和鼠标',
      unsupportedDownload: '请在Windows电脑上下载',
      unsupportedStatus: '请使用连接了键盘和鼠标的Windows电脑打开此页面。',
      unavailable: '下载正在准备中，请稍后再来查看。',
      installer: '小型Windows安装程序',
      resources: '游戏下载',
      setup: '运行后即可通过进度条查看游戏下载和安装进度。下载中断后可以继续。',
      launchAttempt: '如果浏览器询问是否打开Park Souls，请选择“打开”。如果没有反应，请查看下方的设置指南。本页面无法检测游戏是否已安装。'
    },
    'zh-Hant': {
      play: '啟動已安裝的遊戲',
      download: '取得Windows安裝程式',
      unsupportedPlay: '需要Windows電腦、鍵盤和滑鼠',
      unsupportedDownload: '請在Windows電腦下載',
      unsupportedStatus: '請使用已連接鍵盤與滑鼠的Windows電腦開啟此頁面。',
      unavailable: '下載正在準備中，請稍後再來查看。',
      installer: '小型Windows安裝程式',
      resources: '遊戲下載',
      setup: '執行後即可透過進度條查看遊戲下載及安裝進度。下載中斷後可以繼續。',
      launchAttempt: '如果瀏覽器詢問是否開啟Park Souls，請選擇「開啟」。如果沒有反應，請查看下方的設定指南。本頁面無法偵測遊戲是否已安裝。'
    }
  };

  const release = window.PARK_SOULS_RELEASE || {};
  const ua = navigator.userAgent || '';
  const mobile = navigator.userAgentData?.mobile === true ||
    /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua) ||
    (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  const windows = navigator.userAgentData?.platform === 'Windows' || /Windows NT/i.test(ua);
  const hasMouse = typeof matchMedia === 'function' &&
    matchMedia('(any-pointer: fine)').matches && matchMedia('(any-hover: hover)').matches;
  const supported = windows && !mobile && hasMouse;
  let downloadUrl = '';
  let launchAttempted = false;

  if (typeof release.downloadUrl === 'string') {
    try {
      const url = new URL(release.downloadUrl);
      if (url.protocol === 'https:') downloadUrl = url.href;
    } catch (_) {
      // An absent or malformed release URL leaves the download unavailable.
    }
  }

  function enable(link, href) {
    link.href = href;
    link.removeAttribute('aria-disabled');
    link.removeAttribute('tabindex');
  }

  function disable(link) {
    link.removeAttribute('href');
    link.setAttribute('aria-disabled', 'true');
    link.setAttribute('tabindex', '-1');
  }

  function setText(node, text) {
    // Avoid repeating live-region announcements when the value is unchanged.
    if (node.textContent !== text) node.textContent = text;
  }

  function render() {
    const locale = document.documentElement.getAttribute('data-locale') ||
      document.documentElement.lang || 'en';
    const text = copy[locale] || copy.en;
    setText(launch, supported ? text.play : text.unsupportedPlay);
    setText(download, supported ? text.download : text.unsupportedDownload);
    setText(downloadStatus, !supported ? text.unsupportedStatus : !downloadUrl ? text.unavailable :
      text.installer + (typeof release.installerSizeLabel === 'string' && release.installerSizeLabel ? ' · ' + release.installerSizeLabel : '') +
      (typeof release.gameSizeLabel === 'string' && release.gameSizeLabel ? ' · ' + text.resources + ': ' + release.gameSizeLabel : '') +
      ' · ' + text.setup);
    setText(launchStatus, launchAttempted ? text.launchAttempt : '');
  }

  // Capability hints only: do not infer whether an app is installed from browser
  // focus, visibility, navigation timing, or the URL hash.
  disable(launch);
  disable(download);
  if (supported) {
    enable(launch, 'parksouls://play');
    if (downloadUrl) enable(download, downloadUrl);
  } else if (unsupportedNote) {
    // Its translated children belong to the page and the shared locale switcher.
    unsupportedNote.classList.remove('hidden');
  }

  render();
  new MutationObserver(render).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-locale']
  });

  launch.addEventListener('click', (event) => {
    if (!supported || launch.getAttribute('aria-disabled') === 'true') {
      event.preventDefault();
      return;
    }
    // A deliberate click lets the browser request permission for the installed app.
    // Do not auto-launch on load, after a download, or when returning with #play.
    launchAttempted = true;
    render();
  });

  download.addEventListener('click', (event) => {
    if (!supported || download.getAttribute('aria-disabled') === 'true') event.preventDefault();
  });
})();
