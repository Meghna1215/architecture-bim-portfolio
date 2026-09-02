document.documentElement.classList.add("js");

window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");

  const header = document.querySelector(".site-header");
  const chapters = [...document.querySelectorAll(".capability")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let ticking = false;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  const updateScrollScene = () => {
    const viewportHeight = window.innerHeight;
    const mobile = window.matchMedia("(max-width: 680px)").matches;

    header?.classList.toggle("is-scrolled", window.scrollY > 28);

    chapters.forEach((chapter, index) => {
      const rect = chapter.getBoundingClientRect();
      const enter = mobile || reducedMotion.matches
        ? 1
        : clamp(1 - rect.top / (viewportHeight * 0.88));
      const travel = Math.max(1, rect.height - viewportHeight);
      const progress = mobile || reducedMotion.matches
        ? 0
        : clamp(-rect.top / travel);
      const scale = 1 - progress * 0.032;

      chapter.style.setProperty("--chapter-enter", enter.toFixed(3));
      chapter.style.setProperty("--chapter-progress", progress.toFixed(3));
      chapter.style.setProperty("--chapter-scale", scale.toFixed(4));
      chapter.style.zIndex = String(index + 2);
      chapter.classList.toggle("is-visible", enter > 0.42 && rect.bottom > 0);
    });

    ticking = false;
  };

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateScrollScene);
    }
  };

  updateScrollScene();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  reducedMotion.addEventListener?.("change", requestUpdate);
});
