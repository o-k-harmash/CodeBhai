const navToggleBtn = document.getElementById("nav-toggle-btn");
const navOverlay = document.getElementById("nav-overlay");
const navSidebarClose = document.getElementById("nav-sidebar-close");
const navInlineMenu = document.getElementById("nav-inline-menu");

if (navOverlay && navInlineMenu && navSidebarClose && navToggleBtn) {
  navToggleBtn.addEventListener("click", () => {
    show(navOverlay);
  });

  navSidebarClose.addEventListener("click", () => {
    hide(navOverlay);
  });

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

function updateNavVisibility() {
  const isMobile = window.innerWidth < 780;

  hide(navOverlay);

  if (isMobile) {
    show(navToggleBtn);
    hide(navInlineMenu);
  } else {
    hide(navToggleBtn);
    show(navInlineMenu);
  }
}
