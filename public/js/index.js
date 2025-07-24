import { parseCookies } from "./utils/cookies.js";
import { renderArticle } from "./views/article.js";
import { renderNavbar } from "./views/main.js";

const mobileBreakpontPx = 768;

const cookies = parseCookies();

const state = {
  avatar: cookies.avatar,
  isMobile: window.innerWidth < mobileBreakpontPx,
  isAuthenticated: cookies.auth,
};

const nav = document.getElementById("nav");

window.addEventListener("resize", () => {
  const wasMobile = state.isMobile;
  const isMobileNow = window.innerWidth < mobileBreakpontPx;

  if (wasMobile !== isMobileNow) {
    state.isMobile = isMobileNow;
    renderNavbar(nav, state);
  }
});

renderNavbar(nav, state);

const aside = document.getElementById("h3ids");

renderArticle(aside);
