(function () {
  'use strict';
  var videos = {ko:'aOQJMne2e_k',en:'tGalYj0LL1Q',ja:'mLxAAJkxTHI',zh:'dXmvkF29xkg','zh-Hant':'jGhohu9ok1o'};
  var labels = {
    ko:{board:'스테이지 50의 시작 화면',action:'스테이지 50의 색 혼합 화면',late:'스테이지 500의 게임 화면',video:'Palette of Water 한국어 플레이 영상'},
    en:{board:'Stage 50 starting board',action:'Stage 50 colour mixing',late:'Stage 500 gameplay',video:'Palette of Water English gameplay'},
    ja:{board:'ステージ50の開始画面',action:'ステージ50の色の混合',late:'ステージ500のゲーム画面',video:'Palette of Water 日本語プレイ映像'},
    zh:{board:'第50关开始画面',action:'第50关调色画面',late:'第500关游戏画面',video:'Palette of Water 简体中文游戏演示'},
    'zh-Hant':{board:'第50關開始畫面',action:'第50關調色畫面',late:'第500關遊戲畫面',video:'Palette of Water 繁體中文遊戲演示'}
  };
  var stage = document.getElementById('video-stage');
  var placeholder = document.getElementById('video-placeholder');
  var load = document.getElementById('load-video');
  var close = document.getElementById('close-video');
  var link = document.getElementById('youtube-link');
  var current;
  function locale() { var value = document.documentElement.getAttribute('data-locale'); return Object.prototype.hasOwnProperty.call(videos,value) ? value : 'en'; }
  function closePlayer(focus) {
    var frame = stage.querySelector('iframe');
    if (frame) frame.remove();
    placeholder.hidden = false;
    close.hidden = true;
    if (focus) load.focus();
  }
  function update() {
    var value = locale();
    if (value === current) return;
    current = value;
    closePlayer(false);
    document.querySelectorAll('[data-game-shot]').forEach(function (img) {
      var shot = img.getAttribute('data-game-shot');
      if (!Object.prototype.hasOwnProperty.call(labels[value],shot)) return;
      img.src = 'palette-of-water/media/' + value + '-' + shot + '.png';
      img.alt = 'Palette of Water — ' + labels[value][shot];
    });
    link.href = 'https://www.youtube.com/watch?v=' + videos[value];
  }
  load.addEventListener('click',function () {
    if (stage.querySelector('iframe')) return;
    var value = locale();
    var frame = document.createElement('iframe');
    frame.src = 'https://www.youtube-nocookie.com/embed/' + videos[value] + '?rel=0';
    frame.title = labels[value].video;
    frame.allow = 'encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    placeholder.hidden = true;
    stage.appendChild(frame);
    close.hidden = false;
    frame.focus();
  });
  close.addEventListener('click',function () { closePlayer(true); });
  new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['data-locale']});
  update();
})();
