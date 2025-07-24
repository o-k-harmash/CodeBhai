import { hide, show } from "../utils/visibility.js";

export function renderNavbar(nav, state) {
  if (!nav || !state) {
    return;
  }

  const overlay = nav.querySelector("#nav-overlay");

  const toggle = nav.querySelector("#nav-toggle-btn");
  toggle.addEventListener("click", () => {
    show(overlay);
  });

  const close = nav.querySelector("#nav-sidebar-close");
  close.addEventListener("click", () => {
    hide(overlay);
  });

  nav.innerHTML = navbarTemplate(state);
}

function navbarTemplate(state) {
  const loginLogoutLink = state.isAuthenticated
    ? `<a id="logout-link" class="nav__sidebar-link" href="/auth/github/logout">logout</a>`
    : `<a id="login-link" class="nav__sidebar-link" href="/auth/github">login</a>`;

  const userBlock = state.isAuthenticated
    ? `<div id="avatar" class="nav__user-panel">
         <img id="nav-user-avatar" class="nav__avatar" src="${state.avatar}" />
       </div>`
    : `<a id="github-login-btn" class="button button--green" href="/auth/github">
         Log with Git Hub
       </a>`;

  const sidebar = `
    <button id="nav-toggle-btn" class="nav__toggle-btn" aria-label="Открыть меню">
      <span class="nav__toggle-line"></span>
      <span class="nav__toggle-line"></span>
      <span class="nav__toggle-line"></span>
    </button>
    <div id="nav-overlay" class="nav__overlay" hidden>
      <div class="nav__sidebar">
        <button id="nav-sidebar-close" class="nav__sidebar-close" aria-label="Закрыть меню">×</button>
        <nav class="nav__sidebar-nav">
          <a class="nav__logo nav__sidebar-logo" href="/">
            <strong>C</strong>ode<span class="dot">B</span>hai
          </a>
          <a class="nav__sidebar-link" href="/">home</a>
          <a class="nav__sidebar-link" href="/curriculums">all curriculums</a>
          <a class="nav__sidebar-link" href="/community">community</a>
          <a class="nav__sidebar-link" href="/support">support us</a>
          <hr class="nav__sidebar-separator" />
          ${loginLogoutLink}
        </nav>
      </div>
    </div>`;

  const inlineMenu = `
    <div id="nav-inline-menu" class="nav__inline-menu">
      <a class="nav__link" href="/">home</a>
      <a class="nav__link" href="/curriculums">all curriculums</a>
      <a class="nav__link" href="/community">community</a>
      <a class="nav__link" href="/support">support us</a>
      ${userBlock}
    </div>`;

  return `
    <div id="nav-content" class="nav__content">
      <a class="nav__logo" href="/">
        <strong>C</strong>ode<span class="dot">B</span>hai
      </a>
      ${state.isMobile ? sidebar : inlineMenu}
    </div>
  `;
}
