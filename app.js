// Язык сайта
const LANG_KEY = 'mindcare-lang';
let currentLang = 'ru';

function t(key) {
  return TRANSLATIONS[currentLang][key] ?? TRANSLATIONS.ru[key] ?? '';
}

function applyLang(lang) {
  currentLang = TRANSLATIONS[lang] ? lang : 'ru';
  document.documentElement.lang = currentLang;
  document.title = t('meta.title');
  document.getElementById('metaDescription').setAttribute('content', t('meta.description'));

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    const active = btn.dataset.lang === currentLang;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  try { localStorage.setItem(LANG_KEY, currentLang); } catch (e) {}
}

document.querySelectorAll('.lang-btn').forEach((btn) => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

let savedLang = null;
try { savedLang = localStorage.getItem(LANG_KEY); } catch (e) {}
applyLang(savedLang || 'ru');

// Мобильное меню
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

mainNav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// FAQ
document.querySelectorAll('.faq-question').forEach((question) => {
  question.addEventListener('click', () => {
    const item = question.closest('.faq-item');
    const open = item.classList.toggle('open');
    question.setAttribute('aria-expanded', String(open));
  });
});

// Модальное окно записи
const overlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const modalSuccess = document.getElementById('modalSuccess');
const form = document.getElementById('bookingForm');
const serviceSelect = document.getElementById('modalServiceSelect');
const specialistInput = document.getElementById('modalSpecialistInput');
let lastFocused = null;

function openModal(trigger) {
  lastFocused = trigger;
  modalBody.hidden = false;
  modalSuccess.hidden = true;

  const service = trigger && trigger.dataset.service;
  if (service) serviceSelect.value = service;
  // Имя берётся из карточки, чтобы оно было на текущем языке
  const specialistCard = trigger && trigger.closest('.specialist-card');
  specialistInput.value = specialistCard ? specialistCard.querySelector('h3').textContent.trim() : '';

  overlay.classList.add('open');
  document.body.classList.add('modal-open');
  form.querySelector('input[name="name"]').focus();
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.classList.remove('modal-open');
  form.reset();
  clearErrors();
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll('[data-open-modal]').forEach((btn) => {
  btn.addEventListener('click', () => openModal(btn));
});

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalSuccessClose').addEventListener('click', closeModal);

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
});

// Валидация формы
function clearErrors() {
  form.querySelectorAll('.field-error').forEach((el) => el.remove());
  form.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));
}

function showError(field, message) {
  field.classList.add('invalid');
  const error = document.createElement('span');
  error.className = 'field-error';
  error.textContent = message;
  field.parentElement.appendChild(error);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();

  const name = form.elements.name;
  const phone = form.elements.phone;
  let valid = true;

  if (name.value.trim().length < 2) {
    showError(name, t('form.err.name'));
    valid = false;
  }
  if (phone.value.replace(/\D/g, '').length < 10) {
    showError(phone, t('form.err.phone'));
    valid = false;
  }
  if (!valid) return;

  modalBody.hidden = true;
  modalSuccess.hidden = false;
});
