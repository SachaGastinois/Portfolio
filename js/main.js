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
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

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