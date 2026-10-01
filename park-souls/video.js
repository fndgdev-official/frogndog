(function () {
  'use strict';

  document.querySelectorAll('[data-park-video]').forEach(function (stage) {
    var video = stage.querySelector('video');
    var button = stage.querySelector('[data-video-play]');
    var error = stage.parentElement.querySelector('[data-video-error]');
    if (!video || !button) return;

    function showError() {
      button.hidden = false;
      if (error) error.hidden = false;
    }

    button.hidden = !video.paused;
    button.addEventListener('click', function () {
      button.hidden = true;
      if (error) error.hidden = true;
      // Playback and sound start only in response to this deliberate click.
      video.focus({ preventScroll: true });
      try {
        var pending = video.play();
        if (pending && typeof pending.catch === 'function') pending.catch(showError);
      } catch (e) {
        showError();
      }
    });
    video.addEventListener('play', function () {
      button.hidden = true;
      if (error) error.hidden = true;
    });
    // Keep a paused gameplay frame visible; restore the invitation after the film ends.
    video.addEventListener('ended', function () { button.hidden = false; });
    video.addEventListener('error', showError);
  });
})();
