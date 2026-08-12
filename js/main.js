(() => {
  const phone = "527771555704";
  const body = document.body;
  const loader = document.getElementById("loader");
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mob-menu");
  const form = document.getElementById("wa-form");
  const year = document.getElementById("year");
  const marquee = document.getElementById("marquee");

  body.classList.add("is-loading");

  const startedAt = performance.now();
  const hideLoader = () => {
    const elapsed = performance.now() - startedAt;
    const wait = Math.max(0, 1850 - elapsed);
    window.setTimeout(() => {
      loader?.classList.add("hidden");
      body.classList.remove("is-loading");
    }, wait);
  };

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, { once: true });
  }

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const onScroll = () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  hamburger?.addEventListener("click", () => {
    const isOpen = mobileMenu?.classList.toggle("open");
    hamburger.classList.toggle("active", Boolean(isOpen));
    hamburger.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger?.classList.remove("active");
      hamburger?.setAttribute("aria-expanded", "false");
    });
  });

  if (marquee) {
    const items = [
      "Huatulco",
      "Tequila",
      "Guadalajara",
      "Cantaritos Cheches",
      "Campos de agave",
      "Tonala",
      "Paseo a 7 Bahias",
      "Atencion por WhatsApp"
    ];
    const html = [...items, ...items].map((item) => (
      `<span class="marquee-item"><span class="marquee-dot"></span>${item}</span>`
    )).join("");
    marquee.innerHTML = html;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const number = entry.target;
      const end = Number(number.dataset.count || 0);
      const suffix = number.dataset.suffix || "";
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(end * eased);
        number.textContent = `${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(number);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll(".stat-num").forEach((number) => {
    countObserver.observe(number);
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("f-name")?.value.trim();
    const interest = document.getElementById("f-interest")?.value;
    const message = document.getElementById("f-msg")?.value.trim();

    if (!name || !message) {
      form.reportValidity();
      return;
    }

    const text = [
      "Hola Excursiones Vicky, visite su pagina web y quiero informacion.",
      `Nombre: ${name}`,
      `Excursion de interes: ${interest}`,
      `Mensaje: ${message}`
    ].join("\n");

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });

  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  const particles = [];
  const colors = ["#4caf50", "#ff9800", "#2196f3", "#19e7f7", "#cf5bdf"];
  let width = 0;
  let height = 0;
  let raf = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles.length = 0;
    const count = Math.max(52, Math.floor((width * height) / 18000));
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.4 + 0.8,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        alpha: Math.random() * 0.45 + 0.12,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
      glow.addColorStop(0, `${p.color}${Math.round(p.alpha * 255).toString(16).padStart(2, "0")}`);
      glow.addColorStop(1, `${p.color}00`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha + 0.18;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    raf = requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pagehide", () => cancelAnimationFrame(raf), { once: true });
})();
