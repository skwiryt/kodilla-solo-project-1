function toggleMenu(visible) {
  document.querySelector('.side-menu').classList.toggle('side-menu--show', visible);
}

document.querySelector('.hamburger-image').addEventListener('click', function(e) {
  e.preventDefault();
  toggleMenu();
});