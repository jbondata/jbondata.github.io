(() => {
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  const navLinks = Array.from(document.querySelectorAll(".site-nav .nav-link"));

  // Subtle scroll animations: add .in-view when elements enter viewport
  const animated = document.querySelectorAll(".animate-on-scroll");
  if (animated.length && "IntersectionObserver" in window) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
            }
          });
        },
        { rootMargin: "0px 0px -40px 0px", threshold: 0.1 }
      );
      animated.forEach((el) => observer.observe(el));
    } else {
      animated.forEach((el) => el.classList.add("in-view"));
    }
  }

  function setNavOpen(open) {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    siteNav.classList.toggle("open", open);
  }

  if (navToggle && siteNav) {
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
  }

  // Active section highlighting (simple, no dependencies)
  const sections = ["home", "projects", "about", "resume", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const linkByHash = new Map(
    navLinks.map((a) => [a.getAttribute("href") || "", a])
  );

  function setCurrent(hash) {
    navLinks.forEach((a) => a.removeAttribute("aria-current"));
    const a = linkByHash.get(hash);
    if (a) a.setAttribute("aria-current", "page");
  }

  if (sections.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        // Pick the most visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (!visible) return;
        const id = visible.target.id;
        setCurrent(`#${id}`);
      },
      { root: null, threshold: [0.2, 0.35, 0.5, 0.65] }
    );

    sections.forEach((s) => obs.observe(s));
  }

  // Copy email
  const copyBtn = document.getElementById("copyEmail");
  const copyNote = document.getElementById("copyNote");
  const email = "jbondata@proton.me";

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
    document.execCommand("copy");
    document.body.removeChild(ta);
  }

  if (copyBtn && copyNote) {
    copyBtn.addEventListener("click", async () => {
      copyNote.textContent = "";
      try {
        await copyToClipboard(email);
        copyNote.textContent = "Copied.";
      } catch {
        copyNote.textContent = "Copy failed.";
      }
      window.setTimeout(() => {
        copyNote.textContent = "";
      }, 1600);
    });
  }
})();

