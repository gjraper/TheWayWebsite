// =============================================
// Page Transition
// =============================================
const overlay = document.getElementById('page-transition');

// On page load: overlay starts covering, then collapses to reveal the page
if (overlay) {
    // Begin fully covered (set instantly, no transition yet)
    overlay.style.clipPath = 'circle(150% at 50% 50%)';
    overlay.style.transition = 'none';

    // Force reflow so the browser registers the starting state
    overlay.getBoundingClientRect();

    // Now animate to uncovered
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.classList.add('uncover');
            overlay.style.clipPath = '';
            overlay.style.transition = '';
        });
    });
}

// Intercept internal navigation links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Skip: external links, new-tab links, anchor-only links, mailto/tel
    const isExternal = link.target === '_blank' || link.hostname !== window.location.hostname;
    const isAnchorOnly = href.startsWith('#');
    const isSpecial = href.startsWith('mailto:') || href.startsWith('tel:');

    if (isExternal || isAnchorOnly || isSpecial) return;

    e.preventDefault();

    if (!overlay) {
        window.location.href = href;
        return;
    }

    // Remove uncover, add cover to expand from center
    overlay.classList.remove('uncover');
    overlay.classList.add('cover');

    // After the cover animation completes, navigate
    overlay.addEventListener('transitionend', () => {
        window.location.href = href;
    }, { once: true });
});

// =============================================
// Header scroll effect
// =============================================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 150) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scroll for anchor navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// =============================================
// Mobile Menu Toggle
// =============================================
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        const icon = mobileMenu.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });
}

// =============================================
// Scroll Reveal Animation
// =============================================
const revealOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

document.querySelectorAll('.reveal').forEach(element => {
    revealObserver.observe(element);
});
