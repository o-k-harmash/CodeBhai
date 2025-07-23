const navToggleBtn = document.getElementById("nav-toggle-btn");
const navInlineMenu = document.getElementById("nav-inline-menu");
const navOverlay = document.getElementById("nav-overlay");
const navSidebarClose = document.getElementById("nav-sidebar-close");
const h3NavItems = document.getElementById("h3ids");
const githubLoginButton = document.getElementById("github-login-btn");
const avatar = document.getElementById("nav-user-avatar");
const loginLink = document.getElementById("login-link");
const logoutLink = document.getElementById("logout-link");
const navContent = document.getElementById("nav-content");

const mobileBreakpontPx = 768;

const cookies = (function parseCookies() {
  return Object.fromEntries(
    document.cookie.split("; ").map((entry) => {
      const [key, value] = entry.split("=");
      return [key, decodeURIComponent(value)];
    }),
  );
})();

const state = {
  avatar: cookies.avatar,
  isMobile: window.innerWidth < mobileBreakpontPx,
  isAuthenticated: cookies.auth,
};

window.addEventListener("resize", () => {
  const wasMobile = state.isMobile;
  const isMobileNow = window.innerWidth < mobileBreakpontPx;

  if (wasMobile !== isMobileNow) {
    state.isMobile = isMobileNow;
    renderUI();
  }
});

renderUI();

h3NavItems?.addEventListener("click", (event) => {
  if (!event.target.closest("a")) {
    return;
  }

  const targetLi = event.target.closest("li");

  if (!targetLi || !h3NavItems.contains(targetLi)) return;

  const items = h3NavItems.querySelectorAll("li");
  items.forEach((el) => el.classList.remove("aside__item--active"));

  targetLi.classList.add("aside__item--active");
});

function renderUI() {
  if (state.isMobile) {
    hide(navInlineMenu);
    show(navToggleBtn);
  } else {
    show(navInlineMenu);
    hide(navToggleBtn);
  }

  if (state.isAuthenticated) {
    show(avatar);
    hide(githubLoginButton);
    hide(loginLink);
    show(logoutLink);
  } else {
    hide(avatar);
    show(githubLoginButton);
    show(loginLink);
    hide(logoutLink);
  }

  navToggleBtn?.addEventListener("click", () => {
    show(navOverlay);
  });

  navSidebarClose?.addEventListener("click", () => {
    hide(navOverlay);
  });

  avatar.src = state.avatar;
  show(navContent);
}

function hide(el) {
  el?.classList.add("hidden");
  el?.setAttribute("aria-hidden", "true");
}

function show(el) {
  el?.classList.remove("hidden");
  el?.setAttribute("aria-hidden", "false");
}
