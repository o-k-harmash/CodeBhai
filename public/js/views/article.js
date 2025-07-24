export function renderArticle(aside) {
  if (!aside) {
    return;
  }

  aside.addEventListener("click", (event) => {
    if (!event.target.closest("a")) {
      return;
    }

    const targetLi = event.target.closest("li");

    if (!targetLi || !aside.contains(targetLi)) {
      return;
    }

    const items = aside.querySelectorAll("li");
    items.forEach((el) => el.classList.remove("aside__item--active"));

    targetLi.classList.add("aside__item--active");
  });
}
