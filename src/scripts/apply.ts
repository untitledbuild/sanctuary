/**
 * Careers apply dialog — open/close, résumé selection, and submission.
 *
 * Submission mirrors form.ts: straight from the browser with the PUBLIC anon
 * key, safe only because of the INSERT-only RLS policy (and, for the résumé, an
 * insert-only Storage policy) — see infra/supabase/schema.sql. Until
 * PUBLIC_SUPABASE_* are configured it no-ops toward the mailto: fallback rather
 * than pretending to succeed.
 *
 * The résumé is uploaded to Storage first; the row records its path. If the
 * upload fails we stop there rather than filing an application with no CV.
 */
const TABLE = 'job_applications';
const BUCKET = 'resumes';

const MAX_BYTES = 10 * 1024 * 1024; // 10 mb, matching the hint in the UI
const ALLOWED = /\.(pdf|docx)$/i;

function meta(name: string): string {
  return (
    document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)?.content?.trim() ?? ''
  );
}

function setStatus(el: HTMLElement, kind: 'success' | 'error', message: string): void {
  el.textContent = message;
  el.classList.remove('hidden');
  el.style.color = kind === 'success' ? 'var(--color-check)' : 'var(--color-diff-del)';
}

/** Strip anything that would be awkward in a Storage object key. */
function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
}

function init(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-apply-dialog]');
  const form = document.querySelector<HTMLFormElement>('[data-apply-form]');
  if (!dialog || !form) return;

  const position = form.querySelector<HTMLSelectElement>('#ap-position');
  const file = form.querySelector<HTMLInputElement>('#ap-resume');
  const filename = form.querySelector<HTMLElement>('[data-apply-filename]');
  const status = form.querySelector<HTMLElement>('[data-apply-status]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const submitLabel = submit?.dataset.submitLabel ?? 'Submit';
  const dropzone = form.querySelector<HTMLElement>('[data-apply-drop]');
  const filenameDefault = filename?.innerHTML ?? '';

  /* ---------------------------------------------------------- open/close --- */
  document.querySelectorAll<HTMLElement>('[data-apply-open]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const role = trigger.dataset.position;
      if (position) {
        // A trigger with no role ("Introduce Yourself") resets to the open
        // option rather than inheriting whatever was selected last time.
        position.value = role ?? position.options[0]?.value ?? '';
      }
      status?.classList.add('hidden');
      dialog.showModal();
    });
  });

  form
    .closest('dialog')
    ?.querySelector<HTMLButtonElement>('[data-apply-close]')
    ?.addEventListener('click', () => dialog.close());

  // Click outside the panel closes it. The dialog element fills the viewport
  // for hit-testing, so compare against its content box.
  dialog.addEventListener('click', (e) => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    const outside =
      e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (outside) dialog.close();
  });

  /* ------------------------------------------------------------- résumé ---- */
  const showFile = (f: File | undefined): void => {
    if (!filename) return;
    if (!f) {
      filename.innerHTML = filenameDefault;
      return;
    }
    const kb = f.size < 1024 * 1024
      ? `${Math.round(f.size / 1024)} kb`
      : `${(f.size / 1024 / 1024).toFixed(1)} mb`;
    filename.textContent = `${f.name} (${kb})`;
  };

  file?.addEventListener('change', () => showFile(file.files?.[0]));

  if (dropzone && file) {
    ['dragenter', 'dragover'].forEach((t) =>
      dropzone.addEventListener(t, (e) => {
        e.preventDefault();
        dropzone.classList.add('border-heading');
      }),
    );
    ['dragleave', 'drop'].forEach((t) =>
      dropzone.addEventListener(t, () => dropzone.classList.remove('border-heading')),
    );
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      const dropped = (e as DragEvent).dataTransfer?.files?.[0];
      if (!dropped) return;
      const dt = new DataTransfer();
      dt.items.add(dropped);
      file.files = dt.files;
      showFile(dropped);
    });
  }

  /* ------------------------------------------------------------- submit ---- */
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!status) return;

    const data = new FormData(form);
    const name = ((data.get('name') as string) || '').trim();
    const email = ((data.get('email') as string) || '').trim();
    const role = ((data.get('position') as string) || '').trim();
    const resume = file?.files?.[0];

    if (!name) {
      setStatus(status, 'error', 'Please enter your name.');
      form.querySelector<HTMLInputElement>('#ap-name')?.focus();
      return;
    }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus(status, 'error', 'Please enter a valid email address.');
      form.querySelector<HTMLInputElement>('#ap-email')?.focus();
      return;
    }
    if (!resume) {
      setStatus(status, 'error', 'Please attach your résumé.');
      file?.focus();
      return;
    }
    if (!ALLOWED.test(resume.name)) {
      setStatus(status, 'error', 'Résumé must be a PDF or DOCX.');
      return;
    }
    if (resume.size > MAX_BYTES) {
      setStatus(status, 'error', 'Résumé must be 10 mb or smaller.');
      return;
    }

    const url = meta('supabase-url');
    const key = meta('supabase-anon-key');
    if (!url || !key) {
      setStatus(status, 'error', status.dataset.error ?? 'Please email us.');
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Sending…';
    }

    try {
      const path = `${Date.now()}-${crypto.randomUUID()}-${safeName(resume.name)}`;
      const up = await fetch(`${url}/storage/v1/object/${BUCKET}/${path}`, {
        method: 'POST',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': resume.type || 'application/octet-stream',
        },
        body: resume,
      });
      if (!up.ok) throw new Error(`Storage responded ${up.status}`);

      const res = await fetch(`${url}/rest/v1/${TABLE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: key,
          Authorization: `Bearer ${key}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ name, email, position: role, resume_path: path }),
      });
      if (!res.ok) throw new Error(`Supabase responded ${res.status}`);

      setStatus(status, 'success', status.dataset.success ?? 'Thanks!');
      form.reset();
      showFile(undefined);
    } catch (err) {
      console.error('[apply] submit failed:', err);
      setStatus(status, 'error', status.dataset.error ?? 'Please email us.');
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = submitLabel;
      }
    }
  });
}

if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);

/* Marks this file a module so its top-level names are scoped to it rather
   than merged into the global script scope (they collide otherwise). */
export {};
