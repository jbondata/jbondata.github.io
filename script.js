(() => {
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  const navLinks = Array.from(document.querySelectorAll(".site-nav .nav-link"));
  const mobileNavQuery = window.matchMedia("(max-width: 780px)");

  const animated = document.querySelectorAll(".animate-on-scroll");
  function revealAllAnimated() {
    animated.forEach((el) => el.classList.add("in-view"));
  }

  // Subtle scroll animations: progressively enhance when observer support exists.
  if (animated.length) {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealAllAnimated();
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -40px 0px", threshold: 0.1 }
      );
      animated.forEach((el) => observer.observe(el));
    }
  }

  function setNavOpen(open) {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    siteNav.classList.toggle("open", open);
    navToggle.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu"
    );
  }

  if (navToggle && siteNav) {
    setNavOpen(false);

    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      setNavOpen(!open);
    });

    document.addEventListener("click", (e) => {
      if (!siteNav.classList.contains("open")) return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest("#siteNav") || target.closest("#navToggle")) return;
      setNavOpen(false);
    });

    navLinks.forEach((a) => {
      a.addEventListener("click", () => setNavOpen(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setNavOpen(false);
      }
    });

    mobileNavQuery.addEventListener("change", (e) => {
      if (!e.matches) {
        setNavOpen(false);
      }
    });
  }

  const sectionIds = ["home", "projects", "about", "resume", "contact"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const linkByHash = new Map(
    navLinks.map((a) => [a.getAttribute("href") || "", a])
  );

  const sectionRatios = new Map();
  sectionIds.forEach((id) => sectionRatios.set(id, 0));

  function setCurrent(hash) {
    navLinks.forEach((a) => a.removeAttribute("aria-current"));
    const a = linkByHash.get(hash);
    if (a) a.setAttribute("aria-current", "page");
  }

  function updateActiveSection() {
    let bestId = null;
    let bestRatio = 0;
    sectionRatios.forEach((ratio, id) => {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestId = id;
      }
    });
    if (bestId) setCurrent(`#${bestId}`);
  }

  function setCurrentFromHash() {
    const hash = window.location.hash || "#home";
    if (linkByHash.has(hash)) {
      setCurrent(hash);
      return;
    }
    setCurrent("#home");
  }

  function updateCurrentSectionByScrollPosition() {
    let activeId = sectionIds[0];
    const marker = window.innerHeight * 0.3;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= marker && rect.bottom > marker) {
        activeId = section.id;
      }
    });

    setCurrent(`#${activeId}`);
  }

  setCurrentFromHash();
  window.addEventListener("hashchange", setCurrentFromHash);

  if (sections.length && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (id) sectionRatios.set(id, entry.intersectionRatio);
        });
        updateActiveSection();
      },
      { root: null, threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((s) => obs.observe(s));
  } else if (sections.length) {
    const onScroll = () => {
      window.requestAnimationFrame(updateCurrentSectionByScrollPosition);
    };
    updateCurrentSectionByScrollPosition();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Copy email
  const copyBtn = document.getElementById("copyEmail");
  const copyNote = document.getElementById("copyNote");
  const email = "jbondata@proton.me";
  let copyNoteTimer = null;

  async function copyToClipboard(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "true");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(ta);
    if (!copied) {
      throw new Error("Copy command rejected");
    }
  }

  if (copyBtn && copyNote) {
    copyBtn.addEventListener("click", async () => {
      copyBtn.disabled = true;
      copyNote.textContent = "";
      if (copyNoteTimer) {
        window.clearTimeout(copyNoteTimer);
      }
      try {
        await copyToClipboard(email);
        copyNote.textContent = "Copied.";
      } catch {
        copyNote.textContent = "Copy failed.";
      }
      copyBtn.disabled = false;
      copyNoteTimer = window.setTimeout(() => {
        copyNote.textContent = "";
      }, 1600);
    });
  }
})();
