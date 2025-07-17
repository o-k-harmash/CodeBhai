const navToggleBtn = document.getElementById("nav-toggle-btn");
const navOverlay = document.getElementById("nav-overlay");
const navSidebarClose = document.getElementById("nav-sidebar-close");
const h3NavItems = document.getElementById("h3ids");

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

navToggleBtn?.addEventListener("click", () => {
  show(navOverlay);
});

navSidebarClose?.addEventListener("click", () => {
  hide(navOverlay);
});

function hide(el) {
  el?.classList.add("hidden");
  el?.setAttribute("aria-hidden", "true");
}

function show(el) {
  el?.classList.remove("hidden");
  el?.setAttribute("aria-hidden", "false");
}
