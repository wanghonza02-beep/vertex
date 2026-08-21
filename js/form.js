/* Inquiry form + a tiny toast, matching components/feedback/Toast.jsx.
   No backend is wired up — see the comment at INTEGRATION POINT below for how to
   connect a real one (Formspree, Netlify Forms, a serverless function, etc). */
(function () {
  let toastEl = null;
  let toastTimer = null;

  function showToast(message, tone) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'vx-toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.setAttribute('data-tone', tone || 'neutral');
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 4200);
  }

  function initInquiryForm() {
    const form = document.getElementById('inquiryForm');
    if (!form) return;
    const submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;

      const original = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      /* INTEGRATION POINT — replace this simulated delay with a real submission, e.g.:
         fetch('https://formspree.io/f/YOUR_ID', {
           method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }
         }).then(() => { ... }).catch(() => { ... });
         Until then the form validates and gives real confirmation feedback, but no
         enquiry actually leaves the browser. */
      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
        form.reset();
        showToast('Enquiry sent', 'success');
      }, 900);
    });
  }

  window.VertexToast = { show: showToast };
  window.VertexForm = { initInquiryForm: initInquiryForm };
})();
