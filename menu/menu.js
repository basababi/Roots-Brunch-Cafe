(() => {
  const section = document.getElementById("menu");
  if (!section) return;

  const filters = section.querySelector(".roots-menu-filters");
  const filterButtons = [...filters.querySelectorAll("[data-category]")];
  const dishes = [...section.querySelectorAll("[data-dish-category]")];
  const moreControl = section.querySelector(".roots-menu-more");
  const moreButton = moreControl.querySelector("button");
  const moreLabel = moreButton.querySelector("[data-more-label]");
  const lessLabel = moreButton.querySelector("[data-less-label]");
  const status = section.querySelector(".roots-menu-status");
  const previewCount = 3;
  let category = "all";
  let expanded = false;

  function render(announce = false) {
    const english = document.documentElement.lang === "en";
    let visibleCount = 0;

    for (const button of filterButtons) {
      button.setAttribute("aria-pressed", String(button.dataset.category === category));
    }

    dishes.forEach((dish, index) => {
      const visible = category === "all"
        ? expanded || index < previewCount
        : dish.dataset.dishCategory === category;
      dish.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    filters.setAttribute("aria-label", english ? "Menu categories" : "Хоолны ангилал");
    filters.hidden = false;
    moreControl.hidden = category !== "all" || dishes.length <= previewCount;
    moreButton.setAttribute("aria-expanded", String(expanded));
    moreLabel.hidden = expanded;
    lessLabel.hidden = !expanded;

    status.textContent = announce
      ? (english ? `${visibleCount} dishes shown.` : `${visibleCount} нэрийн хоол харагдаж байна.`)
      : "";
  }

  filters.addEventListener("click", event => {
    const button = event.target.closest("button[data-category]");
    if (!button || category === button.dataset.category) return;
    category = button.dataset.category;
    expanded = false;
    render(true);
  });

  moreButton.addEventListener("click", event => {
    expanded = !expanded;
    render(true);
    if (expanded && event.detail === 0) {
      const firstNewDish = dishes[previewCount];
      firstNewDish.tabIndex = -1;
      firstNewDish.focus({ preventScroll: true });
      firstNewDish.scrollIntoView({ block: "nearest" });
    }
  });

  window.addEventListener("roots:language", () => render());
  render();
})();
