export function hide(el) {
  el?.classList.add("hidden");
  el?.setAttribute("aria-hidden", "true");
}

export function show(el) {
  el?.classList.remove("hidden");
  el?.setAttribute("aria-hidden", "false");
}
