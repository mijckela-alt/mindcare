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
  const specialist = trigger && trigger.dataset.specialist;
  if (service) serviceSelect.value = service;
  specialistInput.value = specialist || '';

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
    showError(name, 'Укажите имя');
    valid = false;
  }
  if (phone.value.replace(/\D/g, '').length < 10) {
    showError(phone, 'Укажите корректный номер телефона');
    valid = false;
  }
  if (!valid) return;

  modalBody.hidden = true;
  modalSuccess.hidden = false;
});
