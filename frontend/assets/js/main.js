/* Portfolio interactions: theme, menu, reveals, nav highlight, filters, contact form */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;

  /* Theme (only the theme preference is stored locally) */
  try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch (e) {}
  $("#themeToggle").addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* Mobile menu */
  const menuBtn = $("#menuBtn"), links = $("#navLinks");
  const setMenu = open => { links.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", open); };
  menuBtn.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  $$("a", links).forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => e.key === "Escape" && setMenu(false));

  /* Section reveal + active nav (IntersectionObserver: no scroll listeners) */
  const revealIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); }
  }), { threshold: .12 });
  $$(".reveal").forEach(el => revealIO.observe(el));

  const navIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$("a", links).forEach(a => {
      const on = a.getAttribute("href") === "#" + e.target.id;
      a.classList.toggle("active", on);
      on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
    });
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(s => navIO.observe(s));

  /* Project filter */
  $$(".filter").forEach(btn => btn.addEventListener("click", () => {
    $$(".filter").forEach(b => b.classList.toggle("active", b === btn));
    $$(".project").forEach(p => p.classList.toggle("hide", btn.dataset.filter !== "all" && p.dataset.cat !== btn.dataset.filter));
  }));


  /* Cursor-reactive 3D tilt for the hero portrait (skipped for reduced motion) */
  const stage = $("#avatarStage"), hero = $("#home"), pupils = $$(".pupil");
  if (stage && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let raf = 0;
    const apply = (rx, ry) => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { stage.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; }); };
    window.addEventListener("pointermove", e => {
      if (e.pointerType === "touch" || hero.getBoundingClientRect().bottom < 0) return;
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      apply((-y * 18).toFixed(2), (x * 26).toFixed(2));
      pupils.forEach(p => { p.style.transform = `translate(${(x * 9).toFixed(1)}px, ${(y * 5).toFixed(1)}px)`; });
    }, { passive: true });
    document.addEventListener("pointerleave", () => apply(0, 0));
  }

  /* Back to top + footer year */
  const toTop = $("#toTop");
  window.addEventListener("scroll", () => toTop.classList.toggle("show", scrollY > 600), { passive: true });
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  $("#year").textContent = new Date().getFullYear();

  /* Contact: typing terminal + live Bangalore clock */
  const term = $("#termOut");
  if (term) {
    const full = term.textContent;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      term.textContent = "";
      const typeIO = new IntersectionObserver(es => {
        if (!es[0].isIntersecting) return;
        typeIO.disconnect();
        let i = 0;
        (function step() { term.textContent = full.slice(0, ++i); if (i < full.length) setTimeout(step, 28); })();
      }, { threshold: .4 });
      typeIO.observe($("#terminal"));
    }
  }
  const clock = $("#clock");
  const tick = () => { clock.textContent = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }).format(new Date()) + " IST"; };
  if (clock) { tick(); setInterval(tick, 30000); }

  /* Contact form -> Flask backend */
  const form = $("#contactForm"), btn = $("#submitBtn"), status = $("#formStatus");
  const say = (msg, ok) => { status.textContent = msg; status.className = "status " + (ok ? "ok" : "err"); };

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (data.website) return; // Honeypot: silently ignore automated submissions.
    if (!data.name.trim() || !data.email.trim() || !data.subject.trim() || !data.message.trim()) return say("Please fill in all fields.", false);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return say("Please enter a valid email address.", false);

    const apiUrl = (window.PORTFOLIO_CONFIG?.API_URL || "").trim().replace(/\/$/, "");
    if (!apiUrl) return say("The contact form is not connected yet. Please email me directly.", false);

    btn.disabled = true; btn.textContent = "Sending…"; say("", true);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 45000); // Render free tier may need time to wake up
    try {
      const res = await fetch(apiUrl + "/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), signal: ctrl.signal
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.success) { say(body.message || "Thank you! Your message was received.", true); form.reset(); }
      else say(body.error || "Something went wrong. Please try again.", false);
    } catch (err) {
      say("The server is currently unavailable. Please email me directly or try again shortly.", false);
    } finally { clearTimeout(timer); btn.disabled = false; btn.textContent = "Send Message"; }
  });
})();
