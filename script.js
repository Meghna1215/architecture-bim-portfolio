document.documentElement.classList.add("js");

window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");

  const header = document.querySelector(".site-header");
  const reel = document.querySelector(".capability-reel");
  const items = reel ? [...reel.querySelectorAll(".capability")] : [];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let ticking = false;
  let activeIndex = -1;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  const scrollToItem = (index) => {
    if (!reel || items.length < 2) return;
    const reelTop = window.scrollY + reel.getBoundingClientRect().top;
    const travel = Math.max(1, reel.offsetHeight - window.innerHeight);
    const destination = reelTop + (index / (items.length - 1)) * travel;
    window.scrollTo({ top: destination, behavior: reducedMotion.matches ? "auto" : "smooth" });
  };

  items.forEach((item, index) => {
    const trigger = item.querySelector(".chapter-heading");
    const panel = item.querySelector(".chapter-body");
    if (!trigger || !panel) return;

    const triggerId = `capability-trigger-${index + 1}`;
    const panelId = `capability-panel-${index + 1}`;
    trigger.id = triggerId;
    trigger.setAttribute("role", "button");
    trigger.setAttribute("tabindex", "0");
    trigger.setAttribute("aria-controls", panelId);
    panel.id = panelId;
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-labelledby", triggerId);

    trigger.addEventListener("click", () => scrollToItem(index));
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        scrollToItem(index);
      }
    });
  });

  const updateReel = () => {
    const viewportHeight = window.innerHeight;
    header?.classList.toggle("is-scrolled", window.scrollY > 28);

    if (reel && items.length) {
      const rect = reel.getBoundingClientRect();
      const travel = Math.max(1, rect.height - viewportHeight);
      const progress = clamp(-rect.top / travel);
      const position = progress * (items.length - 1);
      const nextActiveIndex = Math.round(position);

      items.forEach((item, index) => {
        const continuousOpen = clamp(1 - Math.abs(position - index));
        const open = reducedMotion.matches ? Number(index === nextActiveIndex) : continuousOpen;
        const selected = index === nextActiveIndex;
        const trigger = item.querySelector(".chapter-heading");
        const panel = item.querySelector(".chapter-body");

        item.style.setProperty("--open", open.toFixed(3));
        item.classList.toggle("is-active", selected);
        trigger?.setAttribute("aria-expanded", String(selected));
        panel?.setAttribute("aria-hidden", String(!selected));
      });

      if (nextActiveIndex !== activeIndex) activeIndex = nextActiveIndex;
    }

    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateReel);
  };

  updateReel();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  reducedMotion.addEventListener?.("change", requestUpdate);
});
