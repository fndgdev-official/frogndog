'use strict';
(() => {
  const launch = document.getElementById('launch-game');
  const download = document.getElementById('download-game');
  const downloadStatus = document.getElementById('download-status');
  const launchStatus = document.getElementById('launch-status');
  const release = window.PARK_SOULS_RELEASE || {};
  const ua = navigator.userAgent || '';
  const mobile = navigator.userAgentData?.mobile === true ||
    /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua) ||
    (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  const windows = navigator.userAgentData?.platform === 'Windows' || /Windows NT/i.test(ua);
  const hasMouse = matchMedia('(any-pointer: fine)').matches && matchMedia('(any-hover: hover)').matches;
  const supported = windows && !mobile && hasMouse;

  function enable(link, href) {
    link.href = href;
    link.removeAttribute('aria-disabled');
    link.removeAttribute('tabindex');
  }

  // Capability hints only: do not infer whether an app is installed from browser
  // focus, visibility, navigation timing, or the URL hash.
  if (!supported) {
    document.getElementById('unsupported-note').classList.remove('hidden');
    launch.textContent = 'WINDOWS PC + KEYBOARD + MOUSE REQUIRED';
    download.textContent = 'DOWNLOAD ON A WINDOWS PC';
    downloadStatus.textContent = 'Open this page on a Windows PC with a keyboard and mouse.';
  } else {
    enable(launch, 'parksouls://play');
    if (typeof release.downloadUrl === 'string') {
      try {
        const url = new URL(release.downloadUrl);
        if (url.protocol === 'https:') {
          enable(download, url.href);
          downloadStatus.textContent = 'Windows ZIP' +
            (typeof release.sizeLabel === 'string' && release.sizeLabel ? ' · ' + release.sizeLabel : '') +
            ' · Extract all files before setup.';
        }
      } catch (_) {
        // An absent or malformed release URL leaves the download unavailable.
      }
    }
  }

  launch.addEventListener('click', (event) => {
    if (!supported || launch.getAttribute('aria-disabled') === 'true') {
      event.preventDefault();
      return;
    }
    // A deliberate click lets the browser request permission for the installed app.
    // Do not auto-launch on load, after a download, or when returning with #play.
    launchStatus.textContent = 'Your browser may ask to open Park Souls. Choose Open to continue. If nothing happens, follow the setup guide below; this page cannot check whether the game is installed.';
  });

  download.addEventListener('click', (event) => {
    if (!supported || download.getAttribute('aria-disabled') === 'true') event.preventDefault();
  });
})();
