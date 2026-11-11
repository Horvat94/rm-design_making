(() => {
  const modalElement = document.querySelector('#newsletterModal');
  const form = document.querySelector('#newsletterForm');
  const success = document.querySelector('#newsletterSuccess');
  if (!modalElement || !form || !success) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    event.stopPropagation();

    form.classList.add('was-validated');
    if (!form.checkValidity()) return;

    form.hidden = true;
    success.hidden = false;
  });
})();