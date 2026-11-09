(() => {
  const modalElement = document.querySelector('#newsletterModal');
  const form = document.querySelector('#newsletterForm');
  const success = document.querySelector('#newsletterSuccess');
  if (!modalElement || !form || !success || !window.bootstrap?.Modal) return;

  const dismissalKey = 'rm-newsletter-dismissed';
  const modal = new bootstrap.Modal(modalElement);

  if (!sessionStorage.getItem(dismissalKey)) {
    window.setTimeout(() => modal.show(), 5000);
  }

  modalElement.addEventListener('hidden.bs.modal', () => {
    sessionStorage.setItem(dismissalKey, 'true');
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add('was-validated');
    if (!form.checkValidity()) return;

    form.hidden = true;
    success.hidden = false;
  });
})();
