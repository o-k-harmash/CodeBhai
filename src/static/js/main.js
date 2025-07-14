const navToggleBtn = document.getElementById("nav-toggle-btn");
const navOverlay = document.getElementById("nav-overlay");
const navSidebarClose = document.getElementById("nav-sidebar-close");
const navInlineMenu = document.getElementById("nav-inline-menu");
const h3NavItems = document.getElementById("h3ids");
const avatar = document.getElementById("nav-user-avatar");
const loginButton = document.getElementById("github-login-btn");

const cookies = document.cookie.split(";").reduce((acc, item) => {
  const [key, val] = item.trim().split("=");
  acc[key] = decodeURIComponent(val);
  return acc;
}, {});

h3NavItems &&
  h3NavItems.addEventListener("click", (event) => {
    if (!event.target.closest("a")) {
      return;
    }

    const targetLi = event.target.closest("li");

    if (!targetLi || !h3NavItems.contains(targetLi)) return;

    const items = h3NavItems.querySelectorAll("li");
    items.forEach((el) => el.classList.remove("aside__item--active"));

    targetLi.classList.add("aside__item--active");
  });

navToggleBtn &&
  navToggleBtn.addEventListener("click", () => {
    show(navOverlay);
  });

navSidebarClose &&
  navSidebarClose.addEventListener("click", () => {
    hide(navOverlay);
  });

if (navOverlay && navInlineMenu && navToggleBtn) {
  function updateNavVisibility() {
    hide(navOverlay);

    const avatarUrl = cookies.avatar;
    const isMobile = window.innerWidth < 780;
    const isLoggedIn = avatarUrl && avatar;

    if (isLoggedIn) {
      avatar.src = avatarUrl;
      hide(loginButton);

      show(navInlineMenu);
      isMobile ? show(navToggleBtn) : hide(navToggleBtn);
      if (isMobile) hide(navInlineMenu);
    } else {
      hide(navInlineMenu);
      hide(navToggleBtn);
      show(loginButton);
    }
  }

  const mq = window.matchMedia("(max-width: 780px)");
  mq.addEventListener("change", updateNavVisibility);
  window.addEventListener("DOMContentLoaded", updateNavVisibility);
}

function hide(el) {
  el?.classList.add("hidden");
  el?.setAttribute("aria-hidden", "true");
}

function show(el) {
  el?.classList.remove("hidden");
  el?.setAttribute("aria-hidden", "false");
}
