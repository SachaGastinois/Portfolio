'use strict';
// Each preview owns a generation counter: an old play promise cannot restart
// playback after the pointer leaves, a filter changes, or another video starts.
window.PortfolioPreviews = (() => {
  let controls = [];
  let observer;
  function stopAll(except) { controls.forEach(control => { if (control !== except) control.stop(); }); }
  function destroy() { stopAll(); observer?.disconnect(); controls = []; }
  function mount(projects, text, safeURL) {
    destroy();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    if ('IntersectionObserver' in window) observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) controls.find(control => control.media === entry.target)?.stop();
    }));
    document.querySelectorAll('.project-media').forEach(media => {
      const video = media.querySelector('video');
      if (!video) return;
      const project = projects.find(project => project.id === media.dataset.id);
      const button = media.querySelector('.preview-toggle');
      const feedback = media.querySelector('.preview-feedback');
      let generation = 0, wanted = false;
      const control = {
        media,
        stop() {
          wanted = false; generation++;
          video.pause(); media.classList.remove('is-playing');
          button.setAttribute('aria-pressed', 'false');
          button.setAttribute('aria-label', text('previewButton')); button.textContent = '▶';
          feedback.textContent = '';
        },
        async play() {
          if (wanted) return;
          stopAll(control); wanted = true;
          const request = ++generation;
          video.muted = true; video.defaultMuted = true; video.playsInline = true;
          feedback.textContent = text('previewLoading');
          if (!video.getAttribute('src')) {
            video.src = safeURL(project.previewVideo || project.video);
            video.load();
          }
          button.setAttribute('aria-pressed', 'true');
          button.setAttribute('aria-label', text('stopPreview')); button.textContent = 'Ⅱ';
          try {
            // Play immediately, muted; do not wait for metadata and seek in the
            // large source file before playback. Dedicated clips are fast-start MP4.
            await video.play();
            if (request !== generation) { if (!wanted) video.pause(); return; }
            media.classList.add('is-playing'); feedback.textContent = '';
          } catch (error) {
            if (request !== generation) return;
            control.stop();
            if (error.name !== 'AbortError') feedback.textContent = text('previewError');
          }
        }
      };
      video.addEventListener('error', () => { control.stop(); feedback.textContent = text('previewError'); });
      // Pointer type is reliable even when a desktop browser reports no fine hover.
      media.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch' && !reduced.matches) control.play(); });
      media.addEventListener('pointerleave', event => { if (event.pointerType !== 'touch') control.stop(); });
      button.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); wanted ? control.stop() : control.play(); });
      controls.push(control); observer?.observe(media);
    });
  }
  return { mount, destroy, stopAll };
})();
