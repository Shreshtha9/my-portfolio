// Scrolls to a section by id. Uses Lenis (smooth scroll) when available.
export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -70 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
};