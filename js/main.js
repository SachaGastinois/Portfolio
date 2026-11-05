document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
      mobileMenuBtn.setAttribute('aria-expanded', String(!mobileMenu.classList.contains('hidden')));
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Preview posters: load videos only when the pointer enters a card.
  // Set data-preview-image on a card to override the image; video source stays in HTML.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.project-card').forEach(card => {
    const frame = card.querySelector('.h-56');
    if (!frame) return;
    const video = frame.querySelector('video');
    const posterPath = card.dataset.previewImage || video?.dataset.poster || '';
    if (posterPath) {
      const poster = document.createElement('img');
      poster.src = posterPath;
      poster.alt = '';
      poster.loading = 'lazy';
      poster.className = 'project-poster absolute inset-0 w-full h-full object-cover';
      frame.insertBefore(poster, frame.firstChild);
      if (video) video.setAttribute('poster', posterPath);
    }
    if (!video) return;
    video.classList.add('project-preview-video');
    video.preload = 'none';
    video.pause();
    const startPreview = () => {
      if (reducedMotion.matches || !window.matchMedia('(hover: hover)').matches) return;
      const source = video.querySelector('source[data-src]');
      if (source) {
        source.src = source.dataset.src;
        source.removeAttribute('data-src');
        video.load();
      }
      video.currentTime = 0;
      video.play().then(() => card.classList.add('preview-playing')).catch(() => {});
    };
    const stopPreview = () => {
      video.pause();
      card.classList.remove('preview-playing');
      try { video.currentTime = 0; } catch (_) {}
    };
    card.addEventListener('mouseenter', startPreview);
    card.addEventListener('mouseleave', stopPreview);
    card.addEventListener('focusout', event => {
      if (!card.contains(event.relatedTarget)) stopPreview();
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopPreview(); });
  });

  // Copy Email Feature
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const emailText = document.getElementById('emailText').innerText;
      navigator.clipboard.writeText(emailText).then(() => {
        alert("Adresse e-mail copiée dans le presse-papier !");
      });
    });
  }

  // Contact Form Handler
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formStatus.textContent = "Message transmis avec succès !";
          formStatus.classList.remove('hidden');
          contactForm.reset();
        } else {
          formStatus.textContent = "Erreur lors de l'envoi. Veuillez réessayez.";
          formStatus.classList.remove('hidden');
        }
      } catch (error) {
        formStatus.textContent = "Erreur de connexion.";
        formStatus.classList.remove('hidden');
      }
    });
  }
});