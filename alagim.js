const heroBg = document.getElementById("heroBg");
const heroTitle = document.getElementById("heroTitle");


const MAX_ZOOM_BG = 1.18;
const MAX_ZOOM_TITLE = 1.10;
const ZOOM_RANGE = 500;

function clamp(n, min, max){
  return Math.max(min, Math.min(max, n));
}

function onScroll() {
  const y = window.scrollY;
  const progress = clamp(y / ZOOM_RANGE, 0, 1);

  const bgScale = 1 + (MAX_ZOOM_BG - 1) * progress;
  const titleScale = 1 + (MAX_ZOOM_TITLE - 1) * progress;

  if (heroBg) heroBg.style.transform = `scale(${bgScale})`;
  if (heroTitle) heroTitle.style.transform = `scale(${titleScale})`;

  if (!heroTitle) return;

  const t1 = heroTitle.querySelector(".t1");
  const t2 = heroTitle.querySelector(".t2");
  if (!t1 || !t2) return;

  const isMobile = window.matchMedia("(max-width: 600px)").matches;

  if (isMobile) {
    const splitDistance = window.innerWidth * 0.015;
    const t1Start = window.innerWidth * 0.05;
    const t2Start = window.innerWidth * 0.05;

    t1.style.setProperty(
      "transform",
      `translateX(${t1Start - splitDistance * progress}px)`,
      "important"
    );
    t2.style.setProperty(
      "transform",
      `translateX(${t2Start + splitDistance * progress}px)`,
      "important"
    );
    return;
  }

  const splitDistance = window.innerWidth * 0.03;
  const t1Start = window.innerWidth * 0.15;
  const t2Start = window.innerWidth * 0.50;

  t1.style.setProperty(
    "transform",
    `translateX(${t1Start - splitDistance * progress}px)`,
    "important"
  );
  t2.style.setProperty(
    "transform",
    `translateX(${t2Start + splitDistance * progress}px)`,
    "important"
  );
}


let rafId = null;
window.addEventListener("scroll", () => {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    onScroll();
  });
}, { passive: true });


onScroll();


// ===== ANIMAÇÃO SEÇÃO SOBRE =====
(() => {
  const about = document.querySelector("#about");
  if (!about) return;

  const rail = about.querySelector(".about__rail");
  const title = about.querySelector(".about__title");
  const paras = [...about.querySelectorAll(".about__body p")];
  const image = about.querySelector(".about__imageWrap");

  
  if (title && !title.querySelector(".title-flip")) {
    const originalHTML = title.innerHTML; 
    title.innerHTML = `
      <span class="title-flip" aria-hidden="true">
        <span class="title-front">${originalHTML}</span>
        <span class="title-back">${originalHTML}</span>
      </span>
    `;
  }

 
  if (rail) rail.classList.add("reveal", "reveal--rail");
  if (title) title.classList.add("reveal", "reveal--title");
  paras.forEach((p) => p.classList.add("reveal", "reveal--up"));
  if (image) image.classList.add("reveal", "reveal--image");

  const items = [rail, title, ...paras, image].filter(Boolean);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const idx = items.indexOf(el);

    
      el.style.transitionDelay = `${Math.min(idx * 110, 520)}ms`;

      el.classList.add("is-visible");
      io.unobserve(el);
    });
  }, { threshold: 0.18 });

  items.forEach((el) => io.observe(el));
})();


/* ===== ANIMAÇÃO SEÇÃO  MISSAO===== */
(() => {
  const section = document.querySelector(".editorial");
  if (!section) return;

  const label = section.querySelector(".editorial__label");
  const image = section.querySelector(".editorial__image");
  const lines = [...section.querySelectorAll(".editorial__line")];
  const paras = [...section.querySelectorAll(".editorial__text p")];

 
  lines.forEach((line) => {
    if (line.querySelector(".title-flip")) return;
    const txt = line.textContent.trim();
    line.innerHTML = `
      <span class="title-flip" aria-hidden="true">
        <span class="title-front">${txt}</span>
        <span class="title-back">${txt}</span>
      </span>
    `;
  });


  [label, image, ...lines, ...paras].filter(Boolean).forEach((el) => {
    el.classList.remove("is-visible");
    el.classList.add("reveal");
  });

 
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  if (label) io.observe(label);
  if (image) io.observe(image);
  paras.forEach((p) => io.observe(p));


  const ioLines = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      ioLines.unobserve(entry.target);
    });
  }, {
    threshold: 0.75,               
    rootMargin: "0px 0px -10% 0px"   
  });

  lines.forEach((l) => ioLines.observe(l));
})();



