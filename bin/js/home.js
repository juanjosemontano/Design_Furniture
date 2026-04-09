gsap.registerPlugin(ScrollTrigger);

// ── 1. Animación de entrada ──────────────────────────────────
gsap.to(".overlay", {
  opacity: 0,
  duration: 2.2,
  ease: "power3.out",
  onComplete: () => {
    document.body.style.overflow = "visible";
    document.body.style.overflowX = "hidden";
  },
});

gsap.from(".hero-wrapper", {
  scale: 1.45,
  duration: 2.8,
  ease: "power3.out",
});

// Entrada escalonada del contenido del hero
gsap.from(".hero-eyebrow", {
  opacity: 0,
  y: 20,
  duration: 1,
  delay: 1.2,
  ease: "power2.out",
});

gsap.from("h1", {
  opacity: 0,
  y: 30,
  duration: 1.2,
  delay: 1.5,
  ease: "power2.out",
});

gsap.from("h2", {
  opacity: 0,
  y: 20,
  duration: 1,
  delay: 1.8,
  ease: "power2.out",
});

gsap.from(".btn", {
  opacity: 0,
  y: 16,
  duration: 0.9,
  delay: 2.1,
  ease: "power2.out",
});

// Scroll indicator bounce
const bounceTimeline = gsap.timeline({ repeat: -1, yoyo: true });
bounceTimeline.to(".scroll-indicator", {
  y: 10,
  opacity: 0.4,
  duration: 0.9,
  ease: "power1.inOut",
  delay: 2.5,
});

// ── 2. Timeline con scroll ───────────────────────────────────
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".scroll-container",
    scrub: 2,
    pin: true,
    start: "top top",
    end: "+=1300",
  },
});

// El hero se reduce a escala normal
tl.to(".hero-wrapper", { scale: 1, duration: 1 });

// Ocultar scroll indicator
tl.to(".scroll-indicator", { opacity: 0, duration: 0.3 }, "<");

// El contenido del hero desaparece hacia arriba
tl.to(".hero-content", { opacity: 0, y: -40, duration: 0.6 }, "<+=0.3");

// Aparece la segunda sección centrada
tl.to(".hero-2", { opacity: 1, duration: 1.5 }, "<+=0.3");