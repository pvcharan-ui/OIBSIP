// ================================
// Scroll Reveal Animation
// ================================

const sections = document.querySelectorAll("section");

const reveal = () => {

    const triggerBottom = window.innerHeight * 0.85;

    sections.forEach(section => {

        const sectionTop = section.getBoundingClientRect().top;

        if (sectionTop < triggerBottom) {

            section.classList.add("show");

        }

    });

};

window.addEventListener("scroll", reveal);

window.addEventListener("load", reveal);

// ================================
// Hero Fade Animation
// ================================

window.addEventListener("load", () => {

    const heroText = document.querySelector(".hero-text");
    const heroImage = document.querySelector(".hero-image");

    heroText.style.opacity = "0";
    heroText.style.transform = "translateX(-60px)";

    heroImage.style.opacity = "0";
    heroImage.style.transform = "translateX(60px)";

    setTimeout(() => {

        heroText.style.transition = "1s";
        heroText.style.opacity = "1";
        heroText.style.transform = "translateX(0)";

        heroImage.style.transition = "1s";
        heroImage.style.opacity = "1";
        heroImage.style.transform = "translateX(0)";

    }, 300);

});

// ================================
// Active Navigation
// ================================

const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {

    let current = "";

    document.querySelectorAll("section").forEach(section => {

        const sectionTop = section.offsetTop - 120;

        if (pageYOffset >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});

// ================================
// Image Hover Glow
// ================================

const image = document.querySelector(".hero-image img");

image.addEventListener("mouseenter", () => {

    image.style.boxShadow =
        "0 0 60px rgba(255,215,0,.6)";

});

image.addEventListener("mouseleave", () => {

    image.style.boxShadow =
        "0 25px 50px rgba(255,215,0,.25)";

});

// ================================
// Button Ripple Effect
// ================================

const button = document.querySelector(".btn");

button.addEventListener("click", () => {

    button.style.transform = "scale(.95)";

    setTimeout(() => {

        button.style.transform = "scale(1)";

    }, 150);

});