/* ===== ANIMAÇÃO SEÇÃO FRASE MISSAO ===== */
(() => {
  const statement = document.querySelector(".statement__text");
  if (!statement) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      statement.classList.add("is-visible");
      io.unobserve(statement);
    });
  }, { threshold: 0.3 });

  io.observe(statement);
})();



/* ===== ANIMAÇÃO SEÇÃO PORTFOLIO===== */
(() => {
  const section = document.querySelector(".portfolio");
  if (!section) return;

  const labelLine = section.querySelector(".portfolio__label span");
  const cards = [...section.querySelectorAll(".work-card")];


  const makeFlip = (el) => {
    if (!el || el.querySelector(".pill-flip")) return;

    const isLink = el.tagName.toLowerCase() === "a";
    const txt = (el.textContent || "").trim();
    if (!txt) return;

    
    el.innerHTML = `
      <span class="pill-flip" aria-hidden="true">
        <span class="pill-front">${txt}</span>
        <span class="pill-back">${txt}</span>
      </span>
    `;
  };

  cards.forEach((card) => {
    makeFlip(card.querySelector(".work-card__name"));
    makeFlip(card.querySelector(".work-card__whats"));
  });


  section.classList.remove("is-visible");
  cards.forEach((c) => {
    c.classList.remove("is-visible");
    c.style.transitionDelay = "0ms";
  });


  const ioSection = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        section.classList.add("is-visible");
        ioSection.unobserve(section);
      });
    },
    { threshold: 0.2 }
  );
  ioSection.observe(section);


  const ioCards = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const card = entry.target;
        const idx = cards.indexOf(card);

        
        const rowIndex = Math.floor(idx / 2);
        const delay = rowIndex * 180;

        card.style.transitionDelay = `${delay}ms`;
        card.classList.add("is-visible");

        ioCards.unobserve(card);
      });
    },
    { threshold: 0.18 }
  );

  cards.forEach((c) => ioCards.observe(c));
})();


// ===== FOOTER =====
(() => {

  const circleText = document.querySelector(".hi-footer__circleText");
  if (circleText && !circleText.dataset.built) {
    const text = circleText.getAttribute("data-text") || "";
    const chars = text.split("");
    const radius = 78; // ajuste fino do anel
    const step = 360 / Math.max(chars.length, 1);

    circleText.style.position = "absolute";
    circleText.style.inset = "0";

    circleText.innerHTML = chars
      .map((ch, i) => {
        const rot = i * step;
        return `<span style="
          position:absolute;
          left:50%;
          top:50%;
          transform: rotate(${rot}deg) translate(${radius}px) rotate(${90}deg);
          transform-origin: 0 0;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: .95;
        ">${ch === " " ? "&nbsp;" : ch}</span>`;
      })
      .join("");

    circleText.dataset.built = "1";
  }
})();

// ===== MENU MOBILE =====
(() => {
  const btn = document.querySelector(".menu-btn");
  const overlay = document.querySelector(".menu-overlay");
  const closeBtn = document.querySelector(".menu-close");
  const links = [...document.querySelectorAll(".menu-link")];

  if (!btn || !overlay || !closeBtn) return;

  const openMenu = () => {
    overlay.classList.add("is-open");
    document.body.classList.add("menu-open");
    btn.setAttribute("aria-expanded", "true");
    overlay.setAttribute("aria-hidden", "false");
  };

  const closeMenu = () => {
    overlay.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    btn.setAttribute("aria-expanded", "false");
    overlay.setAttribute("aria-hidden", "true");
  };

  btn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);

 
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeMenu();
  });

 
  links.forEach((a) => a.addEventListener("click", closeMenu));


  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
})();


// ===== SCROLL =====
(() => {
  const HEADER_OFFSET = 0;
  const DURATION = 1200;
  let rafId = null;

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function stopScroll() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function smoothScrollTo(targetY) {
    stopScroll();

    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = null;
      }
    }

    rafId = requestAnimationFrame(step);
  }


  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const targetY = target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
      smoothScrollTo(targetY);
    });
  });

  // BOTÃO "VOLTAR AO TOPO"
  const backBtn = document.querySelector(".hi-footer__back");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      smoothScrollTo(0);
    });
  }

})();