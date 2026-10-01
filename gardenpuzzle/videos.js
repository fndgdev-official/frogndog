/* Local manifest only. A YouTube player is created after an explicit play click. */
(function () {
  'use strict';

  // Manifest schema (garden-video-manifest in gardenpuzzle.html):
  // { schemaVersion: 1, defaultLanguage: 'en', videos: [
  //   { language: 'en', youtubeId: '<verified 11-character ID>',
  //     orientation: 'portrait', durationSeconds: 36 }
  // ] }
  // Add only verified public/unlisted GardenPuzzle videos. Empty means no section.
  var languages = [
    ['en', 'English'], ['ko', '한국어'], ['ja', '日本語'],
    ['zh-Hans', '简体中文'], ['zh-Hant', '繁體中文'], ['es', 'Español'],
    ['fr', 'Français'], ['de', 'Deutsch'], ['pt-BR', 'Português (Brasil)'],
    ['pt-PT', 'Português (Portugal)'], ['it', 'Italiano'], ['nl', 'Nederlands'],
    ['pl', 'Polski'], ['ru', 'Русский'], ['tr', 'Türkçe'], ['id', 'Bahasa Indonesia'],
    ['ms', 'Bahasa Melayu'], ['vi', 'Tiếng Việt'], ['fil', 'Filipino'],
    ['th', 'ไทย'], ['uk', 'Українська'], ['sv', 'Svenska'], ['hi', 'हिन्दी']
  ];
  var copy = {
    ko: {
      title: '눈앞에서 피어나는 작은 정원',
      intro: '블록을 놓고, 꽃잎이 이어지는 순간을 실제 플레이 영상으로 만나보세요.',
      language: '영상 언어', play: '영상 재생', close: '영상 닫기',
      youtube: 'YouTube에서 보기', channel: 'FNDG YouTube 채널',
      game: '직접 플레이', unavailable: '영상 준비 중',
      privacy: '재생을 누르면 YouTube에 연결됩니다. 다른 언어를 고르면 재생이 멈춥니다.',
      ready: '선택한 영상: {language}', playing: 'YouTube 플레이어: {language}',
      fallback: '현재 웹 언어의 영상이 없어 {language} 영상을 보여드립니다.',
      frame: 'GardenPuzzle 실제 플레이 — {language}'
    },
    en: {
      title: 'Watch your little garden bloom',
      intro: 'See real gameplay: place a block and follow the petals as combinations unfold.',
      language: 'Video language', play: 'Play video', close: 'Close video',
      youtube: 'Watch on YouTube', channel: 'FNDG on YouTube',
      game: 'Play the game', unavailable: 'Video coming later',
      privacy: 'Playing connects to YouTube. Choosing another language stops playback.',
      ready: 'Selected video: {language}', playing: 'YouTube player: {language}',
      fallback: 'A video in this website language is not available yet. Showing {language}.',
      frame: 'GardenPuzzle real gameplay — {language}'
    },
    ja: {
      title: '小さな庭が花開く瞬間を',
      intro: 'ブロックを置き、組み合わせから花びらが広がる様子を実際のプレイ映像でご覧ください。',
      language: '動画の言語', play: '動画を再生', close: '動画を閉じる',
      youtube: 'YouTubeで見る', channel: 'FNDGのYouTubeチャンネル',
      game: 'ゲームをプレイ', unavailable: '動画準備中',
      privacy: '再生するとYouTubeに接続します。別の言語を選ぶと再生が止まります。',
      ready: '選択中の動画：{language}', playing: 'YouTubeプレーヤー：{language}',
      fallback: 'このサイトの言語の動画は準備中です。{language}の動画を表示します。',
      frame: 'GardenPuzzleの実際のプレイ — {language}'
    },
    zh: {
      title: '看小小的花园绽放',
      intro: '观看实际游戏过程：摆放方块，欣赏组合成功时花瓣绽放的瞬间。',
      language: '视频语言', play: '播放视频', close: '关闭视频',
      youtube: '在YouTube观看', channel: 'FNDG YouTube频道',
      game: '开始游戏', unavailable: '视频准备中',
      privacy: '点击播放后将连接YouTube。选择其他语言会停止播放。',
      ready: '已选视频：{language}', playing: 'YouTube播放器：{language}',
      fallback: '当前网站语言的视频尚未提供，现显示{language}视频。',
      frame: 'GardenPuzzle实际游戏过程 — {language}'
    },
    'zh-Hant': {
      title: '看小小的花園綻放',
      intro: '觀看實際遊戲過程：擺放方塊，欣賞組合成功時花瓣綻放的瞬間。',
      language: '影片語言', play: '播放影片', close: '關閉影片',
      youtube: '在YouTube觀看', channel: 'FNDG YouTube頻道',
      game: '開始遊戲', unavailable: '影片準備中',
      privacy: '點擊播放後將連線至YouTube。選擇其他語言會停止播放。',
      ready: '已選影片：{language}', playing: 'YouTube播放器：{language}',
      fallback: '目前網站語言的影片尚未提供，現顯示{language}影片。',
      frame: 'GardenPuzzle實際遊戲過程 — {language}'
    }
  };
  var section = document.getElementById('garden-videos');
  var manifestElement = document.getElementById('garden-video-manifest');
  if (!section || !manifestElement) return;

  var manifest;
  try { manifest = JSON.parse(manifestElement.textContent); } catch (e) { return; }
  if (!manifest || manifest.schemaVersion !== 1 || !Array.isArray(manifest.videos)) return;

  var available = Object.create(null);
  manifest.videos.forEach(function (video) {
    if (!video || !languages.some(function (item) { return item[0] === video.language; })) return;
    if (typeof video.youtubeId !== 'string' || !/^[A-Za-z0-9_-]{11}$/.test(video.youtubeId)) return;
    if (available[video.language]) return;
    available[video.language] = {
      language: video.language,
      youtubeId: video.youtubeId,
      orientation: video.orientation === 'landscape' ? 'landscape' : 'portrait'
    };
  });
  var firstLanguage = languages.find(function (item) { return available[item[0]]; });
  if (!firstLanguage) return;

  var selector = document.getElementById('garden-video-language');
  var stage = document.getElementById('garden-video-stage');
  var play = document.getElementById('garden-video-play');
  var close = document.getElementById('garden-video-close');
  var external = document.getElementById('garden-video-youtube');
  var status = document.getElementById('garden-video-status');
  var iframe = null;
  var manualSelection = false;
  var selected = null;
  var fallback = false;

  languages.forEach(function (item) {
    var option = document.createElement('option');
    option.value = item[0];
    option.lang = item[0];
    option.disabled = !available[item[0]];
    selector.appendChild(option);
  });
  document.getElementById('garden-video-poster').src = 'gardenpuzzle/media/gameplay.png';

  function locale() {
    var value = document.documentElement.getAttribute('data-locale');
    return Object.prototype.hasOwnProperty.call(copy, value) ? value : 'en';
  }
  function words() { return copy[locale()]; }
  function languageName() {
    return languages.find(function (item) { return item[0] === selected; })[1];
  }
  function format(value) { return value.replace('{language}', languageName()); }
  function stop() {
    if (iframe) { iframe.remove(); iframe = null; }
    play.hidden = false;
    close.hidden = true;
  }
  function updateText() {
    var text = words();
    section.querySelectorAll('[data-video-copy]').forEach(function (element) {
      element.textContent = text[element.getAttribute('data-video-copy')];
    });
    Array.from(selector.options).forEach(function (option, index) {
      option.textContent = languages[index][1] + (option.disabled ? ' — ' + text.unavailable : '');
    });
    play.setAttribute('aria-label', text.play + ': ' + languageName());
    if (iframe) iframe.title = format(text.frame);
    status.textContent = format(iframe ? text.playing : fallback ? text.fallback : text.ready);
  }
  function selectVideo(language) {
    stop();
    selected = language;
    selector.value = language;
    stage.dataset.orientation = available[language].orientation;
    external.href = 'https://www.youtube.com/watch?v=' + available[language].youtubeId;
    updateText();
  }
  function matchPageLanguage() {
    if (manualSelection) { updateText(); return; }
    var wanted = locale() === 'zh' ? 'zh-Hans' : locale();
    var choice = available[wanted] ? wanted : available[manifest.defaultLanguage] ? manifest.defaultLanguage : firstLanguage[0];
    fallback = choice !== wanted;
    if (selected !== choice) selectVideo(choice); else updateText();
  }
  selector.addEventListener('change', function () {
    if (!available[selector.value]) return;
    manualSelection = true;
    fallback = false;
    selectVideo(selector.value);
  });
  play.addEventListener('click', function () {
    if (!selected || iframe) return;
    var video = available[selected];
    iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + video.youtubeId + '?autoplay=1&playsinline=1&rel=0';
    iframe.title = format(words().frame);
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    stage.appendChild(iframe);
    play.hidden = true;
    close.hidden = false;
    updateText();
    iframe.focus();
  });
  close.addEventListener('click', function () {
    stop();
    updateText();
    play.focus();
  });
  new MutationObserver(matchPageLanguage).observe(document.documentElement, {
    attributes: true, attributeFilter: ['data-locale']
  });
  matchPageLanguage();
  section.hidden = false;
})();
