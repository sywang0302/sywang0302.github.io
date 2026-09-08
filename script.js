const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#site-nav');

function closeMenu() {
  document.body.classList.remove('nav-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}

menuButton?.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('nav-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
    menuButton?.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 640) closeMenu();
});
