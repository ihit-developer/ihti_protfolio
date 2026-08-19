// Modern circular loader with real progress ring
(function () {
  const loaderEl = document.getElementById("loader");
  const progressBarEl = document.getElementById("loadingProgress");
  const percentageEl = document.getElementById("loadingPercentage");
  const ringEl = document.getElementById("loaderRingProgress");
  const RING_CIRCUMFERENCE = 339.29; // 2 * PI * r(54)

  let loadingProgress = 0;
  const loadingInterval = setInterval(() => {
    loadingProgress += 2;

    if (loadingProgress >= 100) {
      loadingProgress = 100;
      clearInterval(loadingInterval);
      progressBarEl.style.width = "100%";
      percentageEl.textContent = "100%";
      ringEl.style.strokeDashoffset = "0";

      setTimeout(() => {
        loaderEl.style.opacity = "0";
        setTimeout(() => {
          loaderEl.style.display = "none";
        }, 500);
      }, 300);
    } else {
      progressBarEl.style.width = loadingProgress + "%";
      percentageEl.textContent = Math.floor(loadingProgress) + "%";
      ringEl.style.strokeDashoffset =
        RING_CIRCUMFERENCE * (1 - loadingProgress / 100);
    }
  }, 50);
})();

// Page Scroll Progress + Navbar scroll state (consolidated, rAF-throttled for smooth scrolling)
const navbarEl = document.querySelector(".navbar");
const progressBarEl = document.getElementById("progressBar");
let scrollTicking = false;

function handleScroll() {
  if (window.scrollY > 50) {
    navbarEl.classList.add("scrolled");
  } else {
    navbarEl.classList.remove("scrolled");
  }

  const winScroll =
    document.documentElement.scrollTop || document.body.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  progressBarEl.style.width = scrolled + "%";

  scrollTicking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      requestAnimationFrame(handleScroll);
      scrollTicking = true;
    }
  },
  { passive: true },
);

// Custom Cursor - smooth, non-blocking (requestAnimationFrame + transform, no layout thrashing)
const cursorFollower = document.querySelector(".cursor-follower");
const cursorDot = document.querySelector(".cursor-dot");
const hasFinePointer =
  window.matchMedia && window.matchMedia("(pointer: fine)").matches;

if (cursorFollower && cursorDot && hasFinePointer) {
  let mouseX = -100,
    mouseY = -100;
  let followerX = -100,
    followerY = -100;
  let cursorActive = false;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!cursorActive) {
      cursorActive = true;
      cursorFollower.style.opacity = "1";
      cursorDot.style.opacity = "1";
    }
    // Dot tracks the pointer instantly
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  document.addEventListener("mouseleave", () => {
    cursorActive = false;
    cursorFollower.style.opacity = "0";
    cursorDot.style.opacity = "0";
  });

  // Follower eases toward the pointer every frame - smooth, single animation loop
  function animateCursorFollower() {
    followerX += (mouseX - followerX) * 0.16;
    followerY += (mouseY - followerY) * 0.16;
    cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursorFollower);
  }
  requestAnimationFrame(animateCursorFollower);

  // Cursor hover effects
  document
    .querySelectorAll(
      ".glass-btn, .cv-download-btn, .btn-primary, .project-action, .btn-hire",
    )
    .forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        cursorFollower.style.width = "60px";
        cursorFollower.style.height = "60px";
      });

      btn.addEventListener("mouseleave", () => {
        cursorFollower.style.width = "40px";
        cursorFollower.style.height = "40px";
      });
    });
} else if (cursorFollower && cursorDot) {
  // Touch / coarse-pointer devices don't need a custom cursor
  cursorFollower.style.display = "none";
  cursorDot.style.display = "none";
}

// Typing Effect
const typingText = document.getElementById("typingText");
const phrases = [
  "Web Developer",
  "UI/UX Designer",
  "Creative Thinker",
  "Problem Solver",
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typingText.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingText.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    setTimeout(() => (isDeleting = true), 2000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  setTimeout(typeEffect, isDeleting ? 50 : 100);
}

typeEffect();

// CV Download Function
function downloadCV() {
  alert("CV Download Started! 📄.");
  // Uncomment and update path when you have actual CV
  const link = document.createElement("a");
  link.href = "./CV_M_Ihtisham.pdf";
  link.download = "M_Ihtisham_CV.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const heroDownloadCVBtn = document.getElementById("heroDownloadCV");
if (heroDownloadCVBtn) {
  heroDownloadCVBtn.addEventListener("click", function (e) {
    e.preventDefault();
    downloadCV();
  });
}

document
  .getElementById("aboutDownloadCV")
  .addEventListener("click", function (e) {
    e.preventDefault();
    downloadCV();
  });

// Navbar scroll effect is handled in the consolidated scroll handler below

// Day / Night theme toggle
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");
  localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
});

// Mobile hamburger nav toggle (self-contained, no jQuery/Bootstrap JS needed)
const navToggler = document.getElementById("navToggler");
const navbarCollapseEl = document.getElementById("navbarNav");

function openNavMenu() {
  navbarCollapseEl.classList.add("show");
  navToggler.classList.add("active");
  navToggler.setAttribute("aria-expanded", "true");
}

function closeNavMenu() {
  navbarCollapseEl.classList.remove("show");
  navToggler.classList.remove("active");
  navToggler.setAttribute("aria-expanded", "false");
}

navToggler.addEventListener("click", () => {
  if (navbarCollapseEl.classList.contains("show")) {
    closeNavMenu();
  } else {
    openNavMenu();
  }
});

// Close menu when clicking outside of it
document.addEventListener("click", (e) => {
  const isClickInsideNav = e.target.closest(".navbar");
  if (!isClickInsideNav && navbarCollapseEl.classList.contains("show")) {
    closeNavMenu();
  }
});

// Close menu on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navbarCollapseEl.classList.contains("show")) {
    closeNavMenu();
  }
});

// Reset mobile menu state when resizing back to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 991) {
    closeNavMenu();
  }
});

// Close menu when a nav link is clicked
document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    if (navbarCollapseEl.classList.contains("show")) {
      closeNavMenu();
    }
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Skill bars animation
const skillsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressBars = entry.target.querySelectorAll(".progress-bar");
        progressBars.forEach((bar) => {
          const width = bar.getAttribute("data-width");
          setTimeout(() => (bar.style.width = width + "%"), 100);
        });
        skillsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);

const skillsSection = document.querySelector("#skills");
if (skillsSection) skillsObserver.observe(skillsSection);

// Form submission feedback
const contactForm = document.querySelector("#contact form");
contactForm.addEventListener("submit", (e) => {
  const submitBtn = contactForm.querySelector(".btn-primary");
  submitBtn.textContent = "Sending...";
  submitBtn.style.pointerEvents = "none";

  // Re-enable after 3 seconds (form will redirect)
  setTimeout(() => {
    submitBtn.textContent = "Send Message";
    submitBtn.style.pointerEvents = "auto";
  }, 3000);
});

// Entrance animations for sections
const observeElements = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 },
);

document
  .querySelectorAll(".project-card, .skill-box, .service-card")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observeElements.observe(el);
  });

// Console welcome message
console.log(
  "%c👋 Welcome to M.IHTISHAM Portfolio!",
  "color: #22c55e; font-size: 20px; font-weight: bold;",
);
console.log(
  "%cInterested in the code? Check out my GitHub!",
  "color: #15803d; font-size: 14px;",
);
