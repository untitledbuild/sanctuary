/**
 * Contact-form submission → Supabase.
 *
 * The form writes a row straight to Supabase from the browser using the PUBLIC
 * anon key (read from <meta> in BaseLayout). This is safe BECAUSE the table has
 * an INSERT-only Row-Level-Security policy (see infra/supabase/schema.sql): the
 * anon role can add a submission but cannot read, update or delete any. No
 * server, no secret in the bundle — the site stays 100% static.
 *
 * Progressive enhancement: with JS off the form is inert (a static site can't
 * POST anyway); the footer's mailto: is the fallback path.
 */
const TABLE = 'contact_submissions';

function meta(name: string): string {
  return (
    document
      .querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
      ?.content?.trim() ?? ''
  );
}

function setStatus(
  el: HTMLElement,
  kind: 'success' | 'error',
  message: string,
): void {
  el.textContent = message;
  el.classList.remove('hidden');
  el.style.color =
    kind === 'success' ? 'var(--color-check)' : 'var(--color-diff-del)';
}

function initForm(form: HTMLFormElement): void {
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const submitLabel = submit?.dataset.submitLabel ?? submit?.textContent ?? '';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!status) return;

    const data = new FormData(form);

    // Honeypot — a filled "company" field means a bot. Pretend success.
    if ((data.get('company') as string)?.trim()) {
      setStatus(status, 'success', status.dataset.success ?? 'Thanks!');
      form.reset();
      return;
    }

    const payload = {
      name: ((data.get('name') as string) || '').trim(),
      email: ((data.get('email') as string) || '').trim(),
      project_type: ((data.get('project_type') as string) || '').trim(),
      message: ((data.get('message') as string) || '').trim(),
    };

    // Minimal client validation (email required + sane format).
    if (!payload.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) {
      setStatus(status, 'error', 'Please enter a valid email address.');
      form.querySelector<HTMLInputElement>('#cf-email')?.focus();
      return;
    }

    const url = meta('supabase-url');
    const key = meta('supabase-anon-key');
    if (!url || !key) {
      // Endpoint not configured yet — fail gracefully toward email.
      setStatus(status, 'error', status.dataset.error ?? 'Please email us.');
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.textContent = '[ SENDING… ]';
    }

    try {
      const res = await fetch(`${url}/rest/v1/${TABLE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: key,
          Authorization: `Bearer ${key}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Supabase responded ${res.status}`);
      setStatus(status, 'success', status.dataset.success ?? 'Thanks!');
      form.reset();
    } catch (err) {
      console.error('[contact] submit failed:', err);
      setStatus(status, 'error', status.dataset.error ?? 'Please email us.');
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = submitLabel;
      }
    }
  });
}

document
  .querySelectorAll<HTMLFormElement>('[data-contact-form]')
  .forEach(initForm);
