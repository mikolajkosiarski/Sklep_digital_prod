/** Local demonstration only. No requests, mail integration or persistence. */
document.querySelectorAll<HTMLFormElement>('[data-contact-form]').forEach((form) => {
  if (form.dataset.contactReady) return;
  const name = form.querySelector<HTMLInputElement>('[name="name"]');
  const email = form.querySelector<HTMLInputElement>('[name="email"]');
  const topic = form.querySelector<HTMLSelectElement>('[name="topic"]');
  const message = form.querySelector<HTMLTextAreaElement>('[name="message"]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const status = form.querySelector<HTMLElement>('[data-contact-status]');
  const preview = form.querySelector<HTMLElement>('[data-contact-preview]');
  if (!name || !email || !topic || !message || !submit || !status || !preview) return;

  const fields = [name, email, topic, message];
  const outputs = [...form.querySelectorAll<HTMLElement>('[data-contact-output]')];
  const clearPreview = () => {
    preview.hidden = true;
    for (const output of outputs) output.textContent = '';
  };
  const clearError = (field: (typeof fields)[number]) => {
    field.removeAttribute('aria-invalid');
    const error = form.querySelector<HTMLElement>(`[data-contact-error="${field.name}"]`);
    if (error) {
      error.hidden = true;
      error.textContent = '';
    }
  };
  const validate = (field: (typeof fields)[number]) => {
    const value = field.value.trim();
    let error = '';
    if (!value) {
      error =
        field === topic
          ? 'Choose a topic.'
          : field === message
            ? 'Write a message of at least 20 characters.'
            : field === email
              ? 'Enter your email address.'
              : 'Enter your name.';
    } else if (field === email && !email.checkValidity()) {
      error = 'Enter a valid email address, for example you@example.com.';
    } else if (field === message && (value.length < 20 || value.length > 3000)) {
      error = 'Use between 20 and 3,000 characters.';
    } else if (!field.checkValidity()) {
      error = 'Check this field and try again.';
    }
    const hint = form.querySelector<HTMLElement>(`[data-contact-error="${field.name}"]`);
    if (error) {
      field.setAttribute('aria-invalid', 'true');
      if (hint) {
        hint.textContent = error;
        hint.hidden = false;
      }
    } else clearError(field);
    return !error;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearPreview();
    const invalid = fields.filter((field) => !validate(field));
    if (invalid.length) {
      status.textContent = `Check ${invalid.length === 1 ? 'the highlighted field' : 'the highlighted fields'}.`;
      invalid[0].focus();
      return;
    }
    const values: Record<string, string> = {
      name: name.value.trim(),
      email: email.value.trim(),
      topic: topic.selectedOptions[0]?.textContent ?? '',
      message: message.value.trim(),
    };
    // Text only: entered markup is never parsed as HTML.
    for (const output of outputs)
      output.textContent = values[output.dataset.contactOutput ?? ''] ?? '';
    preview.hidden = false;
    status.textContent = 'Your message preview is ready.';
    preview.focus();
  });
  form.addEventListener('input', (event) => {
    const field = fields.find((item) => item === event.target);
    if (field) clearError(field);
    if (!preview.hidden) {
      clearPreview();
      status.textContent = 'Your message changed. Preview it again to see the updated version.';
    }
  });
  form.addEventListener('reset', () => {
    fields.forEach(clearError);
    clearPreview();
    status.textContent = 'Form cleared.';
    name.focus();
  });
  form.noValidate = true;
  form.dataset.contactReady = 'true';
  submit.disabled = false;
});
