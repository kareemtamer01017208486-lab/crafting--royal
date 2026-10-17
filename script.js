// ===== Settings: change these two lines =====
const WHATSAPP_NUMBER = "201000000000"; // country code + number, no + or spaces
const HERO_IMAGE = "";                  // optional: "images/hero.jpg" to override the built-in hero photo
// ============================================

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const waLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// Hero image
if (HERO_IMAGE) document.querySelector(".hero-bg").style.setProperty("--hero-img", `url('${HERO_IMAGE}')`);

// WhatsApp links
document.querySelectorAll("[data-wa]").forEach((a) => {
  a.href = waLink(a.dataset.wa);
  a.target = "_blank";
  a.rel = "noopener";
});

// Header: background on scroll + mobile menu
const header = document.querySelector(".site-header");
const menuBtn = document.querySelector(".menu-btn");
const nav = document.getElementById("nav");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

// Hero parallax
const heroBg = document.querySelector("[data-parallax]");
if (!reduceMotion) {
  window.addEventListener("scroll", () => {
    if (window.scrollY < window.innerHeight) heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }, { passive: true });
}

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Portfolio filter
const chips = document.querySelectorAll(".chip");
const tiles = document.querySelectorAll(".tile");
chips.forEach((chip) =>
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    const f = chip.dataset.filter;
    tiles.forEach((t) => t.classList.toggle("hide", f !== "all" && t.dataset.cat !== f));
  })
);

// Lightbox
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCap = document.getElementById("lbCap");
let lastFocus = null;
const closeLb = () => { lb.hidden = true; if (lastFocus) lastFocus.focus(); };
tiles.forEach((t) =>
  t.addEventListener("click", () => {
    lastFocus = t;
    lbImg.style.backgroundImage = t.style.getPropertyValue("--img");
    lbCap.textContent = t.dataset.title;
    lb.hidden = false;
    lb.querySelector(".lb-close").focus();
  })
);
lb.querySelector(".lb-close").addEventListener("click", closeLb);
lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lb.hidden) closeLb(); });

// Counters (run once when the stats come into view)
const animateCount = (el) => {
  const target = +el.dataset.count;
  const pre = el.dataset.prefix || "";
  const suf = el.dataset.suffix || "";
  if (reduceMotion || target === 0) { el.textContent = pre + target + suf; return; }
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / 1400, 1);
    el.textContent = pre + Math.round(target * p) + suf;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const countIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { animateCount(e.target); countIO.unobserve(e.target); }
  });
}, { threshold: 0.6 });
document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

// Planner -> WhatsApp message
document.getElementById("plannerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target;
  const services = [...f.querySelectorAll("input[name=svc]:checked")].map((i) => i.value);
  const msg =
    `Hello Majestic Aura, I’d like a concept design.\n` +
    `Venue: ${f.venue.value}\n` +
    `Guests: ${f.guests.value}\n` +
    `Needs: ${services.length ? services.join(", ") : "Not sure yet, I’d like advice"}`;
  window.open(waLink(msg), "_blank", "noopener");
});